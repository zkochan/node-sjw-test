### adjacent.node_modules - Flat Tree

#### Spec
```javascript
// lib = library     lodash, etc.
// fwk = framework   express, react, auth, etc. hori & vert(ao, middleware)
// shl = shell       app layer cmp container / svc provider
// cmp = component   app layer widget; express route, react.Component, etc.

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

test('anm-flat-tree-one', t => {
  testsjw(t, mod('main_1', ['cmpA'], {
    node_modules: {
      libA_2: {
        $libB: 'anm-mstore-pub/libB/v1',
        '$libB.node_modules': '../libB_1',
        $libC: 'anm-mstore-pub/libC/v1',
      },
      libB_1: {
        $libC: 'anm-mstore-pub/libC/v1',
      },
      fwkA_1: {
        $libA: 'anm-mstore-pub/libA/v2',
        '$libA.node_modules': '../libA_2',
        $libC: 'anm-mstore-pub/libC/v1',
        $fwkB: 'anm-mstore-pub/fwkB/v1',
        '$fwkB.node_modules': '../fwkB_1',
        $fwkC: 'anm-mstore-pub/fwkC/v1',
        '$fwkC.node_modules': '../fwkC_1'
      },
      fwkB_1: {
        $libB: 'anm-mstore-pub/libB/v1',
        '$libB.node_modules': '../libB_1',
        $libC: 'anm-mstore-pub/libC/v1',
        $fwkC: 'anm-mstore-pub/fwkC/v1',
        '$fwkC.node_modules': '../fwkC_1'
      },
      fwkC_1: {
        $libC: 'anm-mstore-pub/libC/v1'
      },
      shl_1: {
        $libA: 'anm-mstore-pub/libA/v2',
        '$libA.node_modules': '../libA_2',
        $fwkA: 'anm-mstore-pub/fwkA/v1',
        '$fwkA.node_modules': '../fwkA_1',
        $fwkB: 'anm-mstore-pub/fwkB/v1',
        '$fwkB.node_modules': '../fwkB_1'
      },
      cmpA_1: {
        $shl: 'anm-mstore-ent/shl/v1',
        '$shl.node_modules': '../shl_1',

        $cmpB: 'anm-mstore-ent/cmpB/v1',
        // flat trees can have cycles
        '$cmpB.node_modules': '../cmpB_1',

        $cmpC: 'anm-mstore-ent/cmpC/v1',
        '$cmpC.node_modules': '../cmpC_1',
        $fwkC: 'anm-mstore-pub/fwkC/v1',
        '$fwkC.node_modules': '../fwkC_1',
        $libB: 'anm-mstore-pub/libB/v1',
        '$libB.node_modules': '../libB_1',
      },
      cmpB_1: {
        $shl: 'anm-mstore-ent/shl/v1',
        '$shl.node_modules': '../shl_1',

        $cmpA: 'anm-mstore-ent/cmpA/v1',
        // flat trees can have cycles,
        // but can always get out of them
        // a couple of ways.. just more
        // work
        '$cmpA.node_modules': '../cmpA_1',

        $fwkA: 'anm-mstore-pub/fwkA/v1',
        '$fwkA.node_modules': '../fwkA_1',
        $libA: 'anm-mstore-pub/libA/v2',
        '$libA.node_modules': '../libA_2',
      },
      cmpC_1: {
        $shl: 'anm-mstore-ent/shl/v1',
        '$shl.node_modules': '../shl_1',
        $libC: 'anm-mstore-pub/libC/v1',
      },
      $cmpA: 'anm-mstore-ent/cmpA/v1',
      '$cmpA.node_modules': './cmpA_1'
    }
  }))
})
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:28:38 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/anm-flat-tree-one'

require                          linked    ld/ksh  __dirname                                                 realpath                  
-------------------------------  --------  ------  --------------------------------------------------------  ------------------ key -  
node '_/index.js'                [main_1]  LOADED  _/                                                        <-                        
 [main_1] <cmpA>                 [cmpA_1]  LOADED  _/nm/cmpA                                                 $/anm-mstore-ent/cmpA/v1  
   [cmpA_1] <cmpB>               [cmpB_1]  LOADED  _/nm/cmpA.nm/cmpB                                         $/anm-mstore-ent/cmpB/v1  
     [cmpB_1] <cmpA>             [cmpA_1]    **    _/nm/cmpA                                                 $/anm-mstore-ent/cmpA/v1  
     [cmpB_1] <shl>              [shl_1]   LOADED  _/nm/cmpA.nm/cmpB.nm/shl                                  $/anm-mstore-ent/shl/v1   
       [shl_1] <fwkA>            [fwkA_1]  LOADED  _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA                          $/anm-mstore-pub/fwkA/v1  
         [fwkA_1] <libA>         [libA_2]  LOADED  _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
           [libA_2] <libB>       [libB_1]  LOADED  _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
             [libB_1] <libC>     [libC_1]  LOADED  _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
           [libA_2] <libC>       [libC_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
         [fwkA_1] <libC>         [libC_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
         [fwkA_1] <fwkB>         [fwkB_1]  LOADED  _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
           [fwkB_1] <libB>       [libB_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
           [fwkB_1] <fwkC>       [fwkC_1]  LOADED  _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
             [fwkC_1] <libC>     [libC_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
         [fwkA_1] <fwkC>         [fwkC_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
       [shl_1] <fwkB>            [fwkB_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
       [shl_1] <libA>            [libA_2]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
     [cmpB_1] <fwkA>             [fwkA_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA                          $/anm-mstore-pub/fwkA/v1  
     [cmpB_1] <libA>             [libA_2]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
   [cmpA_1] <cmpC>               [cmpC_1]  LOADED  _/nm/cmpA.nm/cmpC                                         $/anm-mstore-ent/cmpC/v1  
     [cmpC_1] <shl>              [shl_1]     **    _/nm/cmpA.nm/cmpB.nm/shl                                  $/anm-mstore-ent/shl/v1   
     [cmpC_1] <libC>             [libC_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
   [cmpA_1] <shl>                [shl_1]     **    _/nm/cmpA.nm/cmpB.nm/shl                                  $/anm-mstore-ent/shl/v1   
   [cmpA_1] <fwkC>               [fwkC_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
   [cmpA_1] <libB>               [libB_1]    **    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  

caller                           called    ()-cnt  __dirname                                                 realpath                  
-------------------------------  --------  ------  --------------------------------------------------------  ------------------ key -  
node '_/index.js'()              [main_1]     1    _/                                                        <-                        
  [main_1] <cmpA>()              [cmpA_1]     1    _/nm/cmpA                                                 $/anm-mstore-ent/cmpA/v1  
    [cmpA_1] <cmpB>()            [cmpB_1]     1    _/nm/cmpA.nm/cmpB                                         $/anm-mstore-ent/cmpB/v1  
      [cmpB_1] <cmpA>()          [cmpA_1]    r*    _/nm/cmpA                                                 $/anm-mstore-ent/cmpA/v1  
      [cmpB_1] <shl>()           [shl_1]      1    _/nm/cmpA.nm/cmpB.nm/shl                                  $/anm-mstore-ent/shl/v1   
        [shl_1] <fwkA>()         [fwkA_1]     1    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA                          $/anm-mstore-pub/fwkA/v1  
          [fwkA_1] <libA>()      [libA_2]     1    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
            [libA_2] <libB>()    [libB_1]     1    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
              [libB_1] <libC>()  [libC_1]     1    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
            [libA_2] <libC>()    [libC_1]     2    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkA_1] <libC>()      [libC_1]     3    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkA_1] <fwkB>()      [fwkB_1]     1    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
            [fwkB_1] <libB>()    [libB_1]     2    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
              [libB_1] <libC>()  [libC_1]     4    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
            [fwkB_1] <fwkC>()    [fwkC_1]     1    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
              [fwkC_1] <libC>()  [libC_1]     5    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkA_1] <fwkC>()      [fwkC_1]     2    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
            [fwkC_1] <libC>()    [libC_1]     6    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [shl_1] <fwkB>()         [fwkB_1]     2    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
          [fwkB_1] <libB>()      [libB_1]     3    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]     7    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkB_1] <fwkC>()      [fwkC_1]     3    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
            [fwkC_1] <libC>()    [libC_1]     8    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [shl_1] <libA>()         [libA_2]     2    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
          [libA_2] <libB>()      [libB_1]     4    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]     9    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [libA_2] <libC>()      [libC_1]    10    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
      [cmpB_1] <fwkA>()          [fwkA_1]     2    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA                          $/anm-mstore-pub/fwkA/v1  
        [fwkA_1] <libA>()        [libA_2]     3    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
          [libA_2] <libB>()      [libB_1]     5    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]    11    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [libA_2] <libC>()      [libC_1]    12    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkA_1] <libC>()        [libC_1]    13    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkA_1] <fwkB>()        [fwkB_1]     3    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
          [fwkB_1] <libB>()      [libB_1]     6    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]    14    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkB_1] <fwkC>()      [fwkC_1]     4    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
            [fwkC_1] <libC>()    [libC_1]    15    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkA_1] <fwkC>()        [fwkC_1]     5    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
          [fwkC_1] <libC>()      [libC_1]    16    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
      [cmpB_1] <libA>()          [libA_2]     4    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
        [libA_2] <libB>()        [libB_1]     7    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
          [libB_1] <libC>()      [libC_1]    17    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [libA_2] <libC>()        [libC_1]    18    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
    [cmpA_1] <cmpC>()            [cmpC_1]     1    _/nm/cmpA.nm/cmpC                                         $/anm-mstore-ent/cmpC/v1  
      [cmpC_1] <shl>()           [shl_1]      2    _/nm/cmpA.nm/cmpB.nm/shl                                  $/anm-mstore-ent/shl/v1   
        [shl_1] <fwkA>()         [fwkA_1]     3    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA                          $/anm-mstore-pub/fwkA/v1  
          [fwkA_1] <libA>()      [libA_2]     5    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
            [libA_2] <libB>()    [libB_1]     8    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
              [libB_1] <libC>()  [libC_1]    19    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
            [libA_2] <libC>()    [libC_1]    20    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkA_1] <libC>()      [libC_1]    21    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkA_1] <fwkB>()      [fwkB_1]     4    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
            [fwkB_1] <libB>()    [libB_1]     9    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
              [libB_1] <libC>()  [libC_1]    22    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
            [fwkB_1] <fwkC>()    [fwkC_1]     6    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
              [fwkC_1] <libC>()  [libC_1]    23    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkA_1] <fwkC>()      [fwkC_1]     7    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
            [fwkC_1] <libC>()    [libC_1]    24    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [shl_1] <fwkB>()         [fwkB_1]     5    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
          [fwkB_1] <libB>()      [libB_1]    10    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]    25    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkB_1] <fwkC>()      [fwkC_1]     8    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
            [fwkC_1] <libC>()    [libC_1]    26    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [shl_1] <libA>()         [libA_2]     6    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
          [libA_2] <libB>()      [libB_1]    11    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]    27    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [libA_2] <libC>()      [libC_1]    28    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
      [cmpC_1] <libC>()          [libC_1]    29    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
    [cmpA_1] <shl>()             [shl_1]      3    _/nm/cmpA.nm/cmpB.nm/shl                                  $/anm-mstore-ent/shl/v1   
      [shl_1] <fwkA>()           [fwkA_1]     4    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA                          $/anm-mstore-pub/fwkA/v1  
        [fwkA_1] <libA>()        [libA_2]     7    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
          [libA_2] <libB>()      [libB_1]    12    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]    30    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [libA_2] <libC>()      [libC_1]    31    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkA_1] <libC>()        [libC_1]    32    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkA_1] <fwkB>()        [fwkB_1]     6    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
          [fwkB_1] <libB>()      [libB_1]    13    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
            [libB_1] <libC>()    [libC_1]    33    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
          [fwkB_1] <fwkC>()      [fwkC_1]     9    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
            [fwkC_1] <libC>()    [libC_1]    34    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkA_1] <fwkC>()        [fwkC_1]    10    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
          [fwkC_1] <libC>()      [libC_1]    35    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
      [shl_1] <fwkB>()           [fwkB_1]     7    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB                  $/anm-mstore-pub/fwkB/v1  
        [fwkB_1] <libB>()        [libB_1]    14    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
          [libB_1] <libC>()      [libC_1]    36    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [fwkB_1] <fwkC>()        [fwkC_1]    11    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
          [fwkC_1] <libC>()      [libC_1]    37    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
      [shl_1] <libA>()           [libA_2]     8    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA                  $/anm-mstore-pub/libA/v2  
        [libA_2] <libB>()        [libB_1]    15    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
          [libB_1] <libC>()      [libC_1]    38    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
        [libA_2] <libC>()        [libC_1]    39    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
    [cmpA_1] <fwkC>()            [fwkC_1]    12    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/fwkB.nm/fwkC          $/anm-mstore-pub/fwkC/v1  
      [fwkC_1] <libC>()          [libC_1]    40    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
    [cmpA_1] <libB>()            [libB_1]    16    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB          $/anm-mstore-pub/libB/v1  
      [libB_1] <libC>()          [libC_1]    41    _/nm/cmpA.nm/cmpB.nm/shl.nm/fwkA.nm/libA.nm/libB.nm/libC  $/anm-mstore-pub/libC/v1  
```