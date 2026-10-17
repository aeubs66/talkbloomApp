# Contributing to TalkBloom

Thank you for helping improve TalkBloom. Bug reports, documentation fixes, accessibility improvements, and focused pull requests are welcome.

## Report a bug or suggest an idea

Search the [existing issues](https://github.com/aeubs66/talkbloomApp/issues) first, then [open an issue](https://github.com/aeubs66/talkbloomApp/issues/new) with:

- A clear description of the problem or proposed improvement.
- Steps to reproduce, plus expected and actual behavior for bugs.
- Your browser and environment, where relevant.
- Screenshots with credentials and personal information removed.

For security concerns, follow [SECURITY.md](SECURITY.md) instead of posting sensitive details publicly.

## Make a change

1. Follow the [README setup instructions](README.md#getting-started).
2. Create a branch with a descriptive name.
3. Keep your change focused and follow the surrounding TypeScript and component conventions.
4. Run `npm run lint` and `npm run build` with the required development environment configured. Use `npm run format` to check formatting; avoid unrelated formatting changes.
5. Open a pull request explaining the problem, your change, and how you checked it. Include before-and-after screenshots for visual changes.

Use a separate development database. The database seed and reset scripts delete data; inspect them before running them. Never commit your `.env` file or real credentials.

## Community

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md), keep feedback constructive, and respect the work and attribution of other contributors.
