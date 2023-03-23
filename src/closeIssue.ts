import * as github from '@actions/github'

export async function closeIssue(token: string, issueNumber: number) {
  const octokit = github.getOctokit(token)
  await octokit.rest.issues.update({
    ...github.context.repo,
    state: 'closed',
    issue_number: issueNumber
  })
}
