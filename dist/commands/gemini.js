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
exports.geminiAction = exports.updateGeminiSettings = exports.getGeminiSettingsPath = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const chalk_1 = __importDefault(require("chalk"));
const getGeminiSettingsPath = (isGlobal) => {
    if (isGlobal) {
        return path.join(os.homedir(), '.gemini', 'settings.json');
    }
    else {
        return path.join(process.cwd(), '.gemini', 'settings.json');
    }
};
exports.getGeminiSettingsPath = getGeminiSettingsPath;
const updateGeminiSettings = (filePath, preferAgents, writer) => {
    let settings = {};
    if (fs.existsSync(filePath)) {
        try {
            settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        catch (_a) {
            writer(chalk_1.default.yellow(`Warning: Could not parse ${filePath}. Starting fresh.`));
        }
    }
    else {
        writer(chalk_1.default.yellow(`Creating ${filePath}...`));
    }
    const { context: { fileName = ['GEMINI.md'] } = { filename: ['GEMINI.md'] } } = settings;
    if (fileName.includes('AGENTS.md')) {
        writer(chalk_1.default.yellow(`AGENTS.md already in context file order: [ ${fileName.join(', ')} ]`));
        writer(chalk_1.default.yellow('Skipping update.'));
        return;
    }
    else if (preferAgents) {
        writer(chalk_1.default.green(`Adding AGENTS.md to context file order in first priority: [ {HERE}, ${fileName.join(', ')} ]`));
        fileName.unshift('AGENTS.md');
    }
    else {
        writer(chalk_1.default.green(`Adding AGENTS.md to context file order in last priority: [ ${fileName.join(', ')}, {HERE} ]`));
        fileName.push('AGENTS.md');
    }
    if (settings.context) {
        settings.context.fileName = fileName;
    }
    else {
        settings.context = { fileName };
    }
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
    writer(chalk_1.default.green(`Updated Gemini settings at ${filePath}`));
    writer(chalk_1.default.green(`New context file order: [ ${fileName.join(', ')} ]`));
};
exports.updateGeminiSettings = updateGeminiSettings;
const geminiAction = ({ global = false, preferAgents = true, writer, }) => {
    const filePath = (0, exports.getGeminiSettingsPath)(!!global);
    (0, exports.updateGeminiSettings)(filePath, !!preferAgents, writer);
};
exports.geminiAction = geminiAction;
