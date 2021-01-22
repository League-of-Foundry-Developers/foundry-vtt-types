# (Inofficial) Foundry VTT Types

<div align=center>

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![League Discord Server](https://img.shields.io/discord/732325252788387980?label=League%20of%20Extraordinary%20Foundry%20VTT%20Developers)](https://discord.gg/52DNPzqm2Z)  
![GitHub issues by-label](https://img.shields.io/github/issues-raw/kmoschcau/foundry-vtt-types/foundry%200.7.9?color=%23fe631d)
![GitHub closed issues by-label](https://img.shields.io/github/issues-closed-raw/kmoschcau/foundry-vtt-types/foundry%200.7.9?color=%23fe631d)

</div>

## Introduction

This was originally created by @NickEastNL for his Project Creator over on
[GitLab](https://gitlab.com/foundry-projects/foundry-pc/foundry-pc-types). This
fork is an attempt to update the types to 0.7.9 of Foundry and to provide better
maintenance.

## Installing

```bash
npm install --save-dev github:kmoschcau/foundry-vtt-types
```

## Configuration

Add the project to your types section in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "foundry-vtt-types"
    ]
  }
}
```

## Contributing

The work for enhancing this to the current Foundry version is done in the
`foundry-0.7.9` branch. Merge requests for splitting up the work are welcome,
otherwise I will just work through this from top to bottom of the original
foundry.js file.
