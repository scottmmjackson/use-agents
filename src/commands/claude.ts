import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { WithWriter } from '../index';
import { OutputWriter } from '../types';

class AgentsNotFound extends Error {
  message: string = "AGENTS.md not found. Run 'use-agents init' first.";
}

type ClaudeActionOptions = WithWriter<{ global?: boolean }>;

export const claudeAction = ({ writer, global }: ClaudeActionOptions) => {
  if (global) {
    return configureClaudeGlobalHook(writer);
  }
  const source = 'AGENTS.md';
  const target = 'CLAUDE.md';
  const sourcePath = path.join(process.cwd(), source);
  const targetPath = path.join(process.cwd(), target);

  if (!fs.existsSync(sourcePath)) {
    writer(chalk.red('AGENTS.md not found. Run "use-agents init" first.'));
    throw new AgentsNotFound();
  }

  if (fs.existsSync(targetPath)) {
    const stats = fs.lstatSync(targetPath);
    if (stats.isSymbolicLink()) {
      writer(chalk.yellow('CLAUDE.md is already a symlink.'));
    } else {
      writer(chalk.yellow('CLAUDE.md already exists and is not a symlink.'));
    }
  } else {
    try {
      fs.symlinkSync(sourcePath, targetPath);
      writer(chalk.green(`Symlinked ${source} to ${target}`));
    } catch (e: unknown) {
      if (e instanceof Error) {
        writer(chalk.red(`Error creating symlink: ${e.message}`));
      } else {
        throw new TypeError(`Unknown error ${e}`);
      }
    }
  }
};

export type HookCommand =
  | {
      /**
       * Hook type
       */
      type: 'command';
      /**
       * Shell command to execute
       */
      command: string;
      /**
       * Optional timeout in seconds
       */
      timeout?: number;
      /**
       * Run this hook asynchronously without blocking Claude Code
       */
      async?: boolean;
      /**
       * Custom spinner message displayed while the hook runs
       */
      statusMessage?: string;
    }
  | {
      /**
       * Hook type
       */
      type: 'prompt';
      /**
       * Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON.
       */
      prompt: string;
      /**
       * Model to use for evaluation. Defaults to a fast model
       */
      model?: string;
      /**
       * Optional timeout in seconds (default: 30)
       */
      timeout?: number;
      /**
       * Custom spinner message displayed while the hook runs
       */
      statusMessage?: string;
    }
  | {
      /**
       * Hook type
       */
      type: 'agent';
      /**
       * Prompt describing what to verify. Use $ARGUMENTS placeholder for hook input JSON.
       */
      prompt: string;
      /**
       * Model to use for evaluation. Defaults to a fast model
       */
      model?: string;
      /**
       * Optional timeout in seconds (default: 60)
       */
      timeout?: number;
      /**
       * Custom spinner message displayed while the hook runs
       */
      statusMessage?: string;
    }
  | {
      /**
       * Hook type
       */
      type: 'http';
      /**
       * URL to POST hook input JSON to. Endpoint must accept POST requests and return JSON.
       */
      url: string;
      /**
       * Custom HTTP headers (e.g., Authorization: Bearer token). Values support $VAR_NAME or ${VAR_NAME} interpolation.
       */
      headers?: {
        [k: string]: string;
      };
      /**
       * List of environment variable names permitted for interpolation in headers. If not set, no env var interpolation is allowed.
       */
      allowedEnvVars?: string[];
      /**
       * Optional timeout in seconds (default: 30)
       */
      timeout?: number;
      /**
       * Custom spinner message displayed while the hook runs
       */
      statusMessage?: string;
    };

/**
 * Hook matcher configuration with multiple hooks
 */
export interface HookMatcher {
  /**
   * Optional pattern to match event contexts, case-sensitive. Behavior depends on event type. See https://code.claude.com/docs/en/hooks#matcher-patterns for event-specific details and examples
   */
  matcher?: string;
  /**
   * Array of hooks to execute
   */
  hooks: HookCommand[];
}

interface ClaudeCodeSettings {
  hooks?: {
    SessionStart?: HookMatcher[];
  };
}

const loadAgentsMdScript = `#!/usr/bin/env bash
set -euo pipefail
AGENTS_FILE="\${CLAUDE_PROJECT_DIR}/AGENTS.md"
CLAUDE_FILE="\${CLAUDE_PROJECT_DIR}/CLAUDE.md"
[ -f "$AGENTS_FILE" ] || exit 0
if [ -f "$CLAUDE_FILE" ] && grep -q "@AGENTS.md" "$CLAUDE_FILE"; then exit 0; fi
echo "=== Project AGENTS.md ==="
cat "$AGENTS_FILE"`;

const configureClaudeGlobalHook = (writer: OutputWriter) => {
  const settingsPath = path.join(process.env.HOME || '', '.claude', 'settings.json');
  const settings: ClaudeCodeSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  const loadAgentsCommmand: HookCommand = {
    type: 'command',
    command: 'bash ~/.claude/hooks/load-agents-md.sh',
  };

  writer(chalk.green(`Adding agent helper to SessionStart hook in ${settingsPath}`));
  if (!settings.hooks) {
    settings.hooks = {
      SessionStart: [{ matcher: '*', hooks: [loadAgentsCommmand] }],
    };
  } else if (!settings.hooks.SessionStart) {
    settings.hooks.SessionStart = [{ matcher: '*', hooks: [loadAgentsCommmand] }];
  } else if (settings.hooks.SessionStart.find((hook) => hook.matcher === '*') !== undefined) {
    settings.hooks.SessionStart.find((hook) => hook.matcher === '*')?.hooks.push(
      loadAgentsCommmand,
    );
  } else {
    settings.hooks.SessionStart.push({ matcher: '*', hooks: [loadAgentsCommmand] });
  }
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  writer(chalk.green(`Updated ${settingsPath}`));

  writer(chalk.green(`Creating agent helper in ~/.claude/hooks/load-agents-md.sh`));
  const hookPath = path.join(process.env.HOME || '', '.claude', 'hooks', 'load-agents-md.sh');
  fs.writeFileSync(hookPath, loadAgentsMdScript);
  const { mode } = fs.statSync(hookPath);
  fs.chmodSync(hookPath, mode | 0o111);
  writer(chalk.green(`Updated ${hookPath}`));

  writer(chalk.green(`Claude Code settings updated. Restart Claude Code to apply changes.`));
};
