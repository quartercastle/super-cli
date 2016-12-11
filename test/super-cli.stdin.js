/* global describe, it, beforeEach */

const SuperCLI = require('../lib/super-cli')
const EventEmitter = require('events')
let cli

process.stdin = EventEmitter
process.stdin.read = () => 'message'

describe('# cli.stdin', () => {
  beforeEach(() => {
    cli = new SuperCLI({
      autoRun: false
    })
  })

  it('Should receive data on stdin', done => {
    cli.stdin(() => done())
    process.stdin.emit('readable', 'message')
  })
})
