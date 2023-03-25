# Github Actions for Updating README with Closed Issues

This GitHub Actions updates the README.md file of a repository by adding closed issues grouped by month.<br/>
It does this by reading the open issues, creating a new section in the README for each month, and then marking the issue as closed.<br/>
If there is an error while updating the README or committing the changes, it will reopen the closed issues.

## Inputs

- token (required): The GitHub token to authenticate the API requests.
- owner_only: Whether to filter only issues created by the owner of the repository (true or false, default is false).
- starts_with: A prefix to filter issues by title (default is empty string).
- timezone: The timezone to use when grouping issues by month (default is Asia/Seoul).

## Usage

To use this GitHub Actions, create a new YAML file in the `.github/workflows` directory of your repository.

Here is a issues opened example:

```yaml
name: Update readme (issues opened)
on:
  issues:
    types: [opened]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Update
        uses: bang9/issue-to-readme@0.0.5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          owner_only: true
```

Here is a cron example:

```yaml
name: Update readme (cron)
on:
  schedule:
    - cron: '0 0 * * 1'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Update
        uses: bang9/issue-to-readme@0.0.5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          owner_only: true
```

Here is a manual trigger example:

```yaml
name: Update readme (manual)
on: workflow_dispatch
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Update
        uses: bang9/issue-to-readme@0.0.5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          owner_only: true
```

## Rules

### Issues

The content of an issue should be in the following format by default:

```text
title: Some title
link: Some link
```

If `title` is not provided in the content, the issue title will be used as a substitute.

The issues entered in this format are recorded in the README.md file in the following format:

```markdown
## YYYY-MM

- [Title](Link)
- [Title](Link)
```

`YYYY-MM` is the section in which the issues are grouped, and if the issue content contains a category field, the section will be replaced with the category name:

```text
title: Some title
link: Some link
category: Article
```

```markdown
## Article

- [Title](Link)
- [Title](Link)
```

### README.md

If you want to add a new section to the middle of the README instead of appending it to the start, you can use the following markup in your README.md file:

```markdown
your contents

[//]: # 'SECTION_START'

<!-- Content will be added here -->

your contents
```

---

The `GITHUB_TOKEN` is a default secret provided by GitHub, which is automatically generated when a workflow is triggered.
It has the necessary permissions to access the repository and perform API requests.
you can edit permissions in the repository of [Settings > Actions > General > Workflow permissions].
