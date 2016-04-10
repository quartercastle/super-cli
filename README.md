# Super-CLI

Super-CLI is a rapid way to create simple and powerful command line tools.
The scripts will be structured as follows 
`your-script command [options] <argument>, ...`

### Install
```sh
npm install super-cli —save
```

### Usage 
To get started you have to require the super-cli module and register your commands.
Remember to set the environment to node at the top of the script `#!/usr/bin/env node` and make your script executable `chmod a+x your-script`. 
```js
#!/usr/bin/env node
var CLI = require('super-cli');

var App = new CLI({
  name: 'my-super-cli-script',
});

// register simple command
App.on('command', function(){
  // do something
});

// register a command named addUser with arguments <firstname>, <lastname>
App.on('addUser', function(firstname, lastname){
  // CLI arguments will be accessible as function arguments

  // an CLI option could be to let the user be admin
  App.has(['-a', '--admin']); // will return true if the -a or --admin flag is set.
});

// another way to register the addUser command could be only to have the firstname
// as an argument and let the lastname be optional 
App.on('addUser', function(firstname){
  var lastname = App.has(['-l=', '--lastname=']); // will return the value of lastname if its set.
});

// start your script
App.start();
```

##### Available CLI options:
**name:** The name of the process.<br>
**path:** Path to folder where commands are storage (will be described later).<br>
**command:** Default command, run this command if no command is typed after the script.<br>

##### Commands
To register a command you have to give it a name and a callback. The callback can however be a string if its a path to a node module. It is possible to get commands to accept arguments if you add them as function arguments in javascript see below.
```js
App.on('command', './path/to/command'); // the path option will prefix the string
App.on('command', (arg1, arg2, ...) => {
  // This command accepts arguments
});
```

##### Options
To get and check option values for a command, can be done with the `.has()` method. The has method accepts both a single string or an array of strings. This can be useful if you are having a shorthand and descriptive option for the same thing, like an option to se the help manual. 

```js
App.has(['-h', '--help']); //  will return true if set when command is run
App.has(['-k=', '--key=']); // will return the value of key if set
```



