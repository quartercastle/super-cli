# Super-CLI

[![Build Status](https://travis-ci.org/kvartborg/super-cli.svg?branch=master)](https://travis-ci.org/kvartborg/super-cli)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Super-CLI is a rapid way to create simple and powerful command line tools.
The scripts will be structured as follows
`your-script command [options] [arguments, ...]`

### Install
```sh
npm install super-cli -—save
```

### Usage
To get started you have to require the super-cli module and register your commands.
Remember to set the environment to node at the top of the script `#!/usr/bin/env node` and make your script executable `chmod a+x your-script`.
```js
#!/usr/bin/env node

const SuperCLI = require('super-cli');

const app = new SuperCLI({
  name: 'my-super-cli-script'
});

app.on('add:user', (name) => {
  console.log('Adding user: ', name);
});

app.start();
```

#### Register commands
```js
app.on('my-command', (arg1, arg2, ...) => {
  // do something
});
```

#### Check for options
```js
app.has(['-h', '--help']); // will return true if set
app.has(['-l=', '--lastname=']); // will return the value of --lastname if set
```

#### Prompt user for input
```js
app.prompt('My question: ').then(answer => console.log(answer));
```

#### Missing command
```js
app.on('missing', () => {
  // if the entered command doesn't match any registered commands
  // this event will fire
});
```

#### App on exit
```js
app.on('exit', () => {
  // this event will fire on app exit or termination
});
```

#### Exit app
```js
app.exit(); // will close the app and fire the exit event
```
