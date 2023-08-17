import {execSync} from 'child_process'

export function commitPush(name: string, email: string) {
  execSync(`git config --global user.name "${name}"`)
  execSync(`git config --global user.email "${email}"`)
  execSync('git add README.md')
  execSync('git commit -m "Update README.md"')
  execSync('git push')
}
