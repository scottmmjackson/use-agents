"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claudeAction = claudeAction;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
class AgentsNotFound extends Error {
    constructor() {
        super(...arguments);
        this.message = "AGENTS.md not found. Run 'use-agents init' first.";
    }
}
function claudeAction({ writer, global }) {
    if (global) {
        return configureClaudeGlobalHook(writer);
    }
    const source = 'AGENTS.md';
    const target = 'CLAUDE.md';
    const sourcePath = path.join(process.cwd(), source);
    const targetPath = path.join(process.cwd(), target);
    if (!fs.existsSync(sourcePath)) {
        writer(chalk_1.default.red('AGENTS.md not found. Run "use-agents init" first.'));
        throw new AgentsNotFound();
    }
    if (fs.existsSync(targetPath)) {
        const stats = fs.lstatSync(targetPath);
        if (stats.isSymbolicLink()) {
            writer(chalk_1.default.yellow('CLAUDE.md is already a symlink.'));
        }
        else {
            writer(chalk_1.default.yellow('CLAUDE.md already exists and is not a symlink.'));
        }
    }
    else {
        try {
            fs.symlinkSync(sourcePath, targetPath);
            writer(chalk_1.default.green(`Symlinked ${source} to ${target}`));
        }
        catch (e) {
            if (e instanceof Error) {
                writer(chalk_1.default.red(`Error creating symlink: ${e.message}`));
            }
            else {
                throw new TypeError(`Unknown error ${e}`);
            }
        }
    }
}
const loadAgentsMdScript = `#!/usr/bin/env bash
set -euo pipefail
AGENTS_FILE="\${CLAUDE_PROJECT_DIR}/AGENTS.md"
CLAUDE_FILE="\${CLAUDE_PROJECT_DIR}/CLAUDE.md"
[ -f "$AGENTS_FILE" ] || exit 0
if [ -f "$CLAUDE_FILE" ] && grep -q "@AGENTS.md" "$CLAUDE_FILE"; then exit 0; fi
echo "=== Project AGENTS.md ==="
cat "$AGENTS_FILE"`;
function configureClaudeGlobalHook(writer) {
    var _a;
    const settingsPath = path.join(process.env.HOME || '', '.claude', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const loadAgentsCommmand = { "type": "command", "command": "bash ~/.claude/hooks/load-agents-md.sh" };
    writer(chalk_1.default.green(`Adding agent helper to SessionStart hook in ${settingsPath}`));
    if (!settings.hooks) {
        settings.hooks = {
            SessionStart: [{ matcher: "*", hooks: [loadAgentsCommmand] }]
        };
    }
    else if (!settings.hooks.SessionStart) {
        settings.hooks.SessionStart = [{ matcher: "*", hooks: [loadAgentsCommmand] }];
    }
    else if (settings.hooks.SessionStart.find(hook => hook.matcher === "*") !== undefined) {
        (_a = settings.hooks.SessionStart.find(hook => hook.matcher === "*")) === null || _a === void 0 ? void 0 : _a.hooks.push(loadAgentsCommmand);
    }
    else {
        settings.hooks.SessionStart.push({ matcher: "*", hooks: [loadAgentsCommmand] });
    }
    writer(chalk_1.default.green(`Creating agent helper in ~/.claude/hooks/load-agents-md.sh`));
    const hookPath = path.join(process.env.HOME || '', '.claude', 'hooks', 'load-agents-md.sh');
    fs.statSync;
}
