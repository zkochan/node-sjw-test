const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const mkdirp = require('mkdirp')

const isWin = process.platform === 'win32'
const env = process.env

const types = module.exports = {
  relOn(layoutName, main) {run(this.relOn, layoutName, main)},
  relOff(layoutName, main) {run(this.relOff, layoutName, main)},
  rel(layoutName, main) {
    this.relOn(layoutName, main)
    this.relOff(layoutName, main)
  },
  relOnExp(layoutName, main) {run(this.relOnExp, layoutName, main)},
  relOffExp(layoutName, main) {run(this.relOffExp, layoutName, main)},
  relExp(layoutName, main) {
    this.relOnExp(layoutName, main)
    this.relOffExp(layoutName, main)
  },

  sjwOn(layoutName, main) {run(this.sjwOn, layoutName, main)},
  sjwOff(layoutName, main) {run(this.sjwOff, layoutName, main)},
  sjw(layoutName, main) {
    this.sjwOn(layoutName, main)
    this.sjwOff(layoutName, main)
  },
  sjwOnExp(layoutName, main) {run(this.sjwOnExp, layoutName, main)},
  sjwOffExp(layoutName, main) {run(this.sjwOffExp, layoutName, main)},
  sjwExp(layoutName, main) {
    this.sjwOnExp(layoutName, main)
    this.sjwOffExp(layoutName, main)
  },

  compare(layoutName, expType, resType, filter) {
    const usefilter = (line) => {
      if(/^((node|date)\s*:)|(-.* key -.*)/.test(line)) return true
      return filter && filter(line)
    }
    const expect = readrun(asExp(layoutName, expType))
    const result = readrun(asRes(layoutName, resType))
    if(expect.length < 3) throw new Error(`'expect' file is empty`)
    if(result.length < 3) throw new Error(`'result' file is empty`)
    if(expect.length !== result.length) return false
    return expect.every((line, index) => usefilter(line) || line === result[index])
  }
}

function readrun(filepath) {return fs.readFileSync(filepath, 'utf8').split('\n')}
function asExp(layoutName, type) {return as(env.SJW_TEST_EXPECT, layoutName, type)}
function asRes(layoutName, type) {return as(env.SJW_TEST_RESULTS, layoutName, type)}
function as(outkind, layoutName, type) {return path.resolve(outkind, hostExt(layoutName, type))}
function hostExt(layoutName, type) {
  return (isWin ? 'win' : 'nix') + '/' + layoutName + typeToExt(type)
}
function typeToExt(type) {
  switch(type) {
  case types.relOn:
  case types.relOnExp: return '.rel.on.txt'
  case types.relOff:
  case types.relOffExp: return '.rel.off.txt'
  case types.sjwOn:
  case types.sjwOnExp: return '.sjw.on.txt'
  case types.sjwOff:
  case types.sjwOffExp: return '.sjw.off.txt'
  }
}

const relTypes = [types.relOn, types.relOnExp, types.relOff, types.relOffExp]
const symonTypes = [types.relOn, types.relOnExp, types.sjwOn, types.sjwOnExp]
const expTypes = [types.relOnExp, types.relOffExp, types.sjwOnExp, types.sjwOffExp]
function run(type, layoutName, main = '') {
  const isRel = relTypes.includes(type)
  const isSymOn = symonTypes.includes(type)
  const isExp = expTypes.includes(type)

  const modulePath = path.resolve(env.SJW_TEST_BASE, env.SJW_TEST_LAYOUTS, layoutName, main)
  const node = isRel ? (env.SJW_TEST_NODE_REL || 'node') : env.SJW_TEST_NODE_SJW
  if(!fs.existsSync(node))
    throw new Error(`Can't locate node. Check your SJW_TEST_NODE_${isRel ? 'REL' : 'SJW'} env var.`)
  const symflag = isRel ? 'NODE_PRESERVE_SYMLINKS' : 'NODE_SUPPORT_SYMLINKS'
  const cwd = env.SJW_TEST_BASE
  env[symflag] = isSymOn ? '1' : '0'

  const outpath = (isExp ? asExp : asRes)(layoutName, type)
  mkdirp.sync(path.dirname(outpath))
  const result = cp.spawnSync(node, [modulePath], {cwd})
  fs.writeFileSync(outpath, result.stdout)
}