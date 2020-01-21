process.env.NODE_ENV = 'development'

const path = require('path')
const webpack = require('webpack')
const electron = require('electron')
const WebpackDevServer = require('webpack-dev-server')
const renderConfig = require('./webpack/webpack.renderer')
const mainConfig = require('./webpack/webpack.main')
const { errHandler } = require('./webpack/helper')
const { spawn } = require('child_process')

class Application {
  constructor () {
    this.electronProcess = null

    Promise.all([this.startRender(), this.startMain() ])
      .then(() => this.startElectron())
  }

  startMain () {
    return new Promise((resolve, reject) => {
      /** Main compiler */
      const mainCompiler = webpack(mainConfig)
  
      mainCompiler.run(errHandler)
  
      mainCompiler.watch({
        aggregateTimeout: 300,
        poll: 1000
      }, (err, stats) => {
        if (this.electronProcess && this.electronProcess.kill) {
          process.kill(this.electronProcess.pid)
          this.electronProcess = null
          this.startElectron()
        }
        resolve()
      })
    })
  }

  startRender () {
    return new Promise((resolve, reject) => {
      /** Render compiler */
      const renderCompiler = webpack(renderConfig)
  
      /** Render build server */
      const renderServer = new WebpackDevServer(
        renderCompiler,
        {
          ...renderConfig.devServer,
          before (_, ctx) {
            ctx.middleware.waitUntilValid(resolve)
          }
        }
      )
      renderServer.listen(renderConfig.devServer.port)
    })
  }

  startElectron () {
    this.electronProcess = spawn(electron, ['--inspect=5858', path.join(__dirname, '../dist/main.js')])
  
    this.electronProcess.stdout.on('data', data => {
      console.log(data);
      // electronLog(data, 'blue')
    })
    this.electronProcess.stderr.on('data', data => {
      console.log(data);
    })
  
    this.electronProcess.on('close', () => {
      // if (!manualRestart) process.exit()
      process.exit()
    })
  }
}

new Application()