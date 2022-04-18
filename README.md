# foundry-vtt-types

<div align=center>

<img align=center src="./media/img/league-logo-ts.svg" alt="League Logo TS" width="150"/>

TypeScript type definitions for [Foundry Virtual Tabletop](https://foundryvtt.com/) (unofficial)

[![League Discord Server](https://img.shields.io/discord/732325252788387980?label=League%20of%20Extraordinary%20Foundry%20VTT%20Developers)](https://discord.gg/52DNPzqm2Z)
![GitHub V9 issues by-label](https://img.shields.io/github/issues-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%20V9?color=%23fe631d)
![GitHub closed V9 issues by-label](https://img.shields.io/github/issues-closed-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%20V9?color=%23fe631d)
![GitHub V10 issues by-label](https://img.shields.io/github/issues-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%20V10?color=%23fe631d)
![GitHub closed V10 issues by-label](https://img.shields.io/github/issues-closed-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%20V10?color=%23fe631d)
[![npm (tag)](https://img.shields.io/npm/v/@league-of-foundry-developers/foundry-vtt-types/latest)](https://www.npmjs.com/package/@league-of-foundry-developers/foundry-vtt-types)

</div>

## Supported Foundry VTT versions

We aim to support the latest release of each Foundry VTT version (0.7, 0.8, 9, etc.), starting with 0.7.

At the moment, versions 0.7, 0.8, and 9 are fully supported. Work on support for version 10 is just starting out. See the [open foundry V10 issues](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues?q=is%3Aopen+is%3Aissue+label%3A%22foundry+V10%22) to keep track of the progress.

## Installation

You can install foundry-vtt-types from the [npm registry](https://npmjs.org/).

In order to install the latest version, run

```sh
npm install --save-dev @league-of-foundry-developers/foundry-vtt-types
```

In order to install a specific version run

```sh
npm install --save-dev @league-of-foundry-developers/foundry-vtt-types@<version>
```

For example, to install version `9.268.0`, run

```sh
npm install --save-dev @league-of-foundry-developers/foundry-vtt-types@9.268.0
```

You can then update foundry-vtt-types using the regular update mechanism for npm
(see [npm update](https://docs.npmjs.com/cli/v7/commands/npm-update)).

## Versioning scheme

The versions of the foundry-vtt-types correspond to the releases of Foundry VTT. The versioning scheme of Foundry VTT
changed with version 9, so the versioning scheme for the foundry-vtt-types also changes with that version:
* For Foundry VTT version 0.7 and 0.8, the versioning scheme is
  ```
  0.<foundy-minor-version>.<foundry-patch-version>-<increment>
  ```
* For Foundry VTT version 9 and onwards, the versioning scheme is
  ```
  <foundry-version>.<foundry-build>.<increment>
  ```
In both cases, `increment` is a number that increases with every individual release of the foundry-vtt-types for that
Foundry VTT release.

## Usage

Add foundry-vtt-types to your types section in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@league-of-foundry-developers/foundry-vtt-types"],
    "moduleResolution": "node",
    "strictNullChecks": true,
  }
}
```

This will make the type definitions available globally in your project.

Make sure you are using `"moduleResolution": "node"`, too. It is required for some dependencies to be resolved
correctly.

Also make sure to set `"strictNullChecks": true` because otherwise, some conditional types used in the type definitions
resolve incorrectly, and you will see a lot of errors. Alternatively, you can just set `"strict": true`, which
implicitly sets `strictNullChecks`. This is actually what we **recommend**, but it's not required.

You can find some information about how to actually work with the type definitions in the
[Wiki](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/wiki). A good starting point is
the [FAQ](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/wiki/FAQ).

## Acknowledgments

Originally forked from [Foundry Project Creator Types](https://gitlab.com/foundry-projects/foundry-pc/foundry-pc-types)
by [@NickEastNL](https://gitlab.com/NvanOosten)

## Contributing

Contributions are very welcome in order to decrease the individual workload. Filing issues for wrong / missing types is
also a great way to help us improve the type definitions.

Development on the current version of Foundry VTT is done on the `main` branch. Additionally, we keep branches for the
older version of Foundry VTT that we still support. These branches are named according to the Foundry VTT version they
correspond to. For example, the branch for Foundry VTT 0.8 is called `foundry-0.8.x`. All work to improve the type
definitions needs to be done through Pull Requests to the relevant branch.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to contribute.

If you have any specific questions, feel free to contact us in the
[League of Extraordinary Foundry Developers Discord](https://discord.gg/52DNPzqm2Z).

## Type-Checking, Linting, Testing

When contributing, make sure that the type checks pass, the linter is green and the tests are green. We _do_ have
checks in the CI but running this locally also helps you while developing and saves you time as you don't have to wait
for the CI.

You can run type checking and linting with the following command:

```
npm run lint
```

You can run the tests with

```
npm run test
```

## Creating a release

To create a release, you have to create a new release commit, tag it and create a GitHub release from that. The CI will
handle the rest.

```
npm version <release-type>
git push --follow-tags
```

## License

This project is licensed under the MIT license. You can find a copy at [LICENSE](LICENSE).
