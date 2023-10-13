# How to contribute to `export-to-csv`

Thank you for wanting to make `export-to-csv` better in some way!

## Bugs, questions and feature requests

### Bugs

If you've encountered an issue with the library and it doesn't work as outlined in the [README.md](README.md), please open an Issue and follow the template.

### Questions and feature requests

Not sure how the library works or have a suggestion to make the library better? Please start a Discussion on GitHub and add your question or ideas for features there.

Don't shy away from details, either! The better thought out your Discussion, the more likely we all are to have a better time at working together.

## Submitting a pull request

This repository uses [bun](https://bun.sh/) to build and run unit tests, and [playwright](https://playwright.dev/) for end-to-end testing.

We also do our best to keep things relatively type-safe.

If you're fixing a bug, ensure that all the tests still run after making your changes by running:

```bash
bun run test && bun run e2e
```

If you're adding a new feature, please add new tests to cover the feature's functionality. Most new features can probably be covered by adding a new test to `main.spec.ts`. One for the CSV output, and one for the TXT output.
If your new feature requires a new helper function in `helpers.ts`, add a test to cover the helper functionality as well.

Once your Pull Request is ready to be reviewed, it will go through a few automated checks to ensure tests pass and that the formatting is correct. Your Pull Request is only be merged once it's been reviewed, approved and the checks pass.

## Conventions

This project uses [prettier](https://prettier.io/) for formatting source code. Upon opening a Pull Request, a check will be done to ensure consistent formatting with the repository's rules in `.prettierrc.json`.

### The format check in the Pull Request is failing, what do I do?

Run `bun run format` from the root of the project, commit any changes to your working branch and push.
