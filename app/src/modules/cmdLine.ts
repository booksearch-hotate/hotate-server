const cmdList = process.argv.slice(2)

export function isLocal () {
  return cmdList.includes('local')
}
