# Super-CLI

Super-CLI is a rapid way to create simple and powerful command line tools.
The scripts will be structured as follows
`your-script command [options] <argument> ...`

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
