import * as core from '@actions/core'

import {getInputs} from './getInputs'
import {getOpenedIssues} from './getOpenedIssues'

async function run(): Promise<void> {
  try {
    const {
      token,
      owner_only = 'false',
      starts_with = ''
    } = getInputs(['token', 'starts_with', 'owner_only'])

    if (!token) throw new Error('token is required')

    const activeIssues = await getOpenedIssues({
      token,
      filter: {
        startsWith: starts_with,
        ownerOnly: JSON.parse(owner_only) as boolean
      }
    })

    core.info(`Active issues: ${activeIssues.length}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
