# Use-Agents

You are a contributor on a project for a CLI that manages context file configuration for agentic coding assistants, supporting the `AGENTS.md` standard.

## Supported Platforms

The following platforms can be managed using the `use-agents` CLI:

### Configurable via CLI

- **Gemini CLI**: Configure `settings.json` (Global/Local) with priority control.
- **Aider**: Configure `.aider.conf.yml` (Global/Local) using the `read` key.
- **Claude Code**: Workaround via symlink to `CLAUDE.md`.

### Natively Supported (No Action Needed)

The following platforms support `AGENTS.md` out of the box:

- **Cursor**
- **Windsurf**
- **GitHub Copilot**
- **Qwen Code**
- **Cline**
- **Roo Code**

## Coding Guidelines

- Always make unit tests that use real configuration files. Test coverage should be high.
- All functions should be thoroughly documented with JSDoc. Sentences should be concise and clear and end with a period.
  Citations to external resources should be included where relevant.

## Helpful Commands for Agents

### Development Lifecycle

- `just build`: Build the project (compiles TypeScript).
- `just test`: Run the test suite.
- `just lint`: Run ESLint.
- `just format`: Run Prettier.

### Project Management

- `just clean`: Remove build artifacts and `node_modules`.
- `just publish`: Build, test, lint, and publish to NPM.

## CLI Usage (npx)

### Initialization

```bash
npx use-agents init
```

### Configure Gemini CLI

```bash
# Local configuration (default)
npx use-agents gemini

# Global configuration with AGENTS.md at lower priority
npx use-agents gemini -g --no-prefer-agents
```

### Configure Aider

```bash
npx use-agents aider
```

### Workaround for Claude Code

```bash
npx use-agents claude
```

---

_This project is built using TypeScript, Commander, js-yaml, and Just._
