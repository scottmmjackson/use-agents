import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { geminiAction } from '../src/commands/gemini'

jest.mock('fs')
jest.mock('path')
jest.mock('os')
jest.mock('chalk', () => ({
  yellow: (msg: string) => msg,
  green: (msg: string) => msg,
  blue: (msg: string) => msg,
}))

describe('geminiAction', () => {
  const mockHomedir = '/home/user'
  const mockCwd = '/test-project'
  const mockGlobalPath = '/home/user/.gemini/settings.json'
  const mockLocalPath = '/test-project/.gemini/settings.json'
    const writer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks()
    ;(os.homedir as jest.Mock).mockReturnValue(mockHomedir)
    ;(process.cwd as jest.Mock) = jest.fn().mockReturnValue(mockCwd)
    ;(path.join as jest.Mock).mockImplementation((...args) => args.join('/'))
    ;(path.dirname as jest.Mock).mockImplementation((p) => p.split('/').slice(0, -1).join('/'))
  })

  it('should update local settings with preferAgents by default', () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)
    const writeFileSyncSpy = (fs.writeFileSync as jest.Mock)

    geminiAction({ writer }) // local=true, preferAgents=true by default in options or handled in the action

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      mockLocalPath,
      JSON.stringify({ context: { fileName: ['AGENTS.md', 'GEMINI.md'] } }, null, 2)
    )
  })

  it('should update global settings when --global is used', () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)
    const writeFileSyncSpy = (fs.writeFileSync as jest.Mock)

    geminiAction({ global: true, writer })

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      mockGlobalPath,
      JSON.stringify({ context: { fileName: ['AGENTS.md', 'GEMINI.md'] } }, null, 2)
    )
  })

  it('should update settings with --no-prefer-agents', () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)
    const writeFileSyncSpy = (fs.writeFileSync as jest.Mock)

    geminiAction({ preferAgents: false, writer })

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      mockLocalPath,
      JSON.stringify({ context: { fileName: ['GEMINI.md', 'AGENTS.md'] } }, null, 2)
    )
  })

  it('should preserve existing settings in settings.json', () => {
    const existingSettings = { otherKey: 'otherValue' }
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    ;(fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingSettings))
    const writeFileSyncSpy = (fs.writeFileSync as jest.Mock)

    geminiAction({ writer })

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      mockLocalPath,
      JSON.stringify({ otherKey: 'otherValue', context: { fileName: ['AGENTS.md', 'GEMINI.md'] } }, null, 2)
    )
  })
})
