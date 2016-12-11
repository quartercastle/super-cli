/* global describe, it, beforeEach */

const assert = require('assert')
const SuperCLI = require('../lib/super-cli')
let cli

describe('# cli.on', () => {
  beforeEach(() => {
    cli = new SuperCLI({
      autoRun: false
    })
  })

  it('Should register a command', () => {
    cli.on('command', () => {})
    assert.equal(true, cli._events['command'] !== undefined)
  })

  it('Should throw an error if the callback is not a function', () => {
    assert.throws(() => cli.on('command', 'should fail'), Error)
  })
})
