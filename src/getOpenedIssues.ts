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

  return issues.data
    .filter(issue => predicateStartsWith(issue, filter.startsWith))
    .filter(issue => predicateOwnerOnly(issue, filter.ownerOnly))
}

function predicateStartsWith(issue: {title: string}, text = '') {
  return issue.title.startsWith(text)
}
function predicateOwnerOnly(
  issue: {user: {login: string} | null},
  ownerOnly = false
) {
  if (ownerOnly) return issue.user?.login === github.context.repo.owner
  else return true
}
