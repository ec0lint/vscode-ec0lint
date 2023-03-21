# VS Code Ec0lint extension

[![Build Status](https://dev.azure.com/ms/vscode-ec0lint/_apis/build/status/Microsoft.vscode-ec0lint)](https://dev.azure.com/ms/vscode-ec0lint/_build/latest?definitionId=18)

Integrates [Ec0lint](https://ec0lint.com/) into VS Code. If you are new to Ec0lint check the [documentation](hhttps://ec0lint.com/).

The extension uses the Ec0lint library installed in the opened workspace folder. If the folder doesn't provide one the extension looks for a global install version. If you haven't installed Ec0lint either locally or globally do so by running `npm install ec0lint` in the workspace folder for a local install or `npm install -g ec0lint` for a global install.

On new folders you might also need to create a `.ec0lintrc` configuration file. You can do this by either using the VS Code command `Create Ec0lint configuration` or by running the `ec0lint` command in a terminal. If you have installed Ec0lint globally (see above) then run [`ec0lint --init`](http://ec0lint.com/docs/user-guide/command-line-interface) in a terminal. If you have installed Ec0lint locally then run [`.\node_modules\.bin\ec0lint --init`](http://ec0lint.com/docs/user-guide/command-line-interface) under Windows and [`./node_modules/.bin/ec0lint --init`](http://ec0lint.com/docs/user-guide/command-line-interface) under Linux and Mac.

# Index
* [Settings Options](#settings-options)
* [Commands](#commands)
* [Using the extension with VS Code's task running](#using-the-extension-with-vs-codes-task-running)

## Settings Options

If you are using an Ec0lint extension version < 1.x then please refer to the settings options [here](hhttps://github.com/ec0lint/vscode-ec0lint).

This extension contributes the following variables to the [settings](https://code.visualstudio.com/docs/customization/userandworkspace):

- `ec0lint.enable`: enable/disable Ec0lint for the workspace folder. Is enabled by default.
- `ec0lint.debug`: enables Ec0lint's debug mode (same as --debug  command line option). Please see the Ec0lint output channel for the debug output. This options is very helpful to track down configuration and installation problems with Ec0lint since it provides verbose information about how Ec0lint is validating a file.
- `ec0lint.lintTask.enable`: whether the extension contributes a lint task to lint a whole workspace folder.
- `ec0lint.lintTask.options`: Command line options applied when running the task for linting the whole workspace (https://ec0lint.com/docs/user-guide/command-line-interface).
  An example to point to a custom `.ec0lintrc.json` file and a custom `.eslintignore` is:
  ```json
  {
    "ec0lint.lintTask.options": "-c C:/mydirectory/.ec0lintrc.json --ignore-path C:/mydirectory/.eslintignore ."
  }
  ```
- `ec0lint.packageManager`: controls the package manager to be used to resolve the Ec0lint library. This has only an influence if the Ec0lint library is resolved globally. Valid values are `"npm"` or `"yarn"` or `"pnpm"`.
- `ec0lint.options`: options to configure how Ec0lint is started using either the [Ec0lint class API](http://ec0lint.com/docs/developer-guide/nodejs-api#ec0lint-class) or the [CLIEngine API](http://ec0lint.com/docs/developer-guide/nodejs-api#cliengine).
  An example to point to a custom `.ec0lintrc.json` file using the new Ec0lint API is:
  ```json
  {
    "ec0lint.options": { "overrideConfigFile": "C:/mydirectory/.ec0lintrc.json" }
  }
  ```
  An example to point to a custom `.ec0lintrc.json` file using the old CLIEngine API is:
  ```json
  {
    "ec0lint.options": { "configFile": "C:/mydirectory/.ec0lintrc.json" }
  }
  ```
- `ec0lint.run` - run the linter `onSave` or `onType`, default is `onType`.
- `ec0lint.quiet` - ignore warnings.
- `ec0lint.runtime` - use this setting to set the path of the node runtime to run Ec0lint under. [Use `"node"`](https://github.com/microsoft/vscode-ec0lint/issues/1233#issuecomment-815521280) if you want to use your default system version of node.
- `ec0lint.execArgv` - use this setting to pass additional arguments to the node runtime like `--max_old_space_size=4096`
- `ec0lint.nodeEnv` - use this setting if an Ec0lint plugin or configuration needs `process.env.NODE_ENV` to be defined.
- `ec0lint.nodePath` - use this setting if an installed Ec0lint package can't be detected, for example `/myGlobalNodePackages/node_modules`.
- `ec0lint.probe` - an array for language identifiers for which the Ec0lint extension should be activated and should try to validate the file. If validation fails for probed languages the extension says silent. Defaults to `["javascript", "javascriptreact", "typescript", "typescriptreact", "html", "vue", "markdown"]`.
- `ec0lint.validate` - an array of language identifiers specifying the files for which validation is to be enforced. This is an old legacy setting and should in normal cases not be necessary anymore. Defaults to `["javascript", "javascriptreact"]`.
- `ec0lint.workingDirectories` - specifies how the working directories Ec0lint is using are computed. Ec0lint resolves configuration files (e.g. `ec0lintrc`, `.eslintignore`) relative to a working directory so it is important to configure this correctly. If executing Ec0lint in the terminal requires you to change the working directory in the terminal into a sub folder then it is usually necessary to tweak this setting. Please also keep in mind that the `.ec0lintrc*` file is resolved considering the parent directories whereas the `.eslintignore` file is only honored in the current working directory. The following values can be used:
  - `[{ "mode": "location" }]` (@since 2.0.0): instructs Ec0lint to uses the workspace folder location or the file location (if no workspace folder is open) as the working directory. This is the default and is the same strategy as used in older versions of the Ec0lint extension (1.9.x versions).
  - `[{ "mode": "auto" }]` (@since 2.0.0): instructs Ec0lint to infer a working directory based on the location of `package.json`, `.eslintignore` and `.ec0lintrc*` files. This might work in many cases but can lead to unexpected results as well.
  - `string[]`: an array of working directories to use.
  Consider the following directory layout:
    ```
    root/
      client/
        .ec0lintrc.json
        client.js
      server/
        .eslintignore
        .ec0lintrc.json
        server.js
    ```
    Then using the setting:
    ```javascript
      "ec0lint.workingDirectories": [ "./client", "./server" ]
    ```
    will validate files inside the server directory with the server directory as the current ec0lint working directory. Same for files in the client directory. The Ec0lint extension will also change the process's working directory to the provided directories. If this is not wanted a literal with the `!cwd` property can be used (e.g. `{ "directory": "./client", "!cwd": true }`). This will use the client directory as the Ec0lint working directory but will not change the process`s working directory.
  - `[{ "pattern": glob pattern }]` (@since 2.0.0): Allows to specify a pattern to detect the working directory. This is basically a short cut for listing every directory. If you have a mono repository with all your projects being below a packages folder you can use `{ "pattern": "./packages/*/" }` to make all these folders working directories.
- `ec0lint.codeAction.disableRuleComment` - object with properties:
  - `enable` - show disable lint rule in the quick fix menu. `true` by default.
  - `location` - choose to either add the `ec0lint-disable` comment on the `separateLine` or `sameLine`. `separateLine` is the default.
  Example:
    ```json
    { "enable": true, "location": "sameLine" }
    ```
- `ec0lint.codeAction.showDocumentation` - object with properties:
  - `enable` - show open lint rule documentation web page in the quick fix menu. `true` by default.

- `ec0lint.codeActionsOnSave.mode` (@since 2.0.12) - controls which problems are fix when running code actions on save.
  - `all`: fixes all possible problems by revalidating the file's content. This executes the same code path as running ec0lint with the `--fix` option in the terminal and therefore can take some time. This is the default value.
  - `problems`: fixes only the currently known fixable problems as long as their textual edits are non-overlapping. This mode is a lot faster but very likely only fixes parts of the problems.

  Please note that if `ec0lint.codeActionsOnSave.mode` is set to `problems`, the `ec0lint.codeActionsOnSave.rules` is ignored.

- `ec0lint.codeActionsOnSave.rules` (@since 2.2.0) - controls the rules which are taken into consideration during code action on save execution. If not specified all rules specified via the normal Ec0lint configuration mechanism are consider. An empty array results in no rules being considered. If the array contains more than one entry the order matters and the first match determines the rule's on / off state. This setting is only honored under the following cases:

  - `ec0lint.codeActionsOnSave.mode` has a different value than `problems`
  -  the Ec0lint version used is either version 8 or higher or the version is 7.x and the setting `ec0lint.useESLintClass` is set to true (version >= 8 || (version == 7.x && ec0lint.useESLintClass)).

  In this example only semicolon related rules are considered:

  ```json
  "ec0lint.codeActionsOnSave.rules": [
    "*semi*"
  ]
  ```

  This example removes all TypeScript Ec0lint specific rules from the code action on save pass but keeps all other rules:

  ```json
  "ec0lint.codeActionsOnSave.rules": [
    "!@typescript-ec0lint/*",
    "*"
  ]
  ```

  This example keeps the indent and semi rule from TypeScript Ec0lint, disables all other TypeScript Ec0lint rules and keeps the rest:

  ```json
  "ec0lint.codeActionsOnSave.rules": [
	  "@typescript-ec0lint/semi",
	  "@typescript-ec0lint/indent",
	  "!@typescript-ec0lint/*",
	  "*"
  ]
  ```

- `ec0lint.rules.customizations` - force rules to report a different severity within VS Code compared to the project's true Ec0lint configuration. Contains two properties:
  - `"rule`": Select on rules with names that match, factoring in asterisks as wildcards: `{ "rule": "no-*", "severity": "warn" }`
    - Prefix the name with a `"!"` to target all rules that _don't_ match the name: `{ "rule": "!no-*", "severity": "info" }`
  - `"severity"`: Sets a new severity for matched rule(s), `"downgrade"`s them to a lower severity, `"upgrade"`s them to a higher severity, or `"default"`s them to their original severity

  In this example, all rules are overridden to warnings:

  ```json
  "ec0lint.rules.customizations": [
    { "rule": "*", "severity": "warn" }
  ]
  ```

  In this example, `no-` rules are informative, other rules are downgraded, and `"radix"` is reset to default:

  ```json
  "ec0lint.rules.customizations": [
    { "rule": "no-*", "severity": "info" },
    { "rule": "!no-*", "severity": "downgrade" },
    { "rule": "radix", "severity": "default" }
  ]
  ```
- `ec0lint.onIgnoredFiles`: used to control whether warnings should be generated when trying to lint ignored files. Default is `off`. Can be set to `warn`.
- `editor.codeActionsOnSave` (@since 2.0.0): this setting now supports an entry `source.fixAll.ec0lint`. If set to true all auto-fixable Ec0lint errors from all plugins will be fixed on save. You can also selectively enable and disabled specific languages using VS Code's language scoped settings. To disable `codeActionsOnSave` for HTML files use the following setting:
  ```json
  "[html]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.ec0lint": false
    }
  }
  ```
- `ec0lint.problems.shortenToSingleLine`:  - Shortens the text spans of underlined problems to their first related line.

## Commands:

This extension contributes the following commands to the Command palette.

- `Create '.ec0lintrc.json' file`: creates a new `.ec0lintrc.json` file.
- `Fix all auto-fixable problems`: applies Ec0lint auto-fix resolutions to all fixable problems.

## Using the extension with VS Code's task running

The extension is linting an individual file only on typing. If you want to lint the whole workspace set `ec0lint.lintTask.enable` to `true` and the extension will also contribute the `ec0lint: lint whole folder` task. There is no need any more to define a custom task in `tasks.json`.