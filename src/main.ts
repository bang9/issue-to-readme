import * as core from '@actions/core'

import {getInputs} from './actions/getInputs'
import {getOpenedIssues} from './github/getOpenedIssues'
import * as fs from 'fs'
import {asYYYYMM} from './utils/yyyymm'
import {getContentFromIssue} from './utils/getContentFromIssue'
import {updateIssue} from './github/updateIssue'
import {getOwner} from './github/getOwner'
import {commitPush} from './git/commitPush'
import {appendToReadme} from './utils/appendToReadme'

async function run(): Promise<void> {
  try {
    const {
      token,
      owner_only = 'false',
      starts_with = '',
      timezone = 'Asia/Seoul'
    } = getInputs(['token', 'starts_with', 'owner_only', 'timezone'])

    if (!token) throw new Error('github_token is required')

    const closedIssues: number[] = []
    const openedIssues = await getOpenedIssues({
      token: token,
      filter: {
        startsWith: starts_with,
        ownerOnly: JSON.parse(owner_only) as boolean
      }
    })

    core.info(`Opened issues: ${openedIssues.length}`)

    let readme = fs.readFileSync('README.md', {encoding: 'utf-8'})
    for (const issue of openedIssues) {
      let tmpReadme = readme

      try {
        const date = asYYYYMM(issue.created_at, timezone)
        const contentFromIssue = getContentFromIssue(issue)
        if (contentFromIssue) {
          const section = `## ${contentFromIssue.category || date}\n`
          const content = `${contentFromIssue.markdown}\n`
          readme = appendToReadme(readme, section, content)
        }
        await updateIssue(token, issue.number, 'closed')
        closedIssues.push(issue.number)
        core.info(`Close issue #${issue.number}: ${issue.title}`)
      } catch (error) {
        readme = tmpReadme
      }
    }

    core.info('Update README.md')
    fs.writeFileSync('README.md', readme, {encoding: 'utf-8'})
    try {
      const {name, email} = await getOwner(token)

      let authorName = name
      let authorEmail = email

      if (openedIssues.length === 1) {
        authorName = openedIssues[0].user?.name || name
        authorEmail = openedIssues[0].user?.email || email
      }

      core.info(`Commit and push as ${authorName} <${authorEmail}>`)
      commitPush(authorName, authorEmail)
    } catch {
      core.info('Commit and push failed, re-open issues')
      await Promise.all(
        closedIssues.map(async issueNum => updateIssue(token, issueNum, 'open'))
      )
    }

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
