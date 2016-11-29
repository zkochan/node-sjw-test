const path = require('path')

const env = process.env

env.SJW_TEST_BASE = __dirname
env.SJW_TEST_LAYOUTS = '_layouts'
env.SJW_TEST_RESULTS = path.resolve(env.SJW_TEST_BASE, 'results')
env.SJW_TEST_EXPECT = path.resolve(env.SJW_TEST_BASE, 'expect')

process.argv.forEach((arg, idx, argv) => {
  const opt = arg[0] === '-' && arg[1] === '-' ? arg.substring(2).toUpperCase() : null
  if(!opt) return
  const val = argv[idx + 1] || ''
  env['SJW_TEST_' + opt.replace(/\-/g, '_')] = val[0] === '-' ? '1' : val
})

const cp = require('child_process')
let defaultNode

function getNodeInfo(node) {
  const res = cp.spawnSync(node, ['-e', `process.stdout.write(process.version + '\x01' + process.argv[0])`])
  const parts = res.stdout && res.stdout.toString().split('\x01') || []
  return {version: parts[0], path: parts[1]}
}
function check(path) {
  const check = getNodeInfo(path)
  const isRel = path === env.SJW_TEST_NODE_REL
  if(!check.version || /sjw$/.test(check.version) && !isRel || isRel) return

  console.log(`Set the SJW_TEST_NODE_${isRel?'REL':'SJW'} env var to location of node release`)
  process.exit(1)
}

if(!env.SJW_TEST_NODE_REL || env.SJW_TEST_NODE_REL.trim() === '') {
  defaultNode = defaultNode || getNodeInfo('node')
  if(defaultNode.version && /sjw$/.test(defaultNode.version)) {
    console.log('Set the SJW_TEST_NODE_REL env var to location of node release')
    process.exit(1)
  }
  env.SJW_TEST_NODE_REL = defaultNode.path
}
else check(env.SJW_TEST_NODE_REL)

if(!env.SJW_TEST_NODE_SJW || env.SJW_TEST_NODE_SJW.trim() === '') {
  defaultNode = defaultNode || getNodeInfo('node')
  if(defaultNode.version && !/sjw$/.test(defaultNode.version)) {
    console.log('Set the SJW_TEST_NODE_SJW env var to location of node v7.2.0-sjw')
    process.exit(1)
  }
  env.SJW_TEST_NODE_SJW = defaultNode.path
}
else check(env.SJW_TEST_NODE_SJW)

