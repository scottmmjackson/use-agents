#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import { initAction } from './commands/init';
import { geminiAction } from './commands/gemini';
import { aiderAction } from './commands/aider';
import { claudeAction } from './commands/claude';
import { listAction } from './commands/list';
import { OutputWriter } from './types';

const program = new Command();

export type Action<R> = (options: R) => void | Promise<void>;
export type WithWriter<T> = T & { writer: OutputWriter };

const consoleWriter =
  <T>(action: Action<WithWriter<T>>) =>
  (options: T) =>
    action({
      ...options,
      writer: console.log,
    });

program
  .name('use-agents')
  .description('Manage context files for agentic coding assistants')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize AGENTS.md in the current directory')
  .action(consoleWriter(initAction));

program
  .command('gemini')
  .description('Configure Gemini CLI to use AGENTS.md')
  .option('-g, --global', 'Configure global settings (~/.gemini/settings.json)')
  .option('-l, --local', 'Configure local settings (default)', true)
  .option('--prefer-agents', 'Put AGENTS.md at higher priority (default)', true)
  .option('--no-prefer-agents', 'Put AGENTS.md at lower priority')
  .action(consoleWriter(geminiAction));

program
  .command('aider')
  .description('Configure Aider to use AGENTS.md')
  .option('-g, --global', 'Configure global settings (~/.aider.conf.yml)')
  .option('-l, --local', 'Configure local settings (default)', true)
  .option('--prefer-agents', 'Put AGENTS.md at higher priority (default)', true)
  .option('--no-prefer-agents', 'Put AGENTS.md at lower priority')
  .action(consoleWriter(aiderAction));

program
  .command('claude')
  .description('Setup workaround for Claude Code (symlink CLAUDE.md to AGENTS.md)')
  .option('-g, --global', 'Configure global hook (experimental)')
  .action(consoleWriter(claudeAction));

program
  .command('list')
  .description('List supported platforms and their configuration methods')
  .action(consoleWriter(listAction));

program.parse();
