import * as core from '@actions/core'

export function getInputs<T extends string>(names: T[]) {
  return names.reduce((accum, name) => {
    const input = core.getInput(name)
    if (input) accum[name] = input
    return accum
  }, {} as Record<T, string>)
}
