import * as core from '@actions/core'
import {getInputs} from './getInputs'

async function run(): Promise<void> {
  try {
    const {token} = getInputs(['token'])
    core.info(`token: ${token}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
