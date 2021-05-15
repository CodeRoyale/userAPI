<a href="https://coderoyale.netlify.app/"><p align="center">
<img height=100 src="public/Coderoyale.jpeg"/>

</p></a>
<p align="center">
  <strong>Making competitive programming more fun and better!</strong>
</p>
<p align="center">
  <a href="https://discord.gg/aCKem4h8te">
    <img src="https://img.shields.io/discord/841533336581308416.svg?style=for-the-badge" alt="discord - users online" />
  </a>
</p>

<h3 align="center">
  <a href="https://github.com/CodeRoyale/codeRoyale-api/blob/master/CONTRIBUTING.md">Contribute</a>
  <span> · </span>
  <a href="https://discord.gg/aCKem4h8te">Community</a>
  <span> · </span>
  <a href="https://coderoyale-userapi.herokuapp.com/docs">Documentation</a>
</h3>

---

## Structure

| Module           | Description |
| :--------------- | :---------: |
| [frontend](https://github.com/CodeRoyale/codeRoyale-frontend) |    desc     |
| [lobby](https://github.com/CodeRoyale/codeRoyale-lobby)    |    desc     |
| [questionAPI](https://github.com/CodeRoyale/codeRoyale-Question-api)    |    desc     |
| [userAPI](https://github.com/CodeRoyale/codeRoyale-user-api)    |    desc     |




## Branches

- development -> pr this branch for everything
- master -> don't touch, this is what's running in production

## Contributions

userAPI is open to contributions, but I recommend creating an issue for letting us know about the feature you are working upon.
Please read [CONTRIBUTING.md](https://github.com/CodeRoyale/codeRoyale-api/blob/master/CONTRIBUTING.md)

See also the list of [contributors](https://github.com/orgs/CodeRoyale/people) who participated in this project.

## Reviewers

Contributors helping to review/merge pull requests:

- [@SAchu47](https://github.com/SAchu47)
- [@sastaachar](https://github.com/sastaachar)
- [@naveen-770](https://github.com/naveen-770)
- [@donald0109](https://github.com/donald0109)
- [@vuld0](https://github.com/vuld0)
- [@Rec0iL99](https://github.com/Rec0iL99)

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](link) for details on our code of conduct.

## How to run locally

### Setup and run

To setup the project locally follow the instructions:

#### Fork

_**Note**_: _This is only needed if you want to contribute to the project._

If you want to contribute to the project you will have to create your own copy of the project on GitHub. You can do this by clicking the Fork button that can be found on the top right corner of the [landing page](https://github.com/CodeRoyale/codeRoyale-user-api) of the repository.

#### Clone

_**Note**_: _For this you need to install git on your machine. You can download the git tool from [here](https://git-scm.com/downloads)._

- If you have forked the project, run the following command -

  `git clone https://github.com/YOUR_GITHUB_USER_NAME/codeRoyale-user-api`

  where `YOUR_GITHUB_USER_NAME` is your GitHub handle.

- If you haven't forked the project, run the following command -

  `git clone https://github.com/CodeRoyale/codeRoyale-user-api`

#### Remote

_**Note**_: _This is only needed if you want to contribute to the project._

When a repository is cloned, it has a default remote named `origin` that points to your fork on GitHub, not the original repository it was forked from. To keep track of the original repository, you should add another remote named upstream. For this project it can be done by running the following command -

`git remote add upstream https://github.com/CodeRoyale/codeRoyale-user-api`

You can check that the previous command worked by running `git remote -v`. You should see the following output:

```
$ git remote -v
origin  https://github.com/YOUR_GITHUB_USER_NAME/codeRoyale-user-api (fetch)
origin  https://github.com/YOUR_GITHUB_USER_NAME/codeRoyale-user-api (push)
upstream        https://github.com/CodeRoyale/codeRoyale-user-api (fetch)
upstream        https://github.com/CodeRoyale/codeRoyale-user-api (push)
```

### Run app

Download the latest stable version of NodeJs [here](https://nodejs.org/en/download/) and install it. Run `node --version` to verify successful installation.

To get the User API running locally:

- Clone this repository
- `npm install --also=dev` to install all required dependencies
- `npm run server` to start the local server with nodemon


## Why did you make this?

The goal of CodeRoyale is to create Competitive Programming platform where users can have coding battle with friends, random users and team battles to show case your DSA skills.

## Attribution


