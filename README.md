# foundry-vtt-types



<div align=center>

TypeScript type definitions for [Foundry Virtual Tabletop](https://foundryvtt.com/) (unofficial)

[![League Discord Server](https://img.shields.io/discord/732325252788387980?label=League%20of%20Extraordinary%20Foundry%20VTT%20Developers)](https://discord.gg/52DNPzqm2Z)
![GitHub 0.7.9 issues by-label](https://img.shields.io/github/issues-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%200.7.9?color=%23fe631d)
![GitHub closed 0.7.9 issues by-label](https://img.shields.io/github/issues-closed-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%200.7.9?color=%23fe631d)
![GitHub 0.8.0 issues by-label](https://img.shields.io/github/issues-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%200.8.0?color=%23fe631d)
![GitHub closed 0.8.0 issues by-label](https://img.shields.io/github/issues-closed-raw/League-of-Foundry-Developers/foundry-vtt-types/foundry%200.8.0?color=%23fe631d)

</div>

## Supported Foundry VTT versions

At the moment, only 0.7.9 is supported. Work on 0.8.0 is in the pipeline.

## Installation

You can install foundry-vtt-types from the [npm registry](https://npmjs.org/). We provide distribution tags for the different supported Foundry VTT versions that have the form `fvtt-<foundry-version>`. For example, the distribution tag for Foundry VTT 0.7.9 is `fvtt-0.7.9`.

In order to install the desired version, run

```sh
npm install --save-dev @league-of-foundry-developers/foundry-vtt-types@fvtt-<foundry-version>
```

For example, to install the type definitions for Foundry VTT 0.7.9, run

```sh
npm install --save-dev @league-of-foundry-developers/foundry-vtt-types@fvtt-0.7.9
```

You can then update foundry-vtt-types using the regular update mechanism for npm (see [npm update](https://docs.npmjs.com/cli/v7/commands/npm-update)).

## Usage

Add foundry-vtt-types to your types section in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["foundry-vtt-types"],
    "moduleResolution": "node"
  }
}
```

This will make the type definitions available globally in your project.

Make sure you are using `"moduleResolution": "node"`, too. It is required for some dependencies to be resolved correctly.

You can find some information about how to actually work with the type definitions in the [Wiki](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/wiki). For example, [[0.7.9] Actors and Items](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/wiki/%5B0.7.9%5D-Actors-and-Items) describes how to set up custom `Actor` and `Item` classes for 0.7.9 using the types.


## Acknowledgments

Originally forked from [Foundry Project Creator Types](https://gitlab.com/foundry-projects/foundry-pc/foundry-pc-types) by [@NickEastNL](https://gitlab.com/NvanOosten)

## Contributing

Contributions are very welcome in order to decrease the individual workload. Filing issues for wrong / missing types is also a great way to help us improve the type definitions.

There are individual branches for the different supported Foundry VTT versions that are being worked on. They are named according to the Foundry VTT version, e.g. the branch for Foundry VTT 0.7.9 is called `foundry-0.7.9`. All work to improve the type definitions for a specific version needs to be done through Pull Requests to the corresponding branch.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to contribute.

If you have any specific questions, feel free to contact us in the [League of Extraordinary Foundry Developers Discord](https://discord.gg/52DNPzqm2Z).

## Type-Checking, Linting, Testing

When contributing, make sure sure that the type checks pass, the linter is green and the tests are green. We _do_ have checks in the CI but running this locally also helps you while developing and saves you time as you don't have to wait for the CI.

You can run type checking and linting with the following command:

```
npm run lint
```

You can run the tests with

```
npm run test
```


## License

This project is licensed under the MIT license. You can find a copy at [LICENSE](LICENSE).
