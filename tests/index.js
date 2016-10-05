const SuperCLI = require('../libs/super-cli');
const assert = require('assert');

process.argv = [
  'node',
  'my-script',
  'command',
  '-h',
  '--help',
  '-k',
  '--key=',
  'arg1',
  'arg2'
];

const app = new SuperCLI({
  name: 'my-script'
});

describe('# Setup the script', () => {
  it('The process name should be my-script', () => {
    assert.equal('my-script', process.title);
  });
});

describe('# Commands', () => {
  let triggered = false;
  it('Should register the command', () => {
    app.on('command', () => triggered = true);
    assert.equal(true, app.events.command !== undefined);
  });

  it('Should trigger the command', () => {
    app.trigger('command');
    assert.equal(true, triggered);
  });
});

describe('# Arguments', () => {
  let arg1 = false, arg2 = false;
  app.on('command', (a1, a2) => {
    arg1 = a1;
    arg2 = a2;
  });
  it('The command should receive arg1 and arg2', () => {
    app.trigger('command', [true, false]);
    assert.equal(true, arg1);
    assert.equal(false, arg2);
    app.trigger('command', [false, true]);
    assert.equal(false, arg1);
    assert.equal(true, arg2);
  });
});
