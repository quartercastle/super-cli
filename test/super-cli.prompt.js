/* global describe, it, beforeEach */

const SuperCLI = require('../lib/super-cli')
let cli

describe('# cli.prompt', () => {
  beforeEach(() => {
    cli = new SuperCLI({
      autoRun: false
    })
  })

  it('Should prompt user for input', done => {
    // TODO Find a way to mock readline.question
    cli.run()
    done()
  })
})
