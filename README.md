# tree-sitter-icelang

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

# Nvim-treesitter

To use it with [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/) put the following code in your nvim-treesitter configuration:

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

Then run `:TSInstall icelang`, nvim-treesitter doesn't actually support custom queries so you have to copy the queries in `queries/neovim/` manually in your runtime path: `queries/icelang/*` in order to get the actual features like highlighting.
