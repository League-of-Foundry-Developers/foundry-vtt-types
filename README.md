# Foundry Project Creator Types

This package provides type definitions for the Foundry VTT API, useful for both vanilla JS and TypeScript to get autocomplete, Intellisense, and type checking.

Unlike other packages, this will gradually be updated as I add more type definitions. Therefore, I will not use version numbers and tags to tag releases.

Due to how the Node Package Manager (NPM) works, it is not possible to simply update a package installed from Git. The fastest and easiest way to install is to uninstall the package and reinstall it.

To quickly do this, execute the following commands inside the project directory:

```cmd
npm uninstall foundry-pc-types
npm install gitlab:foundry-projects/foundry-pc/foundry-pc-types
```