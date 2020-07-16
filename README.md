# Lumio

![Animation](animation.gif)

[Lumio](https://lumio.app) is a reactive visual programming IDE for [Clarity](https://clarity-lang.org/). It allows you to program Clarity smart contracts using drag and drop. It is reactive in the sense that it keeps track of custom definitions and updates those in place in real time. It also features inline help for all built-in keywords and functions, and custom ones in the future.

You can try it out on https://lumio.app. 

Clarity code is represented by symbol objects and these are validated and transpiled by the Lumio transpiler. It is still possible to generate invalid code with Lumio. It currently does not insert placeholders when placing custom functions, for example. However, it features [Clarity REPL](https://github.com/lgalabru/clarity-repl) support to analyse the generated code.

This is a submission for the Clarity tooling hackathon.

## Install

1. Clone this repository.
2. `cd lumio`.
3. `npm install`.
4. `npm run dev` to run the [development server](http://localhost:5000) or `npm run build` to build.

Run tests with `npm test`.

You can generate docs using `npm run jsdoc` (install jsdoc using `npm install -g jsdoc`).

## Clarity REPL

Lumio offers basic support for the [Clarity REPL](https://github.com/lgalabru/clarity-repl) to analyse your smart contracts. A build script is included to fetch, build, and place the WASM in the right directory. You will need to have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Rust](https://www.rust-lang.org/tools/install) installed in order to build the REPL. You will also need to install `wasm-pack` using cargo. ( `cargo install wasm-pack`.)

Building the WASM:

```
npm run build:repl
```

The build script assumes the URL of the [Clarity REPL git repository]((https://github.com/lgalabru/clarity-repl)), you can override this by passing a different URL as a parameter:

```
npm run build:repl <url>
```

The build script will not automatically rebuild the WASM if it detects it in the build directory. Manually delete the file or execute the clean command:

```
npm run clean:repl
```

## To-dos:

- Blockstack login to save and load your smart contracts.
- Add custom symbol support to the validator and transpiler.
- Interactive tutorial.
- Sample projects.
