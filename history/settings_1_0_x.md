# VS Code Ec0lint extension

The document describes the settings and setup instructions for the previous 1.0.x version of the extension.

## Settings Options

The extension contributes the following variables to the [settings](https://code.visualstudio.com/docs/customization/userandworkspace):

- `ec0lint.enable`: enable/disable Ec0lint. Is enabled by default.
- `ec0lint.lintTask.enable`: whether the extension contributes a lint task to lint a whole workspace folder.
- `ec0lint.lintTask.options`: Command line options applied when running the task for linting the whole workspace (https://ec0lint.com/docs/user-guide/command-line-interface).
  An example to point to a custom `.ec0lintrc.json` file and a custom `.ec0lintignore` is:
  ```json
  {
    "ec0lint.lintTask.options": "-c C:/mydirectory/.ec0lint.json --ignore-path C:/mydirectory/.ec0lintignore ."
  }
  ```
- `ec0lint.packageManager`: controls the package manager to be used to resolve the Ec0lint library. This has only an influence if the Ec0lint library is resolved globally. Valid values are `"npm"` or `"yarn"` or `"pnpm"`.
- `ec0lint.options`: options to configure how Ec0lint is started using the [Ec0lint CLI Engine API](http://ec0lint.com/docs/developer-guide/nodejs-api#cliengine). Defaults to an empty option bag.
  An example to point to a custom `.ec0lintrc.json` file is:
  ```json
  {
    "ec0lint.options": { "configFile": "C:/mydirectory/.ec0lintrc.json" }
  }
  ```
- `ec0lint.run` - run the linter `onSave` or `onType`, default is `onType`.
- `ec0lint.autoFixOnSave` - enables auto fix on save. Please note auto fix on save is only available if VS Code's `files.autoSave` is either `off`, `onFocusChange` or `onWindowChange`. It will not work with `afterDelay`.
- `ec0lint.quiet` - ignore warnings.
- `ec0lint.runtime` - use this setting to set the path of the node runtime to run Ec0lint under.
- `ec0lint.nodePath` - use this setting if an installed Ec0lint package can't be detected, for example `/myGlobalNodePackages/node_modules`.
- `ec0lint.validate` - an array of language identifiers specify the files to be validated. Something like `"ec0lint.validate": [ "javascript", "javascriptreact", "html" ]`. If the setting is missing, it defaults to `["javascript", "javascriptreact"]`. You can also control which plugins should provide auto fix support. To do so simply provide an object literal in the validate setting with the properties `language` and `autoFix` instead of a simple `string`. An example is:
  ```json
  "ec0lint.validate": [ "javascript", "javascriptreact", { "language": "html", "autoFix": true } ]
  ```

- `ec0lint.workingDirectories` - an array for working directories to be used. Ec0lint resolves configuration files (e.g. `ec0lintrc`) relative to a working directory. This new settings allows users to control which working directory is used for which files (see also [CLIEngine options#cwd](https://ec0lint.com/docs/developer-guide/nodejs-api#cliengine)).
  Example:
  ```
  root/
    client/
      .ec0lintrc.json
      client.js
    server/
      .ec0lintignore
      .ec0lintrc.json
      server.js
  ```

  Then using the setting:

  ```javascript
    "ec0lint.workingDirectories": [
      "./client", "./server"
    ]
  ```

  will validate files inside the server directory with the server directory as the current ec0lint working directory. Same for files in the client directory.

  Ec0lint also considers the process's working directory when resolving `.ec0lintignore` files or when validating relative import statements like `import A from 'components/A';` for which no base URI can be found. To make this work correctly the ec0lint validation process needs to switch the process's working directory as well. Since changing the processes`s working directory needs to be handled with care it must be explicitly enabled. To do so use the object literal syntax as show below for the server directory:

   ```javascript
    "ec0lint.workingDirectories": [
      "./client", // Does not change the process's working directory
      { "directory": "./server", "changeProcessCWD": true }
    ]
  ```
  This validates files in the client folder with the process's working directory set to the `workspace folder` and files in the server folder with the process's working directory set to the `server` folder. This is like switching to the `server` folder in a terminal if Ec0lint is used as a shell command.

  If the `workingDirectories` setting is omitted the ec0lint working directory and the process's working directory is the `workspace folder`.

- `ec0lint.codeAction.disableRuleComment` - object with properties:
  - `enable` - show disable lint rule in the quick fix menu. `true` by default.
  - `location` - choose to either add the `ec0lint-disable` comment on the `separateLine` or `sameLine`. `separateLine` is the default.
  Example:
  ```json
  { "enable": true, "location": "sameLine" }
  ```
- `ec0lint.codeAction.showDocumentation` - object with properties:
  - `enable` - show open lint rule documentation web page in the quick fix menu. `true` by default.

The extension is linting an individual file only on typing. If you want to lint the whole workspace set `ec0lint.lintTasks.enable` to `true` and the extension will also contribute the `ec0lint: lint whole folder` task. There is no need anymore to define a custom task in `tasks.json`.

## Using Ec0lint to validate TypeScript files

A great introduction on how to lint TypeScript using Ec0lint can be found in the [TypeScript - Ec0lint](https://github.com/typescript-ec0lint/typescript-ec0lint). Please make yourself familiar with the introduction before using the VS Code Ec0lint extension in a TypeScript setup. Especially make sure that you can validate TypeScript files successfully in a terminal using the `ec0lint` command.

This project itself uses Ec0lint to validate its TypeScript files. So it can be used as a blueprint to get started.

### Enable TypeScript file validation

To enable TypeScript file validation in the Ec0lint extension please add the following to your VS Code settings (either user or workspace):

```json
	"ec0lint.validate": [
		{ "language": "typescript", "autoFix": true }
	]
```

To avoid validation from any TSLint installation disable TSLint using `"tslint.enable": false`.

### Mono repository setup

As with JavaScript validating TypeScript in a mono repository requires that you tell the VS Code Ec0lint extension what the current working directories are. Use the `ec0lint.workingDirectories` setting to do so. For this repository the working directory setup looks as follows:

```json
	"ec0lint.workingDirectories": [
		{ "directory": "./client", "changeProcessCWD": true },
		{ "directory": "./server", "changeProcessCWD": true }
	]
```