### adjacent.node_modules - Same Module Different Dependency Version

#### Spec
```javascript
press('anm-mstore-pub', {
  libB: {
    v1: mod('libB_1', ['libC']),
    v2: mod('libB_2', ['libC', 'libD']),
  },
  libC: {
    v1: mod('libC_1'),
    v2: mod('libC_2')
  },
})

press('anm-same-mod-dif-dep-ve', {
  prjA: mod('prjA_1', ['libB'], {
    node_modules: {
      $libB: 'anm-mstore-pub/libB/v1',
      'libB.node_modules': {
        $libC: 'anm-mstore-pub/libC/v1'
      }
    }
  }),
  prjB: mod('prjB_1', ['libB'], {
    node_modules: {
      $libB: 'anm-mstore-pub/libB/v1',
      'libB.node_modules': {
        $libC: 'anm-mstore-pub/libC/v2'
      }
    }
  }),
})

test('anm-same-mod-dif-dep-ver-prjA', t => {
  testsjw(t, '../anm-same-mod-dif-dep-ver/prjA')
})
```

##### `sjw.on` `prjA`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:28:38 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/anm-same-mod-dif-dep-ver'

require                linked    ld/ksh  __dirname               realpath                  
---------------------  --------  ------  ----------------------  ------------------ key -  
node '_/index.js'      [prjA_1]  LOADED  _/prjA                  <-                        
 [prjA_1] <libB>       [libB_1]  LOADED  _/prjA/nm/libB          $/anm-mstore-pub/libB/v1  
   [libB_1] <libC>     [libC_1]  LOADED  _/prjA/nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  

caller                 called    ()-cnt  __dirname               realpath                  
---------------------  --------  ------  ----------------------  ------------------ key -  
node '_/index.js'()    [prjA_1]     1    _/prjA                  <-                        
  [prjA_1] <libB>()    [libB_1]     1    _/prjA/nm/libB          $/anm-mstore-pub/libB/v1  
    [libB_1] <libC>()  [libC_1]     1    _/prjA/nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
```

##### `sjw.on` `prjB`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:28:38 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/anm-same-mod-dif-dep-ver'

require                linked    ld/ksh  __dirname               realpath
---------------------  --------  ------  ----------------------  ------------------ key -
node '_/index.js'      [prjB_1]  LOADED  _/prjB                  <-
 [prjB_1] <libB>       [libB_1]  LOADED  _/prjB/nm/libB          $/anm-mstore-pub/libB/v1
   [libB_1] <libC>     [libC_2]  LOADED  _/prjB/nm/libB.nm/libC  $/anm-mstore-pub/libC/v2

caller                 called    ()-cnt  __dirname               realpath
---------------------  --------  ------  ----------------------  ------------------ key -
node '_/index.js'()    [prjB_1]     1    _/prjB                  <-
  [prjB_1] <libB>()    [libB_1]     1    _/prjB/nm/libB          $/anm-mstore-pub/libB/v1
    [libB_1] <libC>()  [libC_2]     1    _/prjB/nm/libB.nm/libC  $/anm-mstore-pub/libC/v2
```