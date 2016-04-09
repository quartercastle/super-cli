## Super-CLI

Super-CLI is a simple but powerful way to structure your CLI Tools code.
The structure is simple and easy to maintain.

```
#!/usr/bin/env node
var CLI = require('super-cli');

var App = new CLI({
  name: 'App',
});

App.start();
```

Register a command
```
App.on('command', 'description', function(){
  // callback
});
```

Put all commands in a separate folder.
```
var CLI = require('super-cli');

App = new CLI({
  name: 'App',
  path: __dirname+'/commands'
});

App.command('')
```



