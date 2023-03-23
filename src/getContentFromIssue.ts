export function getContentFromIssue(issue: {
  title: string
  body?: null | string
}) {
  let title = issue.title
  let content = issue.body || ''

  const keyValue = content.split('\n')
  if (keyValue.length > 0) {
    keyValue.forEach(obj => {
      const [_key, ..._value] = obj.trim().split(':')
      if (_key && _value.join('')) {
        const key = _key.trim().toLowerCase()
        const value = _value.join('').trim()

        if (key === 'title') title = value
        if (key === 'url' || key === 'link') content = value
      }
    })
  }

  return markdown(title, content)
}

function markdown(title: string, url: string) {
  return `- [${title}](${url})\n`
}
