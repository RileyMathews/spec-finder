# spec-finder README

Spec Finder is a simple extension that will automatically open up the tests for your currently open source file. It currently works by making the assumption that the full name of your source file is contained within the filename of your test file. If multiple files are found that meet this requirement it will prompt you for which one to open.

## How to use
The extension adds the command `spec-finder.open-test-file` to the command pallet under `Open Spec`. You can either run this through the command pallet `cmd + shift + p` or by adding a keybinding for it.
