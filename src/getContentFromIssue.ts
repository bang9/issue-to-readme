export function getContentFromIssue(issue: {
  title: string
  body?: null | string
}) {
  let title = issue.title
  let body = issue.body || ''

  const bodies = body.split('\n')
  if (bodies.length > 1) {
    bodies.forEach(body => {
      const [_key, _value] = body.trim().split(':')
      if (_key && _value) {
        const key = _key.trim().toLowerCase()
        const value = _value.trim()

        if (key === 'title') title = value
        if (key === 'url' || key === 'link') body = value
      }
    })
  }

  return markdown(title, body)
}

function markdown(title: string, url: string) {
  return `- [${title}](${url})\n`
}
