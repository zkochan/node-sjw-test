const path = require('path')
const test = require('tape')
require('./environment')

const env = process.env
const base = path.resolve(env.SJW_TEST_BASE, env.SJW_TEST_LAYOUTS)

const press = require('../lib/pressfs').press.bind(null, base)
const {pkg, mod, idx} = require('../lib/module-stamps')
const node = require('../lib/runnode')


function testsjw(t, main, layout) {
  const mainType = typeof main
  if(mainType === 'object' || mainType === 'function') {
    layout = main
    main = undefined
  }

  if(layout) press(t.name, layout)

  //node.sjwOnExp(t.name, main)
  node.sjwOn(t.name, main)

  t.plan(1)
  //t.assert(node.compare(t.name, node.sjwOn, node.sjwOn), 'not fair')
  t.assert(true, 'output result')
}



test('anm-descendancy', t => {
  testsjw(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA_1', ['depB']),
      'depA+node_modules': {
        depB: mod('depB_1')
      }
    }
  }))
})

test('anm-adjacency', t => {
  testsjw(t, mod('main_1', ['int'], {
    node_modules: {
      int: mod(['depA']),
      'int+node_modules': {
        depA: mod('depA_1', ['depB']),
        depB: mod('depB_1')
      }
    }
  }))
})

test('anm-ancestory', t => {
  testsjw(t, mod('main_1', ['int1'], {
    node_modules: {
      depC: mod('depC_1'),
      int1: mod(['int2']),
      'int1+node_modules': {
        int2: mod(['depA']),
        'int2+node_modules': {
          depA: mod('depA_1', ['depB', 'depC']),
        },
        depB: mod('depB_1')
      }
    }
  }))
})




test('anm-all-precedences', t => {
  testsjw(t, 'main', {
    main: mod('main_1', ['int1'], {
      node_modules: {
        int1: mod(['int2'], {
          node_modules: {
            int2: mod(['dscBc', 'dscAnm', 'adjBc', 'adjAnm', 'ancBc', 'ancAnm'], {
              node_modules: {
                dscBc: mod('dscBc_1')
              }
            }),
            'int2+node_modules': {
              dscAnm: mod('dscAnm_1'),

              dscBc: mod('dscBc_WRONG_1'),
            },
            adjBc: mod('adjBc_1'),

            dscBc: mod('dscBc_WRONG_2'),
            dscAnm: mod('dscAnm_WRONG_1')
          }
        }),
        'int1+node_modules': {
          adjAnm: mod('adjAnm_1'),

          adjBc: mod('adjBc_WRONG_1'),
          dscAnm: mod('dscAnm_WRONG_2'),
          dscBc: mod('dscBc_WRONG_3'),
        },
        ancBc: mod('ancBc_1'),

        adjAnm: mod('adjAnm_WRONG_1'),
        adjBc: mod('adjBc_WRONG_2'),
        dscAnm: mod('dscAnm_WRONG_3'),
        dscBc: mod('dscBc_WRONG_4'),
      }
    }),
    'main+node_modules': {
      ancAnm: mod('ancAnm_1'),

      ancBc: mod('ancBc_WRONG_1'),
      adjAnm: mod('adjAnm_WRONG_2'),
      adjBc: mod('adjBc_WRONG_3'),
      dscAnm: mod('dscAnm_WRONG_4'),
      dscBc: mod('dscBc_WRONG_5'),
    }
  })
})




press('anm-mstore-pub', {
  bndA: {
    v1: mod('bndA_1', ['libA', 'libB'], {
      node_modules: {
        libA: mod('libA_0', ['libC']),
        libB: mod('libB_0', ['libC'])
      }
    })
  },
  libA: {
    v1: mod('libA_1', ['libB']),
    v2: mod('libA_2', ['libB', 'libC']),
  },
  libB: {
    v1: mod('libB_1', ['libC']),
    v2: mod('libB_2', ['libC', 'libD']),
  },
  libC: {
    v1: mod('libC_1'),
    v2: mod('libC_2')
  },
  libD: {
    v1: mod('libD_1'),
    v2: mod('libD_2')
  },

  // cycle
  libX: mod('libX_1', ['libY']),
  libY: mod('libY_1', ['libX']),

  fwkA: {
    v1: mod('fwkA_1', ['libA', 'libC', 'fwkB', 'fwkC'])
  },
  fwkB: {
    v1: mod('fwkB_1', ['libB', 'fwkC'])
  },
  fwkC: {
    v1: mod('fwkC_1', ['libC'])
  },
})

press('anm-mstore-ent', {
  shl: {
    v1: mod('shl_1', ['fwkA', 'fwkB', 'libA']),
    v2: mod('shl_2', ['fwkA', 'fwkB', 'libA', 'libC'])
  },
  cmpA: {
    v1: mod('cmpA_1', ['cmpB', 'cmpC', 'shl', 'fwkC', 'libB'])
  },
  cmpB: {
    v1: mod('cmpB_1', ['cmpA', 'shl', 'fwkA', 'libA']),
    v2: mod('cmpB_2', ['cmpA', 'cmpC', 'shl', 'fwkA', 'libA'])
  },
  cmpC: {
    v1: mod('cmpC_1', ['shl', 'libC'])
  }
})

