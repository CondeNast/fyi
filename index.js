if (require.main === module) {
  const { spawn } = require('child_process')
  let start = spawn('npm', ['start'], {env: {...process.env, PORT: process.env.NODE_PORT || 8081}})

  start.stdout.pipe(process.stdout)

  start.stderr.pipe(process.stderr)

  start.on('close', (code) => {
    process.stdout.write(`child process exited with code ${code}`)
  })
}
