'use strict';

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

    this.events = {
      on: {
        exit: { callback: () => {} },
        missing: { callback: () => {} }
      }
    };
  }


  start(){
    process.on('exit', () => this.trigger('exit'));
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


  on(commands, description, callback){
    if(typeof commands == 'string'){
      commands = [commands];
    }

    if(callback === undefined){
      callback = description;
      description = '';
    }

    if(typeof callback == 'string'){
      callback = require(this.path+'/'+callback).bind(this);
    }

    for(var i = 0, name; name = commands[i]; i++){
      this.events.on[name] = {
        name: name,
        description: description,
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


  exit(code){
    process.exit(code);
  }

}

module.exports = Cli;
