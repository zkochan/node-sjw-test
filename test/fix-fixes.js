const path = require('path')
const test = require('tape')
require('./environment')

const env = process.env
const base = path.resolve(env.SJW_TEST_BASE, env.SJW_TEST_LAYOUTS)

const press = require('../lib/pressfs').press.bind(null, base)
const {hdr, mod, idx} = require('../lib/module-stamps')
const node = require('../lib/runnode')

function testfix(t, main, layout, filter) {
  const mainType = typeof main
  if(mainType === 'object' || mainType === 'function') {
    filter = layout
    layout = main
    main = undefined
  }

  if(layout) press(t.name, layout)

  t.plan(1)

  // windows 'executable' resolution process for file-symlink
  // 1. is file-symlink.ext in PATHEXT?
  // 2. no, then fail
  // 3. yes, then follow file-symlink to its target
  // 4. lookup target.ext assoc file-type
  // 5. lookup startup command for file-type
  // 6. launch with target in command line

  // basically this means that, on windows, node is never
  // launched with an actual file-symlink as an arg, as
  // windows has already followed.

  // we're starting node differently than how windows
  // would from above process. so testing main file
  // symlinks on windows requires removing '.js' ext
  // from PATHEXT so the link wont be followed for
  // 'regular' .js file
  process.env.PATHEXT = (process.env.PATHEXT || '')
    .split(';')
    .filter(ext => ext.toUpperCase() !== '.JS')
    .join(';') + ';.JX;'

  node.sjwOnExp(t.name, main)
  node.relOn(t.name, main)

  t.assert(node.compare(t.name, node.sjwOn, node.relOn, filter), '')

  t.end()
}


test('fix-main-js-file-sl-rel-target', t => {
  testfix(t, 'maindir/node_modules/odd/index.js', {
    outsidedir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          }
        }),
      }
    },
    maindir: {
      node_modules: {
        anc: mod('anc_1'),
        odd: {
          '$index.js': '../../../outsidedir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
          }
        },
      }
    }
  })
})

test('fix-main-js-file-sl-abs-target', t => {
  testfix(t, 'maindir/node_modules/odd/index.js', {
    outsidedir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          }
        }),
      }
    },
    maindir: {
      node_modules: {
        anc: mod('anc_1'),
        odd: {
          '$index.js': 'fix-main-js-file-sl-abs-target/outsidedir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
          }
        },
      }
    }
  })
})




test('fix-main-js-file-sl-rel-target-dir-sl-in-path', t => {
  testfix(t, 'bin/node_modules/main/index.js', {
    realdir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          },
        })
      }
    },
    $symdir: './realdir',
    bin: {
      node_modules: {
        anc: mod('anc_1'),
        main: {
          '$index.js': '../../../symdir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
          }
        }
      }
    }
  })
})


test('fix-main-js-file-sl-abs-target-dir-sl-in-path', t => {
  testfix(t, 'bin/node_modules/main/index.js', {
    realdir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          },
        })
      }
    },
    $symdir: './realdir',
    bin: {
      node_modules: {
        anc: mod('anc_1'),
        main: {
          '$index.js': 'fix-main-js-file-sl-abs-target-dir-sl-in-path/symdir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
          }
        }
      }
    }
  })
})



test('fix-main-js-dir-sl', t => {
  testfix(t, 'realdir/node_modules/symdir', {
    outsidedir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          },
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: '../../outsidedir/node_modules/main'
      }
    },
  })
})


test('fix-main-js-dir-sl-in-path', t => {
  testfix(t, 'realdir/node_modules/symdir/main/index.js', {
    outsidedir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          },
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: '../../outsidedir/node_modules/'
      }
    },
  })
})


test('fix-main-js-file-sl-dir-sl-in-path-rel-target-dir-sl-in-path', t => {
  testfix(t, 'symbin/node_modules/main/index.js', {
    realdir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          },
        })
      }
    },
    $symdir: './realdir',
    bin: {
      node_modules: {
        anc: mod('anc_1'),
        main: {
          '$index.js': '../../../symdir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
          }
        }
      }
    },
    $symbin: './bin'
  })
})



