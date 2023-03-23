import * as github from '@actions/github'

export async function updateIssue(
  token: string,
  issueNumber: number,
  state: 'closed' | 'open'
) {
  const octokit = github.getOctokit(token)
  await octokit.rest.issues.update({
    ...github.context.repo,
    state,
    issue_number: issueNumber
  })
}
