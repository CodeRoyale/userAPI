### Developer

# How To Contribute

## How to make a Pull Request (PR) to CodeRoyale

- Contributors who are already active members of the CodeRoyale GitHub organization can make a branch within the CodeRoyale organization repo. Note: This is the preferred method, since it allows other members of the organization to directly push changes to the branch (with fewer steps), and allows work as a group on larger features.

- Each pull request (PR) should be addressing/closing an open issue. Usually.

- Before submitting a PR or updating an existing PR, you should make sure your code follows our [Style Guide](https://github.com/CodeRoyale/codeRoyale-api) and passes the relevant [tests](https://github.com/CodeRoyale/codeRoyale-api).

- The PR title should be useful and descriptive.

  - Titles of PR, Issues, and commits should be <= 50 characters. Usually.

  - The PR title should not include the issue #.

  - To help developers, system administrators, and users who are reading the release notes, please categorize your contribution by formatting your PR title as follows:

  ```
  [<TYPE>:<MODULE>] <SUBJECT>
  ```

  - Where `TYPE` is one of the following:

    - 🎉 Initial commit
    - 🔖 Version tag
    - ✨ New feature
    - 🐛 Bugfix
    - 📇 Metadata
    - 📚 Documentation
    - 📗 Documenting source code
    - 💡 Improve code logic
    - 🐎 Performance
    - 💄 Cosmetic
    - 🚨 Tests
    - ✅ Adding a test
    - ✔️ Make a test pass
    - ⚡ General update
    - 🎨 Improve format/structure
    - 🔨 Refactor code
    - 🔥 Removing code/files
    - 💚 Continuous Integration
    - 🔒 Security
    - ⬆️ Upgrading dependencies
    - ⬇️ Downgrading dependencies
    - 👕 Lint
    - 👽 Translation
    - 📝 Text
    - 🚑 Critical hotfix
    - 🚀 Deploying stuff
    - 🍎 Fixing on MacOS
    - 🐧 Fixing on Linux
    - 🏁 Fixing on Windows
    - 🚧 Work in progress
    - 👷 Adding CI build system
    - 📈 Analytics or tracking code
    - ➖ Removing a dependency
    - ➕ Adding a dependency
    - 🐳 Docker
    - 🔧 Configuration files
    - 📦 Package.json in JS
    - 🔀 Merging branches
    - 💩 Bad code / need improv.
    - ⏪ Reverting changes
    - 💥 Breaking changes
    - 👌 Code review changes
    - ♿ Accessibility
    - 🚚 Move/rename repository
    - ❔ Other

  - And `MODULE` is one of the following:

    - Api,
    - Auth, or
    - Code-Setup

  - And `SUBJECT` adds more specific details.

    Note that #<PR NUMBER> is appended to the title automatically by GitHub when the PR is merged with “squash & merge”. Do not include this when you open a new pull request.

- If your PR is Work In Progress, please make a [Draft_Pull_Request](https://github.blog/2019-02-14-introducing-draft-pull-requests/) on GitHub. This indicates to other developers and reviewers that you’d like detailed feedback on your work, but it is incomplete. When a PR is in the draft state it cannot be merged into the master branch. Note that draft pull requests will run the “Github Actions - Branch” test suite, but will skip the more extensive “Github Actions - Pull Request” test suite.

- The body of the PR should describe the purpose of the PR.

  - When merged, this PR body will be part of the documentation for the next CodeRoyale release. Thus, the contents should be understandable to an average CodeRoyale instructor user or system administrator. The description can include links to related issues or PRs, but this description should not require the user to follow links to have a general understanding of the PR purpose.

  - Include the string Closes #1234 or Fixes #1234 within the top comment of the PR so that GitHub issue will be automatically closed when the pull request is merged.

  - The commit message should talk about WHAT changed, and WHY. Not HOW. How is the diff, and you don’t need to repeat it.

  - Comments explaining the code should be in the code, rather than in the PR message or comments.

  - The comments should explain a bit about the purpose/history/overview – don’t assume the reader knows it (or link to the issue that explains everything).

  - The comments should explain a bit about the purpose/history/overview – don’t assume the reader knows it (or link to the issue that explains everything).

  - Be explicit about what you want feedback on, or why you are asking for specific reviewers.

## Status Codes used in API
 - `201` Created
 - `200` Success
 - `401` Not Authorization
 - `403` Access to that resource is forbidden
 - `406` Acceptable values are undefined in the request
 - `409` Coflict Error
 - `500` Server Error

## How to document API

- Follow the order to keep the documentation clear and clean
- All the api documentation files to be kept inside the \_docs folder

1.  Specify the tag

```
// Tag
/**
* @swagger
* tags:
*   name: ABC
*   description:
*/
```

2.  Following up with the Modal Schema Definition

```
// ABC Schema
/**
* @swagger
*  components:
*    schemas:
*      ABC:
*/
```

3.  Add all the components that will be used to define the responses

```
// Sample components used in the responses
/**
* @swagger
*  components:
*    schemas:
*      AddABC:
*        type: object
*        properties:
*          message:
*            type:
*            description:
*        example:
*/
```

4.  Add all the paths with their method and responses

```
//  paths with their method and responses
/**
* @swagger
* path:
*  /ABC/:
*    post:
*      summary:
*      tags: [ABC]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/AddABC'
*      responses:
*        "200":
*        "401":
*/
```
