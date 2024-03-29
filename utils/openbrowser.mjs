import { execFileSync } from 'child_process'

const commands = new Map()
commands.set('linux', ['xdg-open'])
commands.set('android', ['xdg-open'])
commands.set('darwin', ['open'])
commands.set('win32', ['cmd', ['/c', 'start']])

const openBrowser = url => new Promise((resolve, reject) => {
  try {
    if (!commands.get(process.platform)) reject('unknown platform: ' + process.platform)
    const [command, args = []] = commands.get(process.platform)
    const result = execFileSync(
      command,
      [...args, encodeURI(url)],
      {detached: true}
    )
    resolve(result)
  } catch (error) {
    reject(error)
  }
})

export default openBrowser