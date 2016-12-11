/* global describe, it, beforeEach */

const assert = require('assert')
const SuperCLI = require('../lib/super-cli')
let cli

process.argv = ['node', 'script', '-h', '--help', '-k=value', '--key=value']

describe('# cli.has / cli.option', () => {
  beforeEach(() => {
    cli = new SuperCLI({
      autoRun: false
    })
  })

  it('Should check if option flag isset', () => {
    assert.equal(true, cli.has('-h'))
    assert.equal(true, cli.option('--help'))
    assert.equal(true, cli.has('-h', '--help'))
    assert.equal(false, cli.has('--not-set'))
    assert.equal(false, cli.option('-n'))
  })

  it('Should get option with value ', () => {
    assert.equal('value', cli.has('-k='))
    assert.equal('value', cli.option('--key='))
    assert.equal('value', cli.option('-k=', '--key='))
    assert.equal(false, cli.has('--not-set='))
    assert.equal(false, cli.option('-n='))
  })
})
