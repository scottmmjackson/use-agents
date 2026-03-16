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
exports.getAiderConfigPath = getAiderConfigPath;
exports.updateAiderConfig = updateAiderConfig;
exports.aiderAction = aiderAction;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const chalk_1 = __importDefault(require("chalk"));
const yaml = __importStar(require("js-yaml"));
function getAiderConfigPath(isGlobal) {
    if (isGlobal) {
        return path.join(os.homedir(), '.aider.conf.yml');
    }
    else {
        return path.join(process.cwd(), '.aider.conf.yml');
    }
}
function updateAiderConfig(filePath, preferAgents, write) {
    let config = {};
    if (fs.existsSync(filePath)) {
        try {
            config = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
        }
        catch (_a) {
            write(chalk_1.default.yellow(`Warning: Could not parse ${filePath}. Starting fresh.`));
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
        }
        else {
            read = [...read, conventions];
        }
    }
    config.read = read;
    fs.writeFileSync(filePath, yaml.dump(config));
    write(chalk_1.default.green(`Updated Aider config at ${filePath}`));
    write(chalk_1.default.blue(`Read files: ${Array.isArray(read) ? read.join(', ') : read}`));
}
function aiderAction(options) {
    const { isGlobal, preferAgents, writer } = options;
    const filePath = getAiderConfigPath(!!isGlobal);
    updateAiderConfig(filePath, !!preferAgents, writer);
}
