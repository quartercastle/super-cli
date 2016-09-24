'use strict';

const readline = require('readline');

class Cli {

  constructor(options){
    this.name = options.name;
    process.title = this.name;
    this.pid = process.pid;
    this.version = options.version;
    this.path = options.path || '';
    this.default = options.command || options.default;

    this.command = undefined;
    this.arguments = [];
    this.options = {};

    this.setupEvents();
  }

  setupEvents(){
    this.events = {
      on: {
        terminate: { callback: () => this.exit() },
        exit: { callback: () => {} },
        missing: { callback: () => {} }
      }
    };

    process.on('exit', () => this.trigger('exit'));
    process.on('SIGINT', () => this.trigger('terminate'));
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

    if(typeof callback === 'string'){
      callback = require(process.cwd()+'/'+this.path+callback);
    }

    if(typeof callback === 'object'){
      callback = callback.handle.bind(callback);
    }

    for(var i = 0, name; name = commands[i]; i++){
      this.events.on[name] = {
        name: name,
        callback: callback
      };
    }

    return this;
  }


  has(options){
    if(typeof options == 'string'){
      options = [options];
    }

    for(var i = 0, option; option = options[i]; i++){
      if(this.options[option] !== undefined){
        return this.options[option];
      }
    }

    return false;
  }


  trigger(name, args){
    if(!args){
      args = [];
    }

    if(this.events.on[name] !== undefined){
      return this.events.on[name].callback.apply(this, args);
    } else {
      this.trigger('missing');
    }
  }


  missing(callback){
    this.on('missing', callback);
  }

  prompt(question, callback){
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

    return this;
  }


  exit(code){
    process.exit(code);
  }

}

module.exports = Cli;
