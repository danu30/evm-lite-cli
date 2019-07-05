# EVM-Lite CLI

> A Command Line Interface to interact with EVM-Lite.

[![npm version](https://badge.fury.io/js/evm-lite-cli.svg)](https://badge.fury.io/js/evm-lite-cli)

## Table of Contents

1. [Installation](#Installation)
2. [Development](#Development)
3. [Data Directory](#Data-Directory)
4. [Commands](#Commands)
5. [Getting Started](docs/getting-started.md)
6. [Proof of Authority](docs/proof-of-authority.md)

## Installation

You can easily install `evmlc` with NPM

```bash
npm install -g evm-lite-cli
```

or with `yarn`

```bash
yarn global add evm-lite-cli
```

## Development

To begin with, you will need to install Node and NPM, which are bundled together
in the installation package from the [Node website](https://nodejs.org/en/).

This project was built with Node version `10.16.0`.

Firstly you will need to install dependencies

```bash
npm install
```

or with `yarn`

```bash
yarn install
```

This should also transpile typescript files into `dist/`.

For development, it is advised to use

```bash
npm run i
```

to test the CLI. This is a wrapper script which runs the CLI directly from the source files.

Alternatively you can run `npm link` and access the CLI through `evmlc` however any changes made to the source files needs to be transpiled before changes are seen.

## Data Directory

The first time `evmlc` runs, and if no options are specified, it creates a
special directory in a default location (`~/.evmlc` on Linux and Mac), where it
stores any relevant information. In particular, this directory contains the
following items:

-   **config.toml**: where global options are specified. These values may be
    overwritten by CLI flags.
-   **keystore**: where all encrypted account keys are stored.

### `config.toml`

Example config.toml:

```toml
[connection]
host = "127.0.0.1"
port = 8000

[defaults]
from = "0x702B0ad02a7a6056EB16A697A96d849c228F5fB4"
gas = 1000000000000
gasPrice = 0
```

The easiest way to manage configuration is through the `config` command in
interactive mode.

```bash
$ evmlc i
  _______     ____  __       _     _ _          ____ _     ___
 | ____\ \   / /  \/  |     | |   (_) |_ ___   / ___| |   |_ _|
 |  _|  \ \ / /| |\/| |_____| |   | | __/ _ \ | |   | |    | |
 | |___  \ V / | |  | |_____| |___| | ||  __/ | |___| |___ | |
 |_____|  \_/  |_|  |_|     |_____|_|\__\___|  \____|_____|___|

 Mode:        Interactive
 Data Dir:    [...]/.evmlc
 Config File: [...]/.evmlc/config.toml
 Keystore:    [...]/.evmlc/keystore

evmlc$
```

To change default configuration values run `config set` or `c s`. You will be
taken to an interactive prompt to change connection and default values.

```bash
evmlc$ config set

? Host: 127.0.0.1
? Port: 8000
? From: 0x702B0ad02a7a6056EB16A697A96d849c228F5fB4
? Gas: 1000000000000
? Gas Price: 0
```

## Commands

By default, all commands will output raw JSON or strings unless the `-f, --formatted` flag
is provided.

The global flag `-d, --datadir` specifies the directory where `keystore` and `config.toml` are stored unless overwritten by specific flags.

_Note: that if this flag is not provided, it will default to `~/.evmlc`._

```bash
evmlc --datadir [path] interactive
```
