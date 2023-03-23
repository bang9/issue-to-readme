import * as core from '@actions/core'

import {getInputs} from './getInputs'
import {getOpenedIssues} from './getOpenedIssues'
import * as fs from 'fs'
import {asYYYYMM} from './yyyymm'
import {getContentFromIssue} from './getContentFromIssue'
import {closeIssue} from './closeIssue'
import {getOwner} from './getOwner'
import {commitPush} from './commitPush'

async function run(): Promise<void> {
  try {
    const {
      token,
      owner_only = 'false',
      starts_with = '',
      timezone = 'Asia/Seoul'
    } = getInputs(['token', 'starts_with', 'owner_only', 'timezone'])

    if (!token) throw new Error('token is required')

    const openedIssues = await getOpenedIssues({
      token,
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
        const section = `## ${date}\n`
        const content = getContentFromIssue(issue)

        readme = appendToReadme(readme, section, content)

        await closeIssue(token, issue.number)
        core.info(`Closed issue #${issue.number}: ${issue.title}`)
      } catch (error) {
        readme = tmpReadme
      }
    }

    core.info('Update README.md')
    fs.writeFileSync('README.md', readme, {encoding: 'utf-8'})

    const {name, email} = await getOwner(token)
    core.info(`Commit and push as ${name} <${email}>`)
    commitPush(name || 'owner', email || 'unknown@email.com')

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// 1. Write find section and append text to README.md function
// 2. Section search keyword is a date like "2023-01"
// 3. If not found, add new section and append text
function appendToReadme(readme: string, section: string, content: string) {
  const index = readme.indexOf(section)
  if (index < 0) {
    // not found
    readme += section + content
  } else {
    // found
    readme =
      readme.slice(0, index + section.length) +
      content +
      readme.slice(index + section.length)
  }
  return readme
}

run()
