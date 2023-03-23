export function getContentFromIssue(issue: {
  title: string
  body?: null | string
}) {
  const context = {
    title: issue.title,
    category: '',
    url: '',
    link: ''
  }

  const reservedKey = Object.keys(context) as (keyof typeof context)[]
  const keyValue = (issue.body || '').split('\n')
  if (keyValue.length > 0) {
    keyValue.forEach(obj => {
      const text = obj.trim()

      reservedKey.forEach(key => {
        if (text.startsWith(`${key}:`)) {
          context[key] = text.replace(`${key}:`, '').trim()
        }
      })
    })
  }

  return {
    ...context,
    markdown: markdown(
      context.title,
      context.url || context.link || issue.body || ''
    )
  }
}

function markdown(title: string, url: string) {
  return `- [${title}](${url})\n`
}
