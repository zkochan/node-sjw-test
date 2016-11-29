const fs = require('fs')
const path = require('path')
const slice = Array.prototype.slice

function parseArgs(args) {
  let version = ''
  let deps = []
  let subdirs = {}
  slice.call(args).forEach(arg => {
    if(typeof arg === 'string') version = arg
    else if(Array.isArray(arg)) deps = arg
    else if(arg) subdirs = arg
  })
  return {version, deps, subdirs}
}

module.exports = {
  pkg(version, deps, subdirs) {
    // this is to work around intellij ui bug.
    // editing a call to a function that uses 'arguments' inside
    // causes editor to popup a blank tooltip directly over edit point
    return (function() {
      const {version, deps, subdirs} = parseArgs(arguments)
      const useEntryName = version === ''
      return (basedir, layoutName, entryName) => {
        const ver = useEntryName ? entryName : version
        return Object.assign({
          dist: {'main.js': genSrc(basedir, layoutName, ver, deps)},
          'package.json': JSON.stringify({'name': ver, main: 'dist/main.js'})
        }, subdirs)
      }
    })(version, deps, subdirs)
  },

  mod(version, deps, subdirs) {
    return (function() {
      const {version, deps, subdirs} = parseArgs(arguments)
      const useEntryName = version === ''
      return (basedir, layoutName, entryName) => {
        const ver = useEntryName ? entryName : version
        return Object.assign({'index.js': genSrc(basedir, layoutName, ver, deps)}, subdirs)
      }

    })(version, deps, subdirs)
  },

  idx(version, deps) {
    deps = deps || []
    return (basedir, layoutName) => {
      return genSrc(basedir, layoutName, version, deps)
    }
  },

  hdr(src) {
    return (basedir, layoutName) => {
      return header(basedir, layoutName, src)
    }
  }
}







function header(basedir, layoutName, src) {
  const out = 'console.log'
  const layoutdirlen = path.join(basedir, layoutName).length + 1
  const escBasedir = basedir.replace(/\\/g, '\\\\')
  const escLayoutName = layoutName.replace(/\\/g, '\\\\')
  return `
    const fs = require('fs')
    const path = require('path')
    const isSjw = /sjw$/.test(process.version)
    const symSwitch = isSjw 
      ? '  NODE_SUPPORT_SYMLINKS = ' + (process.env.NODE_SUPPORT_SYMLINKS || '0')
      : '  NODE_PRESERVE_SYMLINKS = ' + (process.env.NODE_PRESERVE_SYMLINKS || '0')
    ${out}(\`node     : \${process.version}\${symSwitch}\`)
    ${out}(\`date     : \${(new Date()).toUTCString()}\`)
    ${out}(\`base     : ${escBasedir}\`)
    ${out}(\`layout   : \${path.sep}${escLayoutName}\`)
    ${out}(\`dirname  : \${path.sep}\${__dirname.substring(${layoutdirlen})}\`)
    ${out}(\`realpath : \${path.sep}\${fs.realpathSync(__dirname).substring(${layoutdirlen})}\`)
    ${out}()
    ;(function() {
${src}
    })()
  `
}

