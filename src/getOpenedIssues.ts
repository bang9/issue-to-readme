import * as core from '@actions/core'
import * as github from '@actions/github'

type Options = {
  token: string
  filter: {
    startsWith?: string
    ownerOnly?: boolean
  }
}
export async function getOpenedIssues({token, filter}: Options) {
  const octokit = github.getOctokit(token)
  const issues = await octokit.rest.issues.listForRepo({
    state: 'open',
    ...github.context.repo
  })

  core.info(JSON.stringify(issues.data?.[0]?.user, null, 2))

  return issues.data
    .filter(issue => predicateStartsWith(issue, filter.startsWith))
    .filter(issue => predicateOwnerOnly(issue, filter.ownerOnly))
}

function predicateStartsWith(issue: {title: string}, text = '') {
  return issue.title.startsWith(text)
}
function predicateOwnerOnly(
  issue: {user: {name?: string | null} | null},
  ownerOnly = false
) {
  if (ownerOnly) return issue.user?.name === github.context.repo.owner
  else return true
}
