# tree-sitter-icelang

[![Build/test](https://github.com/luckasRanarison/tree-sitter-icelang/actions/workflows/ci.yml/badge.svg)](https://github.com/luckasRanarison/tree-sitter-icelang/actions/workflows/ci.yml)
[![crates.io](https://img.shields.io/crates/v/tree-sitter-icelang)](https://crates.io/crates/tree-sitter-icelang)

[icelang](https://github.com/luckasRanarison/icelang) grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter)

# Build

```bash
# install tree-sitter-cli with cargo or npm
cargo install tree-sitter-cli
# or
npm i -g tree-sitter-cli

# generate parser
tree-sitter generate
```

## Neovim

To use it in Neovim, you have install the parser manually by adding the following code in your [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/) configuration, and run `:TSInstall icelang`.

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.icelang = {
  install_info = {
    url = "https://github.com/luckasRanarison/tree-sitter-icelang",
    files = { "src/parser.c" },
    branch = "master",
  },
  filetype = "icelang",
}
```

To get syntax highlightings, folds and indents, you can use the repository as plugin by installing it with your package manager.

Lazy:

```lua
return { "luckasRanarison/tree-sitter-icelang" }
```

Packer:

```lua
use { "luckasRanarison/tree-sitter-icelang" }
```
