const readline = require('readline')
const EventEmitter = require('events')

class Cli extends EventEmitter {

  constructor (options = {}) {
    super()
    this.pid = process.pid

    this.command = undefined
    this.arguments = []

    this.options = {
      autoRun: options.autoRun
    }

    this.setProcessTitle()
    this.setupEvents()
    this.parseArguments()

    if (this.options.autoRun || this.options.autoRun === undefined) {
      process.nextTick(this.run.bind(this, this.command))
    }
  }

  /**
   * Setup process events
   * @private
   */
  setupEvents () {
    this.on('exit', () => {})
    process.on('exit', () => this.run('exit'))
    process.on('SIGINT', () => this.exit())
  }

  /**
   * Set the process title by options or give it the script name
   * @private
   */
  setProcessTitle () {
    let title = process.argv[1].split('/')[process.argv[1].split('/').length - 1]
    process.title = this.options.title || title
  }

  /**
   * Run command
   * @param {String} command
   * @public
   */
  run (command) {
    if (!command) {
      command = this.command
    }

    if (this._events[command] === undefined) {
      return this.emit('*', this.command, ...this.arguments)
    }

    return this.emit(command, ...this.arguments)
  }

  /**
   * Parse arguments
   * @private
   */
  parseArguments () {
    let args = process.argv.slice()

    delete args[0]
    delete args[1]

    process.title += args.join(' ').replace(' ', '')

    args.forEach((arg, index) => {
      if (this.arguments.length === 0 && this.command === undefined && arg[0] !== '-') {
        this.command = arg
        return
      }

      if (arg[0] === '-') {
        if (arg.indexOf('=') !== -1) {
          this.options[arg.split('=')[0] + '='] = arg.split('=')[1]
        } else {
          if (arg[1] === '-') {
            this.options[arg] = true
            return
          }

          var chars = arg.replace('-', '').split('')
          for (let char of chars) {
            this.options['-' + char] = true
          }
        }
        return
      }

      this.arguments.push(arg)
    })
  }

  /**
   * Check for options an retreive their values
   * @param {Array} options
   * @return {Boolean}
   * @public
   */
  has (...options) {
    for (let option of options) {
      if (this.options[option] !== undefined) {
        return this.options[option]
      }
    }

    return false
  }

  /**
   * Alias for has
   * @alias has
   * @return {Boolean}
   * @public
   */
  option (...options) {
    return this.has(...options)
  }

  /**
   * Promt for a question
   * @return {Promise}
   * @public
   */
  prompt (question, callback) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      rl.question(question + ' ', (result) => {
        resolve(result)
        rl.close()
      })
    })
  }

  /**
   * Register command
   * @override on
   * @param {String|Array} event
   * @param {Function|Array} callback
   * @return {SuperCLI}
   * @public
   */
  on (commands, callback) {
    if (!Array.isArray(commands)) {
      commands = [commands]
    }

    for (let command of commands) {
      if (this._events[command] === undefined) {
        this._events[command] = [callback]
      } else {
        this._events[command].push(callback)
      }
    }

    return this
  }

  /**
   * Exit process
   * @public
   */
  exit (code) {
    process.exit(code)
  }

}

module.exports = Cli
