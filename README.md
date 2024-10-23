# Prisma Drop Migration Warning


## Description

**Prisma Drop Migration Warning ** is a GitHub Action that checks for table or column drops in Prisma migration files. It helps ensure that potentially unsafe changes are caught before they are merged into your main branch.

## Features

- Detects any `DROP TABLE` or `DROP COLUMN` statements in Prisma migration SQL files.
- Provides an option to post a warning comment on the pull request if a drop is detected.
- Allows configuration of the main branch to compare against and the path to the Prisma migrations.

## Inputs

The following inputs can be configured in your workflow:

| Input           | Description                                                            | Required | Default |
|-----------------|------------------------------------------------------------------------|----------|---------|
| `main-branch`   | The main branch to compare against (e.g., `main`)                     | Yes      | `main`  |
| `path`          | Path to the Prisma folder (e.g., `prisma`)                            | Yes      | `prisma`|
| `message`       | The message to post when a potential drop is detected                  | No       | A default warning message |
| `warning`       | Whether to post a warning comment on the PR if a drop is detected      | No       | `true`  |

## Usage

To use this action in your GitHub repository, include it in your workflow YAML file as follows:

```yaml
name: Check Prisma Migrations

on:
  pull_request:
    branches:
      - main

jobs:
  check-migrations:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

        with:
          fetch-depth: 0  # Fetch full history for all branches to detect changes
          ref: ${{ github.event.pull_request.head.sha }}  # Check out the current PR

      - name: Check Prisma Migrations
        uses: ./path/to/action  # Adjust the path to your action's directory
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Set the GitHub token to access API
        with:
          main-branch: 'main'
          path: 'prisma'
          message: 'Potential drop detected in Prisma migration files.'
          warning: true
```



