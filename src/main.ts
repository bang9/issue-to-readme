import * as core from '@actions/core'

import {getInputs} from './getInputs'
import {getOpenedIssues} from './getOpenedIssues'
import * as fs from 'fs'
import {asYYYYMM} from './yyyymm'

async function run(): Promise<void> {
  try {
    const {
      token,
      owner_only = 'false',
      starts_with = '',
      timezone = 'Asia/Seoul'
    } = getInputs(['token', 'starts_with', 'owner_only', 'timezone'])

    if (!token) throw new Error('token is required')

    const activeIssues = await getOpenedIssues({
      token,
      filter: {
        startsWith: starts_with,
        ownerOnly: JSON.parse(owner_only) as boolean
      }
    })

    core.info(`Active issues: ${activeIssues.length}`)

    const readme = fs.readFileSync('README.md', {encoding: 'utf-8'})
    core.info(`README.md: ${readme}`)

    for (const issue of activeIssues) {
      const date = asYYYYMM(issue.created_at, timezone)
      core.info(
        `Issue: ${issue.title} (${date}) / ${issue.body}/ ${issue.body_text}`
      )
    }

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
