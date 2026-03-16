import * as fs from 'fs'
import * as path from 'path'
import { initAction, AGENTS_TEMPLATE } from '../src/commands/init'

jest.mock('fs')
jest.mock('path')
jest.mock('chalk', () => ({
  yellow: (msg: string) => msg,
  green: (msg: string) => msg,
}))

describe('initAction', () => {
  const mockCwd = '/test-project'
  const mockPath = '/test-project/AGENTS.md'
    const writer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks()
    ;(path.join as jest.Mock).mockReturnValue(mockPath)
    ;(process.cwd as jest.Mock) = jest.fn().mockReturnValue(mockCwd)
  })

  it('should create AGENTS.md if it does not exist', () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)
    const writeFileSyncSpy = (fs.writeFileSync as jest.Mock)

    initAction({ writer })

    expect(writeFileSyncSpy).toHaveBeenCalledWith(mockPath, AGENTS_TEMPLATE)
  })

  it('should not create AGENTS.md if it already exists', () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    const writeFileSyncSpy = (fs.writeFileSync as jest.Mock)

      initAction({ writer })

    expect(writeFileSyncSpy).not.toHaveBeenCalled()
  })
})
