### Backwards Compatibility - All Precedences

#### Spec
```javascript
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
```

#### `rel.off`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 0
date   : Sat, 03 Dec 2016 19:28:34 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/bc-all-precedences'

require                linked    ld/ksh  __dirname               realpath
---------------------  --------  ------  ---------------- key -  --------
node '_/index.js'      [main_1]  LOADED  _/                      <-
 [main_1] <int>        [int]     LOADED  _/nm/int                <-
   [int] <dep>         [dep_1]   LOADED  _/nm/int/nm/dep         <-
     [dep_1] <dsc>     [dsc_1]   LOADED  _/nm/int/nm/dep/nm/dsc  <-
     [dep_1] <adj>     [adj_1]   LOADED  _/nm/int/nm/adj         <-
     [dep_1] <anc>     [anc_1]   LOADED  _/nm/anc                <-

caller                 called    ()-cnt  __dirname               realpath
---------------------  --------  ------  ---------------- key -  --------
node '_/index.js'()    [main_1]     1    _/                      <-
  [main_1] <int>()     [int]        1    _/nm/int                <-
    [int] <dep>()      [dep_1]      1    _/nm/int/nm/dep         <-
      [dep_1] <dsc>()  [dsc_1]      1    _/nm/int/nm/dep/nm/dsc  <-
      [dep_1] <adj>()  [adj_1]      1    _/nm/int/nm/adj         <-
      [dep_1] <anc>()  [anc_1]      1    _/nm/anc                <-
```

#### `sjw.off`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 0
date   : Sat, 03 Dec 2016 19:28:34 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/bc-all-precedences'

require                linked    ld/ksh  __dirname               realpath
---------------------  --------  ------  ----------------------  -- key -
node '_/index.js'      [main_1]  LOADED  _/                      <-
 [main_1] <int>        [int]     LOADED  _/nm/int                <-
   [int] <dep>         [dep_1]   LOADED  _/nm/int/nm/dep         <-
     [dep_1] <dsc>     [dsc_1]   LOADED  _/nm/int/nm/dep/nm/dsc  <-
     [dep_1] <adj>     [adj_1]   LOADED  _/nm/int/nm/adj         <-
     [dep_1] <anc>     [anc_1]   LOADED  _/nm/anc                <-

caller                 called    ()-cnt  __dirname               realpath
---------------------  --------  ------  ----------------------  -- key -
node '_/index.js'()    [main_1]     1    _/                      <-
  [main_1] <int>()     [int]        1    _/nm/int                <-
    [int] <dep>()      [dep_1]      1    _/nm/int/nm/dep         <-
      [dep_1] <dsc>()  [dsc_1]      1    _/nm/int/nm/dep/nm/dsc  <-
      [dep_1] <adj>()  [adj_1]      1    _/nm/int/nm/adj         <-
      [dep_1] <anc>()  [anc_1]      1    _/nm/anc                <-
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:28:34 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/bc-all-precedences'

require                linked    ld/ksh  __dirname               realpath
---------------------  --------  ------  ----------------------  -- key -
node '_/index.js'      [main_1]  LOADED  _/                      <-
 [main_1] <int>        [int]     LOADED  _/nm/int                <-
   [int] <dep>         [dep_1]   LOADED  _/nm/int/nm/dep         <-
     [dep_1] <dsc>     [dsc_1]   LOADED  _/nm/int/nm/dep/nm/dsc  <-
     [dep_1] <adj>     [adj_1]   LOADED  _/nm/int/nm/adj         <-
     [dep_1] <anc>     [anc_1]   LOADED  _/nm/anc                <-

caller                 called    ()-cnt  __dirname               realpath
---------------------  --------  ------  ----------------------  -- key -
node '_/index.js'()    [main_1]     1    _/                      <-
  [main_1] <int>()     [int]        1    _/nm/int                <-
    [int] <dep>()      [dep_1]      1    _/nm/int/nm/dep         <-
      [dep_1] <dsc>()  [dsc_1]      1    _/nm/int/nm/dep/nm/dsc  <-
      [dep_1] <adj>()  [adj_1]      1    _/nm/int/nm/adj         <-
      [dep_1] <anc>()  [anc_1]      1    _/nm/anc                <-
```