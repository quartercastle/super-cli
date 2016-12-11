# Super-CLI

[![Build Status](https://travis-ci.org/kvartborg/super-cli.svg?branch=master)](https://travis-ci.org/kvartborg/super-cli)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Super-CLI is a rapid way to create simple and powerful command line tools.
The scripts will be structured as follows
`super-cli-script command [options, ...] [arguments, ...]`

### Install
```sh
npm install super-cli -—save
```

### Usage
To get started you have to require the super-cli module and register your commands.
Remember to set the environment to node at the top of the script `#!/usr/bin/env node` and make your script executable `chmod a+x super-cli-script`.
```js
#!/usr/bin/env node

const SuperCLI = require('super-cli')

const cli = new SuperCLI()

cli.on('my-command', arg => {
  console.log(arg)
})

cli.run()
```

#### Register commands
```js
cli.on('my-command', (arg1, arg2, ...) => {
  // do something
})
```

#### Check for options
```js
cli.has('-h', '--help') // will return true if set
cli.has('-l=', '--lastname=') // will return the value of --lastname if set
// Or you could use the alias option
cli.option('-l=', '--lastname=')
```

#### Prompt user for input
```js
cli.prompt('My question:').then(answer => console.log(answer))
```

#### Catch all and turn everything into arguments
```js
cli.on('*', ...args => {
  console.log(args)
})
```

#### Missing command
```js
cli.missing(...args => {
  // if the entered command doesn't match any registered commands
  // this event will fire
})
```

#### App on exit
```js
cli.on('exit', () => {
  // this event will fire on cli exit or termination
})
```

#### Exit cli
```js
cli.exit() // will close the cli and fire the exit event
```
