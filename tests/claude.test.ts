import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { claudeAction } from '../src/commands/claude'

jest.mock('fs')
jest.mock('path')
jest.mock('os')
jest.mock('chalk', () => ({
  red: (msg: string) => msg,
  yellow: (msg: string) => msg,
  green: (msg: string) => msg,
  blue: (msg: string) => msg,
}))

describe('claudeAction', () => {
  const mockCwd = '/test-project'
  const mockSourcePath = '/test-project/AGENTS.md'
  const mockTargetPath = '/test-project/CLAUDE.md'
  const writer = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(process.cwd as jest.Mock) = jest.fn().mockReturnValue(mockCwd)
    ;(path.join as jest.Mock).mockImplementation((...args) => args.join('/'))
    ;(path.dirname as jest.Mock).mockImplementation((p) => p.split('/').slice(0, -1).join('/'))
    ;(os.homedir as jest.Mock).mockReturnValue('/home/user')
  })

  it('should create a symlink from AGENTS.md to CLAUDE.md when AGENTS.md exists and CLAUDE.md does not exist', () => {
    // Arrange
    ;(fs.existsSync as jest.Mock).mockImplementation(
      (filePath: string) => filePath === mockSourcePath,
    )
    ;(fs.lstatSync as jest.Mock).mockReturnValue({ isSymbolicLink: () => false })

    // Act
    claudeAction({ writer })

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockSourcePath)
    expect(fs.lstatSync).not.toHaveBeenCalled()
    expect(fs.symlinkSync).toHaveBeenCalledWith(mockSourcePath, mockTargetPath)
  })

  it('should not create a symlink if AGENTS.md does not exist', () => {
    // Arrange
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)

    // Act
    expect(() => claudeAction({ writer })).toThrow(
      "AGENTS.md not found. Run 'use-agents init' first.",
    )

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockSourcePath)
    expect(fs.lstatSync).not.toHaveBeenCalled()
    expect(fs.symlinkSync).not.toHaveBeenCalled()
  })

  it('should not create a symlink if CLAUDE.md already exists and is not a symlink', () => {
    // Arrange
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    ;(fs.lstatSync as jest.Mock).mockReturnValue({ isSymbolicLink: () => false })

    // Act
    claudeAction({ writer })

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockSourcePath)
    expect(fs.lstatSync).toHaveBeenCalledWith(mockTargetPath)
    expect(fs.symlinkSync).not.toHaveBeenCalled()
  })

  it('should not create a symlink if CLAUDE.md already exists and is a symlink', () => {
    // Arrange
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    ;(fs.lstatSync as jest.Mock).mockReturnValue({ isSymbolicLink: () => true })

    // Act
    claudeAction({ writer })

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockSourcePath)
    expect(fs.lstatSync).toHaveBeenCalledWith(mockTargetPath)
    expect(fs.symlinkSync).not.toHaveBeenCalled()
  })
})
