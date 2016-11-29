const path = require('path')
const test = require('tape')
require('./environment')

const env = process.env
const base = path.resolve(env.SJW_TEST_BASE, env.SJW_TEST_LAYOUTS)

const press = require('../lib/pressfs').press.bind(null, base)
const {pkg, mod, idx} = require('../lib/module-stamps')
const node = require('../lib/runnode')



function testbc(t, layout) {
  press(t.name, layout)

  t.plan(2)

  node.relOffExp(t.name)
  node.sjw(t.name)

  t.assert(node.compare(t.name, node.relOff, node.sjwOff), 'sjw off')
  t.assert(node.compare(t.name, node.relOff, node.sjwOn), 'sjw on')

  t.end()
}

test('bc-descendancy', t => {
  testbc(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA@1.0.0', ['depB'], {
        node_modules: {
          depB: mod('depB@1.0.0')
        }
      })
    }
  }))
})

test('bc-adjacency', t => {
  testbc(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA_1', ['depB']),
      depB: mod('depB_1')
    }
  }))
})

test('bc-ancestory', t => {
  testbc(t, mod('main_1', ['int'], {
    node_modules: {
      depA: mod('depA_1'),
      int: mod(['depB'], {
        node_modules: {
          depB: mod('depB_1', ['depC'], {
            node_modules: {
              depC: mod('depC_1', ['depA'])
            }
          })
        }
      })
    }
  }))
})

test('bc-descendancy-before-adjacency', t => {
  testbc(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA_1', ['depB'], {
        node_modules: {
          depB: mod('depB_1')
        }
      }),
      depB: mod('depB_WRONG')
    }
  }))
})

test('bc-adjacency-before-ancestory', t => {
  testbc(t, mod('main_1', ['int'], {
    node_modules: {
      depB: mod('depB_WRONG'),
      int: mod(['depA'], {
        node_modules: {
          depA: mod('depA_1', ['depB']),
          depB: mod('depB_1')
        }
      })
    }
  }))
})

test('bc-all-precedences', t => {
  testbc(t, mod('main_1', ['int'], {
    node_modules: {
      anc: mod('anc_1'),
      adj: mod('adj_WRONG_1'),
      dsc: mod('dsc_WRONG_2'),
      int: mod(['dep'], {
        node_modules: {
          adj: mod('adj_1'),
          dsc: mod('dsc_WRONG_1'),
          dep: mod('dep_1', ['dsc', 'adj', 'anc'], {
            node_modules: {
              dsc: mod('dsc_1')
            }
          })
        }
      })
    }
  }))
})

test('bc-cycle', t => {
  testbc(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA_1', ['depB']),
      depB: mod('depB_1', ['depA'])
    }
  }))
})

