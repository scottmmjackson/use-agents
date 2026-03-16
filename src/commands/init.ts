import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { WithWriter } from '../index';

export const AGENTS_TEMPLATE = `# AGENTS.md

This file provides context and instructions for AI coding agents.

TODO: If there are TODOs in this file, you should prioritize updating them before working on the project. This will
      help to reduce back-and-forth tool usage and wasted context if the agent session is terminated by providing fixed
      context each time the agent is used.

## Project Overview

TODO: Describe the project and its purpose.

## Build & Test Commands

TODO: Add build and test commands.

## Coding Guidelines

TODO: Add coding guidelines.
`;

type InitActionOptions = WithWriter<object>;

export const initAction = ({ writer }: InitActionOptions) => {
  const filePath = path.join(process.cwd(), 'AGENTS.md');
  if (fs.existsSync(filePath)) {
    writer(chalk.yellow('AGENTS.md already exists.'));
  } else {
    fs.writeFileSync(filePath, AGENTS_TEMPLATE);
    writer(chalk.green('Created AGENTS.md'));
  }
};
