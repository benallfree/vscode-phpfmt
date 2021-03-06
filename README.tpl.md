# phpfmt for Visual Studio Code

[![Version](https://vsmarketplacebadge.apphb.com/version/kokororin.vscode-phpfmt.svg)](https://marketplace.visualstudio.com/items?itemName=kokororin.vscode-phpfmt)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/installs/kokororin.vscode-phpfmt.svg)](https://marketplace.visualstudio.com/items?itemName=kokororin.vscode-phpfmt)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/kokororin.vscode-phpfmt.svg)](https://marketplace.visualstudio.com/items?itemName=kokororin.vscode-phpfmt)

[![Build Status](https://travis-ci.org/kokororin/vscode-phpfmt.svg?branch=master)](https://travis-ci.org/kokororin/vscode-phpfmt)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/kokororin/vscode-phpfmt.svg)](https://isitmaintained.com/project/kokororin/vscode-phpfmt "Average time to resolve an issue")
[![Percentage of issues still open](https://isitmaintained.com/badge/open/kokororin/vscode-phpfmt.svg)](https://isitmaintained.com/project/kokororin/vscode-phpfmt "Percentage of issues still open")

The missing phpfmt extension for Visual Studio Code using [phpfmt](https://github.com/phpfmt-next/fmt).

## Read this first

If you believe you found a bug or problem with [phpfmt](https://github.com/phpfmt-next/fmt), please **don't open an issue in this repository**.  
This project is just an extension for [phpfmt](https://github.com/phpfmt-next/fmt).

## Installation

Open command palette <kbd>F1</kbd> and select `Extensions: Install Extension`, then search for phpfmt.

**Note**: PHP >= 5.6 is required.  
(https://github.com/phpfmt-next/fmt#requirements)  

**Note**: For Windows users, see [#1](https://github.com/kokororin/vscode-phpfmt/issues/1)

## Usage

<kbd>F1</kbd> -> `phpfmt: format this file`

or keyboard shortcut `ctrl+shift+i` which is Visual Studio Code default formatter shortcut

or right mouse context menu `Format Document` or `Format Selection`

### Format On Save
Respects `editor.formatOnSave` setting.

You can turn off format-on-save on a per-language basis by scoping the setting:

```json
// Set the default
"editor.formatOnSave": false,
// Enable per-language
"[php]": {
    "editor.formatOnSave": true
}
```

## Configuration

| Key | Type | Description | Default |
| -------- | ----------- | ----------- | ----------- |
%CONFIG%

## Contribute

### Running extension
- Open this repository inside VSCode
- Debug sidebar
- `Launch Extension`

### Running tests
- Open this repository inside VSCode
- Debug sidebar
- `Launch Tests`
