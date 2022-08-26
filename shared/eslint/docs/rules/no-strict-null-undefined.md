# Disallows strict null or undefined checks (disallow-strict-null-undefined-checks)

In the marketplace app and the website, methods may return null or undefined. Since these methods should be treated the same, performing conditional logic using a strict null or undefined check may introduce bugs.

## Rule Details

This rule aims to identify and flag these strict null or undefined checks

Examples of **incorrect** code for this rule:

```js
let val = null;

if (value === null) {
    console.log("guess I'm null");
}
```

Examples of **correct** code for this rule:

```js
let val = null;

if (value == null) {
    console.log('null today');
}
```
