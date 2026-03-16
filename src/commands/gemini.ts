import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';
import { WithWriter } from '../index';
import { OutputWriter } from '../types';

export const getGeminiSettingsPath = (isGlobal: boolean): string => {
  if (isGlobal) {
    return path.join(os.homedir(), '.gemini', 'settings.json');
  } else {
    return path.join(process.cwd(), '.gemini', 'settings.json');
  }
};

interface GeminiSettings {
  context: Partial<{
    fileName: string[];
  }>;
}

export const updateGeminiSettings = (
  filePath: string,
  preferAgents: boolean,
  writer: OutputWriter,
) => {
  let settings: Partial<GeminiSettings> = {};
  if (fs.existsSync(filePath)) {
    try {
      settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      writer(chalk.yellow(`Warning: Could not parse ${filePath}. Starting fresh.`));
    }
  } else {
    writer(chalk.yellow(`Creating ${filePath}...`));
  }

  const { context: { fileName = ['GEMINI.md'] } = { filename: ['GEMINI.md'] } } =
    settings as GeminiSettings;

  if (fileName.includes('AGENTS.md')) {
    writer(chalk.yellow(`AGENTS.md already in context file order: [ ${fileName.join(', ')} ]`));
    writer(chalk.yellow('Skipping update.'));
    return;
  } else if (preferAgents) {
    writer(
      chalk.green(
        `Adding AGENTS.md to context file order in first priority: [ {HERE}, ${fileName.join(', ')} ]`,
      ),
    );
    fileName.unshift('AGENTS.md');
  } else {
    writer(
      chalk.green(
        `Adding AGENTS.md to context file order in last priority: [ ${fileName.join(', ')}, {HERE} ]`,
      ),
    );
    fileName.push('AGENTS.md');
  }

  if (settings.context) {
    settings.context.fileName = fileName;
  } else {
    settings.context = { fileName };
  }

  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
  writer(chalk.green(`Updated Gemini settings at ${filePath}`));
  writer(chalk.green(`New context file order: [ ${fileName.join(', ')} ]`));
};

type GeminiActionOptions = WithWriter<{
  global?: boolean;
  preferAgents?: boolean;
}>;

export const geminiAction = ({
  global = false,
  preferAgents = true,
  writer,
}: GeminiActionOptions) => {
  const filePath = getGeminiSettingsPath(!!global);
  updateGeminiSettings(filePath, !!preferAgents, writer);
};
