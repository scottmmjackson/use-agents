import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';
import * as yaml from 'js-yaml';
import { OutputWriter } from '../types';
import { WithWriter } from '../index';

export const getAiderConfigPath = (isGlobal: boolean): string => {
  if (isGlobal) {
    return path.join(os.homedir(), '.aider.conf.yml');
  } else {
    return path.join(process.cwd(), '.aider.conf.yml');
  }
};

interface AiderConfig {
  read: string[] | string;
}

export const updateAiderConfig = (filePath: string, preferAgents: boolean, write: OutputWriter) => {
  let config: Partial<AiderConfig> = {};
  if (fs.existsSync(filePath)) {
    try {
      config = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
    } catch {
      write(chalk.yellow(`Warning: Could not parse ${filePath}. Starting fresh.`));
    }
  }

  const conventions = 'AGENTS.md';
  let read = config.read || [];
  if (typeof read === 'string') {
    read = [read];
  }

  if (!read.includes(conventions)) {
    if (preferAgents) {
      read = [conventions, ...read];
    } else {
      read = [...read, conventions];
    }
  }

  config.read = read;

  fs.writeFileSync(filePath, yaml.dump(config));
  write(chalk.green(`Updated Aider config at ${filePath}`));
  write(chalk.blue(`Read files: ${Array.isArray(read) ? read.join(', ') : read}`));
};

type AiderActionOptions = WithWriter<{
  isGlobal?: boolean;
  preferAgents?: boolean;
}>;

export const aiderAction = (options: AiderActionOptions) => {
  const { isGlobal, preferAgents, writer } = options;
  const filePath = getAiderConfigPath(!!isGlobal);
  updateAiderConfig(filePath, !!preferAgents, writer);
};
