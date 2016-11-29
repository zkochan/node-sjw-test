### Backwards Compatibility - Descendancy

#### Spec
```javascript
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
```

#### `rel.off`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:08 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy'

require                    linked        ld/ksh  __dirname          realpath
-------------------------  ------------  ------  ----------- key -  --------
node '_\index.js'          [main_1]      LOADED  _\                 <-
 [main_1] <depA>           [depA@1.0.0]  LOADED  _\nm\depA          <-
   [depA@1.0.0] <depB>     [depB@1.0.0]  LOADED  _\nm\depA\nm\depB  <-

caller                     called        ()-cnt  __dirname          realpath
-------------------------  ------------  ------  ----------- key -  --------
node '_\index.js'()        [main_1]         1    _\                 <-
  [main_1] <depA>()        [depA@1.0.0]     1    _\nm\depA          <-
    [depA@1.0.0] <depB>()  [depB@1.0.0]     1    _\nm\depA\nm\depB  <-
```

#### `sjw.off`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:08 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy'

require                    linked        ld/ksh  __dirname          realpath
-------------------------  ------------  ------  -----------------  -- key -
node '_\index.js'          [main_1]      LOADED  _\                 <-
 [main_1] <depA>           [depA@1.0.0]  LOADED  _\nm\depA          <-
   [depA@1.0.0] <depB>     [depB@1.0.0]  LOADED  _\nm\depA\nm\depB  <-

caller                     called        ()-cnt  __dirname          realpath
-------------------------  ------------  ------  -----------------  -- key -
node '_\index.js'()        [main_1]         1    _\                 <-
  [main_1] <depA>()        [depA@1.0.0]     1    _\nm\depA          <-
    [depA@1.0.0] <depB>()  [depB@1.0.0]     1    _\nm\depA\nm\depB  <-
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:08 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy'

require                    linked        ld/ksh  __dirname          realpath
-------------------------  ------------  ------  -----------------  -- key -
node '_\index.js'          [main_1]      LOADED  _\                 <-
 [main_1] <depA>           [depA@1.0.0]  LOADED  _\nm\depA          <-
   [depA@1.0.0] <depB>     [depB@1.0.0]  LOADED  _\nm\depA\nm\depB  <-

caller                     called        ()-cnt  __dirname          realpath
-------------------------  ------------  ------  -----------------  -- key -
node '_\index.js'()        [main_1]         1    _\                 <-
  [main_1] <depA>()        [depA@1.0.0]     1    _\nm\depA          <-
    [depA@1.0.0] <depB>()  [depB@1.0.0]     1    _\nm\depA\nm\depB  <-
```