const $mainx = process.platform === 'win32' ? '$main.jx' : '$main.jx:777'

test('fix-main-x-file-sl-rel-target', t => {
  testfix(t, 'node_modules/bin/main.jx', {
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          }
        }),
      },
    },
    node_modules: {
      anc: mod('anc_WRONG'),
      bin: {
        [$mainx]: '../../realdir/node_modules/main/index.js',
        node_modules: {
          desc: mod('desc_WRONG')
        }
      }
    },
  })
})


test('fix-main-x-file-sl-abs-target', t => {
  testfix(t, 'node_modules/bin/main.jx', {
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          }
        }),
      },
    },
    node_modules: {
      anc: mod('anc_WRONG'),
      bin: {
        [$mainx]: 'fix-main-x-file-sl-abs-target/realdir/node_modules/main/index.js',
        node_modules: {
          desc: mod('desc_WRONG')
        }
      }
    },
  })
})



test('fix-main-x-file-sl-rel-target-dir-sl-in-path', t => {
  testfix(t, 'bin/node_modules/int/main.jx', {
    main: {
      node_modules: {
        anc: mod('anc_WRONG_2'),
        mainmod: mod('main', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          }
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: '../../main/node_modules/mainmod'
      }
    },
    bin: {
      node_modules: {
        anc: mod('anc_WRONG_1'),
        int: {
          [$mainx]: '../../../realdir/node_modules/symdir/index.js',
          node_modules: {
            desc: mod('desc_WRONG_1')
          }
        }
      }
    }
  })
})

test('fix-main-x-file-sl-abs-target-dir-sl-in-path', t => {
  testfix(t, 'bin/node_modules/int/main.jx', {
    main: {
      node_modules: {
        anc: mod('anc_WRONG_2'),
        mainmod: mod('main', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          }
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: 'fix-main-x-file-sl-abs-target-dir-sl-in-path/main/node_modules/mainmod'
      }
    },
    bin: {
      node_modules: {
        anc: mod('anc_WRONG_1'),
        int: {
          [$mainx]: 'fix-main-x-file-sl-abs-target-dir-sl-in-path/realdir/node_modules/symdir/index.js',
          node_modules: {
            desc: mod('desc_WRONG_1')
          }
        }
      }
    }
  })
})

test('fix-main-x-file-sl-dir-sl-in-path-rel-target-sl-in-path', t => {
  testfix(t, 'symbin/node_modules/int/main.jx', {
    main: {
      node_modules: {
        anc: mod('anc_WRONG_2'),
        mainmod: mod('main', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          }
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: '../../main/node_modules/mainmod'
      }
    },
    bin: {
      node_modules: {
        anc: mod('anc_WRONG_1'),
        int: {
          [$mainx]: '../../../realdir/node_modules/symdir/index.js',
          node_modules: {
            desc: mod('desc_WRONG_1')
          }
        }
      }
    },
    $symbin: './bin'
  })
})





















const memout = 'Math.round(process.memoryUsage().heapTotal / 1024).toLocaleString()'
const hogger = {
  'index.js': `
    require('hog')()
    console.log('heap = %s k', ${memout})
  `,
  node_modules: {
    $hog: '../../hog'
  }
}

test('fix-memhog-fun', t => {
  testfix(t, {
    'index.js': hdr(`
      console.log('heap = %s k', ${memout})
      require('hog1')
      require('hog2')
      require('hog3')
    `),
    node_modules: {
      hog: {
        'index.js': `
          const arr = []
          let callcount  = 0
          let i = 0
          while(i < 1024 * 100) arr[i++] = \`gobble \${i}\`
          module.exports = () => {
            if(callcount === 0) console.log('mmmmm.... memory... yummmm...')
            else if(callcount === 1) console.log('i\\'m pretty full.. thanks for asking though')
            else console.log('really.. i\\'m actually stuffed.. thanks anyways..')
            console.log()
            ++callcount
          }
        `
      },
      hog1: hogger,
      hog2: hogger,
      hog3: hogger,
    }
  }, line => !/^heap = /.test(line))
})

