import * as github from '@actions/github'

export async function getOwner(token: string) {
  const octokit = github.getOctokit(token)
  const {data} = await octokit.rest.users.getByUsername({
    username: github.context.repo.owner
  })
  return {
    name: data.name || 'github-actions[bot]',
    email: data.email || 'github-actions[bot]@users.noreply.github.com'
  }
}
