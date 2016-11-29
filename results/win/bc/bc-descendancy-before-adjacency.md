### Backwards Compatibility - Adjacency

#### Spec
```javascript
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
```

#### `rel.off`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:10 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy-before-adjacency'

require                linked    ld/ksh  __dirname          realpath
---------------------  --------  ------  ----------- key -  --------
node '_\index.js'      [main_1]  LOADED  _\                 <-
 [main_1] <depA>       [depA_1]  LOADED  _\nm\depA          <-
   [depA_1] <depB>     [depB_1]  LOADED  _\nm\depA\nm\depB  <-

caller                 called    ()-cnt  __dirname          realpath
---------------------  --------  ------  ----------- key -  --------
node '_\index.js'()    [main_1]     1    _\                 <-
  [main_1] <depA>()    [depA_1]     1    _\nm\depA          <-
    [depA_1] <depB>()  [depB_1]     1    _\nm\depA\nm\depB  <-
```

#### `sjw.off`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:10 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy-before-adjacency'

require                linked    ld/ksh  __dirname          realpath
---------------------  --------  ------  -----------------  -- key -
node '_\index.js'      [main_1]  LOADED  _\                 <-
 [main_1] <depA>       [depA_1]  LOADED  _\nm\depA          <-
   [depA_1] <depB>     [depB_1]  LOADED  _\nm\depA\nm\depB  <-

caller                 called    ()-cnt  __dirname          realpath
---------------------  --------  ------  -----------------  -- key -
node '_\index.js'()    [main_1]     1    _\                 <-
  [main_1] <depA>()    [depA_1]     1    _\nm\depA          <-
    [depA_1] <depB>()  [depB_1]     1    _\nm\depA\nm\depB  <-
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:10 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy-before-adjacency'

require                linked    ld/ksh  __dirname          realpath
---------------------  --------  ------  -----------------  -- key -
node '_\index.js'      [main_1]  LOADED  _\                 <-
 [main_1] <depA>       [depA_1]  LOADED  _\nm\depA          <-
   [depA_1] <depB>     [depB_1]  LOADED  _\nm\depA\nm\depB  <-

caller                 called    ()-cnt  __dirname          realpath
---------------------  --------  ------  -----------------  -- key -
node '_\index.js'()    [main_1]     1    _\                 <-
  [main_1] <depA>()    [depA_1]     1    _\nm\depA          <-
    [depA_1] <depB>()  [depB_1]     1    _\nm\depA\nm\depB  <-
```