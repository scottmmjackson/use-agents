"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAction = void 0;
const chalk_1 = __importDefault(require("chalk"));
const listAction = ({ writer }) => {
    writer('Supported platforms:');
    writer(`- ${chalk_1.default.blue('gemini')}: Update settings.json (Global or Local)`);
    writer(`- ${chalk_1.default.blue('aider')}: Update .aider.conf.yml (Global or Local)`);
    writer(`- ${chalk_1.default.blue('claude')}: Create symlink to CLAUDE.md (Local)`);
    writer(`- ${chalk_1.default.blue('Natively Supported (no action needed)')}: Cursor, Windsurf, Copilot, Qwen, Cline, Roo Code`);
};
exports.listAction = listAction;