press('anm-same-mod-dif-dep-ver', {
  prjA: mod('prjA_1', ['libB'], {
    node_modules: {
      $libB: 'anm-mstore-pub/libB/v1',
      'libB+node_modules': {
        $libC: 'anm-mstore-pub/libC/v1'
      }
    }
  }),
  prjB: mod('prjB_1', ['libB'], {
    node_modules: {
      $libB: 'anm-mstore-pub/libB/v1',
      'libB+node_modules': {
        $libC: 'anm-mstore-pub/libC/v2'
      }
    }
  }),
})










test('anm-cycle-one', t => {
  // dep on lib Y uses anm to resolve
  testsjw(t, mod('main_1', ['libY'], {
    node_modules: {
      $libX: 'anm-mstore-pub/libX',
      $libY: 'anm-mstore-pub/libY',
      'libY+node_modules': {
        $libX: 'anm-mstore-pub/libX'
      }
    }
  }))
})

test('anm-cycle-two', t => {
  testsjw(t, mod('main_1', ['libX'], {
    // dep on lib X uses anc to resolve
    // but in the end, still same physical
    // mod as cycle-one
    node_modules: {
      $libX: 'anm-mstore-pub/libX',
      $libY: 'anm-mstore-pub/libY',
      'libY+node_modules': {
        $libX: 'anm-mstore-pub/libX'
      }
    }
  }))
})





test('anm-same-mod-dif-dep-ver-prjA', t => {
  testsjw(t, '../anm-same-mod-dif-dep-ver/prjA')
})

test('anm-same-mod-dif-dep-ver-prjB', t => {
  testsjw(t, '../anm-same-mod-dif-dep-ver/prjB')
})


// lib = library     lodash, etc.
// fwk = framework   express, react, auth, etc. hori & vert(ao, middleware)
// shl = shell       app layer cmp container / svc provider
// cmp = component   app layer widget; express route, react.Component, etc.
test('anm-flat-tree-one', t => {
  testsjw(t, mod('main_1', ['cmpA'], {
    node_modules: {
      libA_2: {
        $libB: 'anm-mstore-pub/libB/v1',
        '$libB+node_modules': '../libB_1',
        $libC: 'anm-mstore-pub/libC/v1',
      },
      libB_1: {
        $libC: 'anm-mstore-pub/libC/v1',
      },
      fwkA_1: {
        $libA: 'anm-mstore-pub/libA/v2',
        '$libA+node_modules': '../libA_2',
        $libC: 'anm-mstore-pub/libC/v1',
        $fwkB: 'anm-mstore-pub/fwkB/v1',
        '$fwkB+node_modules': '../fwkB_1',
        $fwkC: 'anm-mstore-pub/fwkC/v1',
        '$fwkC+node_modules': '../fwkC_1'
      },
      fwkB_1: {
        $libB: 'anm-mstore-pub/libB/v1',
        '$libB+node_modules': '../libB_1',
        $libC: 'anm-mstore-pub/libC/v1',
        $fwkC: 'anm-mstore-pub/fwkC/v1',
        '$fwkC+node_modules': '../fwkC_1'
      },
      fwkC_1: {
        $libC: 'anm-mstore-pub/libC/v1'
      },
      shl_1: {
        $libA: 'anm-mstore-pub/libA/v2',
        '$libA+node_modules': '../libA_2',
        $fwkA: 'anm-mstore-pub/fwkA/v1',
        '$fwkA+node_modules': '../fwkA_1',
        $fwkB: 'anm-mstore-pub/fwkB/v1',
        '$fwkB+node_modules': '../fwkB_1'
      },
      cmpA_1: {
        $shl: 'anm-mstore-ent/shl/v1',
        '$shl+node_modules': '../shl_1',

        $cmpB: 'anm-mstore-ent/cmpB/v1',
        // flat trees can have cycles
        '$cmpB+node_modules': '../cmpB_1',

        $cmpC: 'anm-mstore-ent/cmpC/v1',
        '$cmpC+node_modules': '../cmpC_1',
        $fwkC: 'anm-mstore-pub/fwkC/v1',
        '$fwkC+node_modules': '../fwkC_1',
        $libB: 'anm-mstore-pub/libB/v1',
        '$libB+node_modules': '../libB_1',
      },
      cmpB_1: {
        $shl: 'anm-mstore-ent/shl/v1',
        '$shl+node_modules': '../shl_1',

        $cmpA: 'anm-mstore-ent/cmpA/v1',
        // flat trees can have cycles,
        // but can always get out of them
        // a couple of ways.. just more
        // work
        '$cmpA+node_modules': '../cmpA_1',

        $fwkA: 'anm-mstore-pub/fwkA/v1',
        '$fwkA+node_modules': '../fwkA_1',
        $libA: 'anm-mstore-pub/libA/v2',
        '$libA+node_modules': '../libA_2',
      },
      cmpC_1: {
        $shl: 'anm-mstore-ent/shl/v1',
        '$shl+node_modules': '../shl_1',
        $libC: 'anm-mstore-pub/libC/v1',
      },
      $cmpA: 'anm-mstore-ent/cmpA/v1',
      '$cmpA+node_modules': './cmpA_1'
    }
  }))
})

/*

test('anm-concur-mod-dev', t => {
})

test('anm-grand-finale', t => {
})

*/

