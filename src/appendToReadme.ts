import {README_SECTION_START} from './constants'

export function appendToReadme(
  readme: string,
  section: string,
  content: string
) {
  const index = readme.indexOf(section)
  if (index < 0) {
    // find section start
    const start = readme.indexOf(README_SECTION_START)
    if (start < 0) {
      // not found
      readme = section + content + readme
    } else {
      // found
      readme =
        readme.slice(0, start + README_SECTION_START.length) +
        section +
        content +
        readme.slice(start + README_SECTION_START.length)
    }
  } else {
    // found
    readme =
      readme.slice(0, index + section.length) +
      content +
      readme.slice(index + section.length)
  }
  return readme
}
