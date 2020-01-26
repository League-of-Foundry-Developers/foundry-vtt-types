# Foundry Project Creator Types

This package provides type definitions for the Foundry VTT API, useful for both vanilla JS and TypeScript to get autocomplete, Intellisense, and type checking.

Unlike other packages, this will gradually be updated as I add more type definitions. Therefore, I will not use version numbers and tags to tag releases.

Due to how the Node Package Manager (NPM) works, it is not possible to simply update a package installed from Git using `npm install`. Simply reinstall the package with the command below to retrieve the latest version.

```
npm install --save-dev gitlab:foundry-projects/foundry-pc/foundry-pc-types
```

When using the CLI ([Foundry Project Creator](https://gitlab.com/foundry-projects/foundry-pc/create-foundry-project)), it will add this package to your project by default, and configure the `tsconfig.json` and add the above command as an npm script for you.

## Configuration
When not using my Project Creator, you need to manually configure your project to use the types.

TypeScript is configured with a `tsconfig.json` file in your project root. Add the following property to enable TS to use the Foundry API typings.

```json
{
	"compilerOptions": {
		"types": "foundry-pc-types"
	}
}
```

For vanilla JavaScript, you need a `jsconfig.json` file in your project root. It works the same as `tsconfig.json` but is configured to work on JavaScript by default. Certain IDEs such as Visual Studio Code recognize both files, and will set up Intellisense to use the types.