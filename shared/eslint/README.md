# eslint-plugin-mini-extensions

Custom rules for MiniExtensions

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-mini-extensions`:

```sh
npm install eslint-plugin-mini-extensions --save-dev
```

## Usage

Add `mini-extensions` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["mini-extensions"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "mini-extensions/rule-name": 2
    }
}
```

## Supported Rules

-   Fill in provided rules here
