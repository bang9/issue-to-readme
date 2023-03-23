export function appendToReadme(
  readme: string,
  section: string,
  content: string
) {
  const index = readme.indexOf(section)
  if (index < 0) {
    // not found
    readme = section + content + readme
  } else {
    // found
    readme =
      readme.slice(0, index + section.length) +
      content +
      readme.slice(index + section.length)
  }
  return readme
}
