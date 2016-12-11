/* global describe, it, beforeEach */

const SuperCLI = require('../lib/super-cli')
let cli

describe('# cli.run', () => {
  beforeEach(() => {
    cli = new SuperCLI({
      autoRun: false
    })
  })

  it('Should trigger a command', done => {
    cli.on('command', done)
    cli.run('command')
  })

  it('Should catch all commands if there isn\'t found a registered command', done => {
    cli.on('*', () => done())
    cli.run('other-command')
  })
})
