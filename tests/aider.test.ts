import fs from 'fs'
import path from 'path'
import os from 'os'
import yaml from 'js-yaml'
import { aiderAction } from '../src/commands/aider'

jest.mock('fs')
jest.mock('path')
jest.mock('os')
jest.mock('chalk', () => ({
  yellow: (msg: string) => msg,
  green: (msg: string) => msg,
  blue: (msg: string) => msg,
}))

jest.mock('js-yaml', () => ({
  load: jest.fn(),
  dump: jest.fn(),
}))

describe('aiderAction', () => {
  const mockCwd = '/test-project'
  let mockGlobalPath: string
  let mockLocalPath: string
  const writer = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(process.cwd as jest.Mock) = jest.fn().mockReturnValue(mockCwd)
    ;(path.join as jest.Mock).mockImplementation((...args) => args.join('/'))
    ;(path.dirname as jest.Mock).mockImplementation((p) => p.split('/').slice(0, -1).join('/'))
    ;(os.homedir as jest.Mock).mockReturnValue('/home/user')
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)
    mockGlobalPath = path.join(os.homedir(), '.aider.conf.yml')
    mockLocalPath = path.join(mockCwd, '.aider.conf.yml')
  })

  it('should update local settings with preferAgents by default', () => {
    // Arrange
    const options = {
      writer,
    }

    // Act
    aiderAction(options)

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockLocalPath)
    expect(fs.readFileSync).not.toHaveBeenCalled()
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockLocalPath,
      yaml.dump({ read: ['AGENTS.md', 'GEMINI.md'] }),
    )
  })

  it('should update global settings when --global is used', () => {
    // Arrange
    const options = { isGlobal: true, writer }

    // Act
    aiderAction(options)

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockGlobalPath)
    expect(fs.readFileSync).not.toHaveBeenCalled()
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockGlobalPath,
      yaml.dump({ read: ['AGENTS.md', 'GEMINI.md'] }),
    )
  })

  it('should update settings with --no-prefer-agents', () => {
    // Arrange
    const options = { preferAgents: false, writer }

    // Act
    aiderAction(options)

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockLocalPath)
    expect(fs.readFileSync).not.toHaveBeenCalled()
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockLocalPath,
      yaml.dump({ read: ['GEMINI.md', 'AGENTS.md'] }),
    )
  })

  it('should preserve existing settings in settings.json', () => {
    // Arrange
    const existingSettings = { otherKey: 'otherValue' }
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    ;(fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingSettings))

    // Act
    aiderAction({ writer })

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(mockLocalPath)
    expect(fs.readFileSync).toHaveBeenCalledWith(mockLocalPath, 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockLocalPath,
      yaml.dump({ otherKey: 'otherValue', read: ['AGENTS.md', 'GEMINI.md'] }),
    )
  })
})
