# Contributing to foundry-vtt-types

First off, thank you for your interest in contributing to foundry-vtt-types — we need all the help we can get!

The following is a set of guidelines for contributing to foundry-vtt-types. These are mostly guidelines, not rules. Use
your best judgment, and feel free to propose changes to this document in a pull request.

## Important Resources

- Documentation: [README.md](README.md), [Wiki](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/wiki)
- Issue tracker: [Issues](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues)
- Project boards
  - [Foundry VTT V9](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/projects/5)
- Communication: [League Discord](https://discord.gg/52DNPzqm2Z) (ask for the TypeScript related channels if you're not
  already in them)

## Ways of contributing

### Reporting bugs (i.e. wrong or missing types)

This section guides you through submitting a bug report for foundry-vtt-types. Following these guidelines helps
maintainers and the community understand your report and reproduce the behavior.

#### Before submitting a bug report

- Make sure you are using the latest version of foundry-vtt-types for the corresponding Foundry VTT Version.
- Check if the problem has already been reported in our
  [issue tracker](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues).

#### How to submit a (good) bug report

Bugs are tracked in our [issue tracker](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues). When
creating a bug report, please provide the following information by using the
[template](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/new?assignees=&labels=bug&template=wrong_type.md&title=).

- Provide the exact version of Foundry VTT and foundry-vtt-types that exhibits the problem.
- Provide minimal steps to reproduce the behavior.
- Describe the problem in a clear and concise way. This includes the actual behavior.
- Describe the expected behavior.
- Optionally, add any additional context if it makes sense.

### Requesting features

You can also suggest ideas for the project beyond plain Foundry VTT types. The guidelines are similar to those for bug
reporting. The most important one being: Use the
[template](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=)
to give all the relevant information about your request.

### Your first contribution

If you are unsure where to start, you can look through issues tagged with [help
wanted](https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).
These are issues that we would like to have help with.

We also recommend taking a look at the corresponding project board to make sure that nobody is working on your issue
yet. Additionally, please let us know if you start working on a specific issue (by writing a comment in that issue) so
that we can avoid doing duplicate work.

### Pull requests

#### Branching model

We use a very simple branching model. Development for the current Foundry VTT version happens on the `main` branch.
Additionally, we have branches for older supported Foundry VTT versions. They are named according to the Foundry VTT
version to which they belong (e.g. `foundry-0.8.x`). All changes for the type definitions for a given Foundry VTT
version need to be made through Pull Requests towards the corresponding branch.

#### Submitting pull requests

When creating a pull request, please provide the following information:

- What issue does this pull request correspond to (if any)?
- What does this pull request implement?
- What changes are made in this pull request?

## Style guides, General Guidelines, and Common Patterns

### Style

