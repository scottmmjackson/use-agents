# use-agents

A CLI tool to manage context file configurations for AI coding assistants, specifically supporting the `AGENTS.md` standard.

[![npm version](https://img.shields.io/npm/v/use-agents.svg)](https://www.npmjs.com/package/use-agents)

## Features

- **Standardize**: Use a single `AGENTS.md` file for all your AI coding agents.
- **Configure**: Automatically update configuration files for agents that need extra setup.
- **Support**:
  - **Gemini CLI**: Updates `settings.json` (Global/Local).
  - **Aider**: Updates `.aider.conf.yml` (Global/Local).
  - **Claude Code**: Setup workaround via symlinking.

## Quick Start

You can run `use-agents` directly using `npx`:

### 1. Initialize `AGENTS.md`

Creates a default `AGENTS.md` file in your project root.

```bash
npx use-agents init
```

### 2. Configure your favorite agent

#### Gemini CLI

```bash
# Configure local .gemini/settings.json
npx use-agents gemini

# Configure local .gemini/settings.json with lower priority for AGENTS.md
npx use-agents gemini --no-prefer-agents

# Configure global ~/.gemini/settings.json
npx use-agents gemini -g

# Configure global ~/.gemini/settings.json with lower priority for AGENTS.md
npx use-agents gemini -g --no-prefer-agents
```

#### Aider

```bash
# Configure local .aider.conf.yml
npx use-agents aider

# Configure global ~/.aider.conf.yml
npx use-agents aider -g
```

#### Claude Code

Claude Code does not yet support `AGENTS.md` natively. This command creates a symlink from `AGENTS.md` to `CLAUDE.md`.

```bash
npx use-agents claude
```

[EXPERIMENTAL] You can also use `npx use-agents claude -g` to install a hook that will load `AGENTS.md` automatically.

```bash
# EXPERIMENTAL: USE WITH CAUTION AND BACK UP YOUR SETTINGS FIRST
cp ~/.claude/settings.json ~/.claude/settings.json.bak
npx use-agents claude -g
```

## Supported Platforms

For a detailed list of supported platforms and how they integrate with `AGENTS.md`, see [docs/PLATFORMS.md](./docs/PLATFORMS.md).

## Development

This project uses `just` for task management.

- **Build**: `just build`
- **Lint**: `just lint`
- **Format**: `just format`
- **Test**: `just test`

## License

MIT
