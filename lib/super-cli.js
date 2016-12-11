const readline = require('readline')
const EventEmitter = require('events')

class Cli extends EventEmitter {

  constructor (options = {}) {
    super()
    this.pid = process.pid

    this.command = undefined
    this.arguments = []
    this.options = options

    this.setProcessTitle()
    this.setupEvents()
  }

  /**
   * Setup process events
   * @private
   */
  setupEvents () {
    process.on('exit', () => this.emit('exit'))
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
   * Run
   * @public
   */
  run () {
    this.parseArguments()
    this.emit((this.command || this.default), ...this.arguments)
  }

  /**
   * Parse arguments
   * @private
   */
  parseArguments () {
    let args = process.argv

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
   * Has options
   * TODO change options param to ...options instead of an array
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
    return this.has.apply(this, options)
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
   * Exit process
   * @public
   */
  exit (code) {
    process.exit(code)
  }

}

module.exports = Cli
