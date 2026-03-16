#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extra_typings_1 = require("@commander-js/extra-typings");
const init_1 = require("./commands/init");
const gemini_1 = require("./commands/gemini");
const aider_1 = require("./commands/aider");
const claude_1 = require("./commands/claude");
const list_1 = require("./commands/list");
const program = new extra_typings_1.Command();
const consoleWriter = (action) => (options) => action(Object.assign(Object.assign({}, options), { writer: console.log }));
program
    .name('use-agents')
    .description('Manage context files for agentic coding assistants')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize AGENTS.md in the current directory')
    .action(consoleWriter(init_1.initAction));
program
    .command('gemini')
    .description('Configure Gemini CLI to use AGENTS.md')
    .option('-g, --global', 'Configure global settings (~/.gemini/settings.json)')
    .option('-l, --local', 'Configure local settings (default)', true)
    .option('--prefer-agents', 'Put AGENTS.md at higher priority (default)', true)
    .option('--no-prefer-agents', 'Put AGENTS.md at lower priority')
    .action(consoleWriter(gemini_1.geminiAction));
program
    .command('aider')
    .description('Configure Aider to use AGENTS.md')
    .option('-g, --global', 'Configure global settings (~/.aider.conf.yml)')
    .option('-l, --local', 'Configure local settings (default)', true)
    .option('--prefer-agents', 'Put AGENTS.md at higher priority (default)', true)
    .option('--no-prefer-agents', 'Put AGENTS.md at lower priority')
    .action(consoleWriter(aider_1.aiderAction));
program
    .command('claude')
    .description('Setup workaround for Claude Code (symlink CLAUDE.md to AGENTS.md)')
    .option('-g, --global', 'Configure global hook (experimental)')
    .action(consoleWriter(claude_1.claudeAction));
program
    .command('list')
    .description('List supported platforms and their configuration methods')
    .action(consoleWriter(list_1.listAction));
program.parse();