function dep(name)  {
  return {
    'index.js': idx('dep' + name, ['shr']),
    node_modules: {
      '$shr': '../../shr'
    }
  }
}

test('fix-multi-symlink-one-instance', t => {
  testfix(t, mod('main_1', ['depA', 'depB', 'depC'], {
    node_modules: {
      shr: mod('shr_1', ['deepShr'], {
        node_modules: {
          deepShr: mod('deepShr_1')
        }
      }),
      depA: dep('A_1'),
      depB: dep('B_1'),
      depC: dep('C_1')
    }
  }))
})



test('fix-addon-blowup', t => {
  press('fix-addon-addoff', {
    'addoff': {
      'addoff.cc': `
      #include \x3cnode.h>
  
      namespace addoff {
  
      using v8::FunctionCallbackInfo;
      using v8::Isolate;
      using v8::Local;
      using v8::Object;
      using v8::String;
      using v8::Value;
  
      void Method(const FunctionCallbackInfo\x3cValue>& args) {
        static int callcount = 0;
        Isolate* isolate = args.GetIsolate();
        const char* message = callcount == 0
          ? "...add-off here... hey... i smell smoke..."
          : "...i'm still here... hmm... guess it was nothing...";
        args.GetReturnValue().Set(String::NewFromUtf8(isolate, message));
        ++callcount;
      }
  
      void LightBomb(Local\x3cObject> exports) {
        #define UNLIT 0
        #define LIT 1
        static int bomb = UNLIT;
  
        if (bomb == LIT)
          // os's LOVe this
          {*((int*)0) = 0;}
  
        if (bomb == UNLIT)
          // lets make things interesting, shall we?
          {bomb = LIT;}
  
        NODE_SET_METHOD(exports, "isLit", Method);
      }
  
      NODE_MODULE(addoff, LightBomb)
  
      }
      `,
      // node-gyp doesn't like this indented.. odd
      'binding.gyp': `
{
  "targets": [
    {
      "target_name": "addoff",
      "sources": [ "addoff.cc" ]
    }
  ]
}
`}})

  const cp = require('child_process')
  const cwd = {cwd: path.resolve(base, 'fix-addon-addoff/addoff')}
  cp.execSync('node-gyp --target=v7.2.0 configure', cwd)
  cp.execSync('node-gyp --target=v7.2.0 build', cwd)

  testfix(t, {
    'index.js': hdr(`
      const log = console.log.bind(console)
      const isSjw = /sjw$/.test(process.version)
      const symswitch = 'NODE_' + (isSjw ? 'SUPPORT' : 'PRESERVE') + '_SYMLINKS'
      if(process.env[symswitch] !== '1') {
        log('Hey Now!! No Cheating! We Only Play With Real Bombs Around Here!!')
        log('Youn Need To Set ' + symswitch + '=1')
        process.exit(1)
      }
      log('YELLOW ALERT!! - fuse1 IGNITING!!\\n')
      var fuse1 = require('fuse1/addoff')
      log(fuse1.isLit())
      log('\\nRED ALERT!!    - fuse2 IGNITING!!')
      try {
        var fuse2 = require('fuse2/addoff')
        log('\\nBomb Disarmed -- Cancel Red Alert.')
        log('War Games Simulation Complete.')
        log('Have A Nice Day :)\\n')
        log(fuse2.isLit())
      }
      catch(err) {
        log('\\n***********************************')
        log('**********  !!BOOOOMB!!  **********')
        log('***********************************\\n')
        log('add-off didn\\'t make it... :(')
        log('here\\'s his epitaph, if it helps.. :(\\n')
        log(err.stack)
      }
    `),
    node_modules: {
      $fuse1: '../../fix-addon-addoff/addoff/build/Release',
      $fuse2: '../../fix-addon-addoff/addoff/build/Release'
    }
  })
})




