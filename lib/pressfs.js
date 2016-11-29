const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const isWin = /^win/.test(process.platform)

module.exports = {
  press(basedir, layoutName, stamp, cb) {
    basedir = path.resolve(basedir || '.')
    const layoutdir = path.join(basedir, layoutName)
    rimraf.sync(layoutdir)
    const linkq = []

    if (typeof stamp === 'function') stamp = stamp(basedir, layoutName)
    impl(layoutdir, stamp)
    function impl(parent, stamp) {
      mkdirp.sync(parent)
      Object.keys(stamp).forEach(entryName => {
        let entry = stamp[entryName]
        if (typeof entry === 'function') entry = entry(basedir, layoutName, entryName)
        const pathmode = entryName.split(':')
        const mode = pathmode[1] && parseInt(pathmode[1], 8)
        entryName = pathmode[0]
        const entrypath = path.join(parent, entryName)

        if (typeof entry === 'object') impl(entrypath, entry)
        else if (entryName[0] !== '$') {
          fs.writeFileSync(entrypath, entry)
          mode && fs.chmodSync(entrypath, mode)
        }
        else {
          const base = (entry.charCodeAt(0) === 46/*.*/) ? '' : basedir
          const target = path.join(base, entry)
          const alias = path.join(parent, entryName.substring(1))
          linkq.push({target, isRel: base === '', alias, mode})
        }
      })
    }

    linkq.forEach(l => {
      const target = l.isRel ? path.resolve(path.dirname(l.alias), l.target) : l.target
      const type = fs.lstatSync(target).isFile() ? 'file' : (l.isRel || !isWin ? 'dir' : 'junction')
      fs.symlinkSync(l.target, l.alias, type)
      l.mode && lchmodSync(l.alias, l.mode)
    })

    // will make async when the need becomes obvious
    if (cb) cb(null)
  }
}


const constants = fs.constants
function lchmodSync(path, mode) {
  var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)
  var threw = true
  var ret
  try {
    ret = fs.fchmodSync(fd, mode)
    threw = false
  } finally {
    if (threw) {
      try {
        fs.closeSync(fd)
      } catch (er) {}
    } else {
      fs.closeSync(fd)
    }
  }
  return ret
}

