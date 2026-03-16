# Supported Platforms and AGENTS.md Integration

This document describes how different AI coding agents integrate with the `AGENTS.md` standard, including citations to
official documentation.

## 1. Gemini CLI

**Integration Method:** Configuration via `settings.json`.

Gemini CLI allows you to specify a custom context file (or multiple files) in its settings.

- **Global Configuration:** `~/.gemini/settings.json`
- **Local Configuration:** `.gemini/settings.json`
- **Citation:** 
  [Gemini CLI - Customize the context file name](https://geminicli.com/docs/cli/gemini-md/#customize-the-context-file-name)

### Example Configuration:

```json
{
  "context": {
    "fileName": [
      "AGENTS.md",
      "GEMINI.md"
    ]
  }
}
```

## 2. Aider

Aider allows you to specify a custom context file (or multiple files) in its settings.

- **Global Configuration:** `~/.aider.conf.yml`
- **Local Configuration:** `.aider.conf.yml`
- **Citation:** [Specifying coding conventions | aider](https://aider.chat/docs/usage/conventions.html),
  [aider-ai/aider#4363](https://github.com/aider-ai/aider/issues/4363)

## 3. Claude Code

Claude Code currently does not support AGENTS.md out of the box. There are a couple of options to work around this:

- Symbolic linking `AGENTS.md` to `CLAUDE.md`
- [Installing a global hook the load per-project AGENTS.md files](https://github.com/anthropics/claude-code/issues/6235#issuecomment-4019819505)

- **Citation:** [anthropics/claude-code#6235](https://github.com/anthropics/claude-code/issues/6235)

## Agents with out-of-the-box support for AGENTS.md

- [Cursor](https://cursor.com/docs/rules)
- [Windsurf](https://docs.windsurf.com/windsurf/cascade/agents-md)
- [Github Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions#creating-custom-instructions)
- [Qwen Code](https://github.com/QwenLM/qwen-code/pull/2018)
- [Cline](https://docs.cline.bot/customization/cline-rules#supported-rule-types)
- [Roo Code](https://docs.roocode.com/features/custom-instructions#agentsmd-support)