function genSrc(basedir, layoutName, version, deps) {
  deps = deps || []
  const layoutdir = path.join(basedir, layoutName)
  const layoutlen = layoutdir.length
  const out = 'console.log'
  const escBasedir = basedir.replace(/\\/g, '\\\\')
  const escLayoutdir = layoutdir.replace(/\\/g, '\\\\')
  const escLayoutName = layoutName.replace(/\\/g, '\\\\')
  return `
    const fs = require('fs')
    const path = require('path')
    const keys = Object.keys.bind(null)
    const isMain = require.main === module
    const linktrace = global.linktrace = global.linktrace || {loaded: false, stack: []}
    const isSjw = /sjw$/.test(process.version)
    if(isMain) linktrace.layoutdir = \'${escLayoutdir}\'
    const layoutlen = linktrace.layoutdir.length
    const realpath = fs.realpathSync(__dirname)
    const sameBase = realpath.substring(0, layoutlen) === __dirname.substring(0, layoutlen)
    const dirname = (path.join('_/', __dirname.substring(layoutlen))).replace(/node_modules/g, 'nm')
    let realname = (sameBase 
      ? path.join('_/', realpath.substring(layoutlen))
      : path.join('$/', realpath.substring(${basedir.length + 1}))
    ).replace(/node_modules/g, 'nm')
    realname = (dirname === realname ? '<-' : realname)
    module.exports = access
    module.exports.version = '${version}'
    module.exports.dirname = dirname
    module.exports.realname = realname
    if(isMain) {
      const symSwitch = \`NODE_\${isSjw ? 'SUPPORT' : 'PRESERVE'}_SYMLINKS\`
      const symSwitchState = \`  \${symSwitch} = \${process.env[symSwitch] || '0'}\`
      ${out}(\`node   : \${process.version}\${symSwitchState}\`)
      ${out}(\`date   : \${(new Date()).toUTCString()}\`)
      ${out}('\\'$\\'    : \\'${escBasedir}\\'')
      ${out}(\`\\'_\\'    : \\'$\${path.sep}${escLayoutName}\\'\`)
      //${out}('\\'nm\\'   : \\'node_modules\\'')
      //${out}('[ver]  : module\\'s name with version')
      //${out}('<dep>  : alias used in require()')
      //${out}('\\'key\\'  : Module._cache key to instance')
      ${out}()
    }
    function chew(name, bite) {
      const meals = (global.meals = global.meals || {})
      const meal = meals[name] = meals[name] || []
      meal.push(bite)
      return bite
    }
    function spit(name, hdrs) {
      const meal = global.meals[name]
      const widths = {}
      const ckey = ' key -'
      meal.forEach(bite => keys(bite).forEach(
        key => widths[key] = Math.max(widths[key] || hdrs[key].length + 2, bite[key].length + 2)
      ))      
      function spitBite(bite, cols) {
        ${out}(cols.reduce((acc, col) => {        
          let nib = bite && bite[col] || '-'.repeat(widths[col] - 2) + ' '
          if(!bite && (col === 'dirname' && !isSjw || col === 'realname' && isSjw))
            nib = nib.substring(0, nib.length - ckey.length - 1) + ckey
          return acc + \`\${nib}\${' '.repeat(widths[col] - nib.length)}\` 
        }, ''))
      }
      const cols = keys(hdrs)
      spitBite(hdrs, cols)
      spitBite(null, cols)
      meal.forEach(bite => spitBite(bite, cols))
    }
    linktrace.loaded = true
    if(isMain)
      chew('link', {
        chain: \`node \'\_\${path.sep}\` + path.basename(__filename) + \"\'  \",
        loaded: 'LOADED',
        version: '[${version}]',
        dirname,
        realname,
      })
    function tracelink(dep) {
      const linkind = ' '.repeat((linktrace.stack.length) * 2)  
      const linkrec = chew('link', {chain: \`\${linkind} [${version}] \x3c\${dep}>   \`})
      linktrace.stack.push(linktrace.loaded)
      linktrace.loaded = false
      const ref = require(dep)
      Object.assign(linkrec, {
        loaded: linktrace.loaded ? 'LOADED': '  **  ',
        version: \`[\${ref.version}]\`,
        dirname: ref.dirname,
        realname: ref.realname
      })
      linktrace.loaded = linktrace.stack.pop()
      return ref
    }
    
    let linkerr = null
    // here's where we link out dependencies
${deps.reduce((acc, dep) => acc + `    let $$_${dep}_$$\n`, '')}
    try {
${deps.reduce((acc, dep) => acc + `      $$_${dep}_$$ = tracelink(\'${dep}\')\n`, '')}
    }
    catch(err) {
      if(!isMain) throw err
      linkerr = err
    }

    if(isMain) {
      if(linkerr) {
        ${out}(linkerr.stack)
        return
      }
      
      spit('link', {
        chain: 'require', version: 'linked', loaded: 'ld/ksh', dirname: '__dirname', realname: 'realpath'
      })
    }
    let callcount = 0
    function access(from, alias, calldepth = 0) {
      ++callcount
      chew('call', {
        from: \`\${' '.repeat(calldepth * 2)}\${from} \${alias}()\`,
        version: '[${version}]',
        callcount: '  ' + (access.beencalled ? 'r*' : (callcount < 10 ? ' ' : '') + callcount) + '  ',
        dirname,
        realname,
      })  
      ++calldepth

      if(access.beencalled) return
      access.beencalled = true
      
      // here's where we call our depedencies
${deps.reduce((acc, dep) => acc + `        $$_${dep}_$$(\'[${version}]\', \'<${dep}>\', calldepth)\n`, '')}
      
      access.beencalled = false
    }
    if(isMain) {
      let callerr
      try {
        access(\'node\', \`\'\_\${path.sep}\` + path.basename(__filename) + \"\'\")
      }
      catch(err) {callerr = err}
      if(callerr){${out}(err.stack); return}
      ${out}()
      spit('call', {from: 'caller', version: 'called', callcount: '()-cnt', dirname: '__dirname', realname: 'realpath'})
    }
`
}
