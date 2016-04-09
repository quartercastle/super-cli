# Super-CLI

Super-CLI is a simple but powerful way to structure your CLI code.
The structure is simple you have your commands, options and arguments like `script command [options] <arguments>`.

### Install
```sh
npm install super-cli —save
```

### Usage
Create a new instance of the `CLI` class and specify the options needed.
```js
#!/usr/bin/env node
var CLI = require('super-cli');

var App = new CLI({
  name: 'App',
  // add options...
});

App.start();
```

##### Available options:
**options.name:** The name of the process.
**options.path:** Path to folder where commands are storage.
**options.command:** Default command

##### Register a command
```js
// Arguments
// command: name of the command
// disctiption: optional
// callback: function or string (will try to require the callback as a module).
App.on('command', './path/to/module');
App.on('command', 'description', function(){
  // callback
});
```

##### command with arguments
```js

```


```js
var CLI = require('super-cli');

App = new CLI({
  name: 'App',
  path: __dirname+'/commands'
});

App.command('')
```



