### Backwards Compatibility - Adjacency

#### Spec
```javascript
test('bc-adjacency', t => {
  testbc(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA_1', ['depB']),
      depB: mod('depB_1')
    }
  }))
})
```

#### `rel.off`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:08 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-adjacency'

require                linked    ld/ksh  __dirname  realpath
---------------------  --------  ------  --- key -  --------
node '_\index.js'      [main_1]  LOADED  _\         <-
 [main_1] <depA>       [depA_1]  LOADED  _\nm\depA  <-
   [depA_1] <depB>     [depB_1]  LOADED  _\nm\depB  <-

caller                 called    ()-cnt  __dirname  realpath
---------------------  --------  ------  --- key -  --------
node '_\index.js'()    [main_1]     1    _\         <-
  [main_1] <depA>()    [depA_1]     1    _\nm\depA  <-
    [depA_1] <depB>()  [depB_1]     1    _\nm\depB  <-
```

#### `sjw.off`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:09 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-adjacency'

require                linked    ld/ksh  __dirname  realpath
---------------------  --------  ------  ---------  -- key -
node '_\index.js'      [main_1]  LOADED  _\         <-
 [main_1] <depA>       [depA_1]  LOADED  _\nm\depA  <-
   [depA_1] <depB>     [depB_1]  LOADED  _\nm\depB  <-

caller                 called    ()-cnt  __dirname  realpath
---------------------  --------  ------  ---------  -- key -
node '_\index.js'()    [main_1]     1    _\         <-
  [main_1] <depA>()    [depA_1]     1    _\nm\depA  <-
    [depA_1] <depB>()  [depB_1]     1    _\nm\depB  <-
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:09 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-adjacency'

require                linked    ld/ksh  __dirname  realpath
---------------------  --------  ------  ---------  -- key -
node '_\index.js'      [main_1]  LOADED  _\         <-
 [main_1] <depA>       [depA_1]  LOADED  _\nm\depA  <-
   [depA_1] <depB>     [depB_1]  LOADED  _\nm\depB  <-

caller                 called    ()-cnt  __dirname  realpath
---------------------  --------  ------  ---------  -- key -
node '_\index.js'()    [main_1]     1    _\         <-
  [main_1] <depA>()    [depA_1]     1    _\nm\depA  <-
    [depA_1] <depB>()  [depB_1]     1    _\nm\depB  <-
```