We use [prettier](https://prettier.io/) to automatically format the code and have ESlint check for the correct
formatting. This even runs automatically as a pre-commit hook, so usually you don't have to care for much here. However,
there is one additional style guideline that prettier doesn't enforce for us:

In TSDoc comments, always make sure to align the `-` for all `@param`s.

In very rare occasions, it is acceptable to disable prettier for a specific part of the code to improve the formatting
manually, e.g. for deeply nested conditional types, which are simply unreadable if we let prettier format them. See
[Prettier – Ignoring Code](https://prettier.io/docs/en/ignore.html#javascript) to find out how to do this.

### General Guidelines

1. Try to match the source code Foundry VTT as closely as possible in your type definitions. In particular, the order of
   declarations should be exactly the same. This allows for easy side by side viewing of the original source code and
   the type definitions, making the life of code reviewers much easier :)
2. Try not to pollute the global namespace with custom types that are not declared by Foundry VTT itself (typedefs from
   Foundry VTT should be declared). Instead, use a namespace named like the related class and put your custom type in
   there. Alternatively, if you don't want the type to be easily accessible at all, make your declaration file a module
   (e.g. by adding an empty export), declare the things should be visible globally in a `declare global {}` block and
   simply put the things that should _not_ be visible globally outside that block.
3. The file structure follows the structure of Foundry VTT but additionally, every class has its own file and the files
   are structured by class hierarchy. Declarations for code that is not a class should be structured in a sensible way,
   but there are no clear guidelines.
4. Generic utility types not defined in Foundry VTT belong in `src/types/utils.d.ts`.
5. Utility types that are specific to Foundry VTT belong in `src/types/helperTypes.d.ts`.
6. Augments for libraries bundled with Foundry VTT belong in their corresponding file in `src/types/augments`.
7. Write tests where applicable. Not everything needs to be tested, these are just type definitions after all. But in
   particular for complicated type definitions it makes a lot of sense to add tests.

### Common Patterns

#### Adding type definitions for a `getDefaultOptions` static property

If the type of the options is different from that of the parent class, provide a new `Options` `interface` in the
`namespace` of the class you are adding types for. It makes sense to add the default values in that type via
`@defaultValue` TSDoc. Use this interface as return type for `getDefaultOptions`.

If the type does not differ, just use the `Options` interface from the parent class.

In both cases, provide the default value for `getDefaultOptions` in TSDoc.

Example:

````typescript
declare class ActorSheet<Options extends ActorSheet.Options = ActorSheet.Options> extends DocumentSheet<
  Options,
  Actor.Implementation
> {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   height: 720,
   *   width: 800,
   *   template: "templates/sheets/actor-sheet.html",
   *   closeOnSubmit: false,
   *   submitOnClose: true,
   *   submitOnChange: true,
   *   resizable: true,
   *   baseApplication: "ActorSheet",
   *   dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
   *   token: null,
   * });
   * ```
   */
  static get defaultOptions(): ActorSheet.Options;
  /* ... */
}
````

#### Type for a class being used as a value (e.g. assigned to a variable)

If the type is not configurable by the user, it should most likely be `NameOfTheClass.AnyConstructor`. This will also
allow deriving classes to be used as value. In rare occasions (i.e. when really only instances of this specific class
may be assigned, no deriving classes), `typeof NameOfTheClass` can be used.

Example (`documentClass` is configurable, `collection` is not):

```typescript
/**
 * Configuration for the Actor document
 */
Actor: {
  /**
   * @defaultValue `Actor`
   */
  documentClass: ConfiguredDocumentClassOrDefault<typeof Actor>;

  /**
   * @defaultValue `Actors`
   */
  collection: Actors.AnyConstructor;
}
```

#### A property in `SCREAMING_SNAKE_CASE` is being assigned to a class after its definition in Foundry VTT

This is just a static property of the class. Add it to the class at the very bottom.

Example:

In Foundry VTT

```javascript
class AVSettings {
  /* ... */
}

AVSettings.AV_MODES = {
  DISABLED: 0,
  AUDIO: 1,
  VIDEO: 2,
  AUDIO_VIDEO: 3,
};
```

Type definition

```typescript
declare class AVSettings {
  /* ... */

  static AV_MODES: {
    DISABLED: 0;
    AUDIO: 1;
    VIDEO: 2;
    AUDIO_VIDEO: 3;
  };
}
```

#### Marking things for future changes

There are some comments we use to mark places in the code, where we should have a look later on. For things that could
be extended or improved later, but are not needed for the proper functioning of the types, TODO comments can be used.

```typescript
// TODO: Some description to explain what should be done
```

When updating types, especially between major Foundry versions, it happens that types are referenced in one class, that
are not defined or updated yet. In those cases FIXME comments should be used. Ideally those should also have the final
type code in their description. In general it is favorable to have these places just commented instead of the types not
compiling.

```typescript
// FIXME: SomeNotYetExistingType // This will be added in PR #...
```

## Final Words

If you've made it this far: Thanks for reading and for trying to contribute. It is much appreciated. We're hoping to see
you soon on the League Discord!
