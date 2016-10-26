'use strict';

const readline = require('readline');

class Cli {

  constructor(options){
    this.name = options.name;
    process.title = this.name;
    this.pid = process.pid;
    this.version = options.version;
    this.default = options.command || options.default;

    this.command = undefined;
    this.arguments = [];
    this.options = {};

    this.setupEvents();
  }

  setupEvents(){
    this.events = {
      exit: [],
      missing: []
    };

    process.on('exit', () => this.trigger('exit'));
    process.on('SIGINT', () => this.exit());
  }

  start(){
    this.getArguments();
    this.trigger((this.command || this.default), this.arguments);
  }

  getArguments(){
    delete process.argv[0]; // node
    delete process.argv[1]; // script
    process.argv.forEach((arg, index) => {
      if(this.arguments.length == 0 && this.command === undefined && arg[0] !== '-'){
        this.command = arg;
        return;
      }

      if(arg[0] === '-'){
        if(arg.indexOf('=') !== -1){
          this.options[arg.split('=')[0]+'='] = arg.split('=')[1];
        } else {
          if(arg[1] === '-'){
            this.options[arg] = true;
            return;
          }

          var chars = arg.replace('-', '').split('');
          for(var i = 0, char; char = chars[i]; i++){
            this.options['-'+char] = true;
          }
        }
        return;
      }

      this.arguments.push(arg);
    });
  }

  on(commands, callback){
    if(typeof commands === 'string'){
      commands = [commands];
    }

    for(let command of commands){
      if(this.events[command] === undefined){
        this.events[command] = [];
      }

      this.events[command].push(callback);
    }

    return this;
  }

  trigger(command, args){
    if(this.events[command] === undefined){
      return this.trigger('missing');
    }

    for(let event of this.events[command]){
      event.apply(this, args);
    }

    return this;
  }

  has(options){
    if(typeof options == 'string'){
      options = [options];
    }

    for(let option of options){
      if(this.options[option] !== undefined){
        return this.options[option];
      }
    }

    return false;
  }

  missing(callback){
    this.on('missing', callback);
    return this;
  }

  static prompt(question, callback){
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      let result = rl.question(question+' ', (result) => {
        resolve(result);
        rl.close();
      });
    });
  }

  exit(code){
    process.exit(code);
  }

}

module.exports = Cli;
