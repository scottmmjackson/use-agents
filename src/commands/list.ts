import chalk from 'chalk';
import { WithWriter } from '../index';

type ListActionOptions = WithWriter<object>;

export const listAction = ({ writer }: ListActionOptions) => {
  writer('Supported platforms:');
  writer(`- ${chalk.blue('gemini')}: Update settings.json (Global or Local)`);
  writer(`- ${chalk.blue('aider')}: Update .aider.conf.yml (Global or Local)`);
  writer(`- ${chalk.blue('claude')}: Create symlink to CLAUDE.md (Local)`);
  writer(
    `- ${chalk.blue('Natively Supported (no action needed)')}: Cursor, Windsurf, Copilot, Qwen, Cline, Roo Code`,
  );
};
