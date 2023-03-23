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
        uses: bang9/issue-to-readme@0.0.4
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
        uses: bang9/issue-to-readme@0.0.4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          owner_only: true
```

---

The `GITHUB_TOKEN` is a default secret provided by GitHub, which is automatically generated when a workflow is triggered.
It has the necessary permissions to access the repository and perform API requests.
you can edit permissions in the repository of [Settings > Actions > General > Workflow permissions].
