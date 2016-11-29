### Backwards Compatibility - Ancestory

#### Spec
```javascript
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
```

#### `rel.off`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:09 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-ancestory'

require                    linked    ld/ksh  __dirname                 realpath
-------------------------  --------  ------  ------------------ key -  --------
node '_\index.js'          [main_1]  LOADED  _\                        <-
 [main_1] <int>            [int]     LOADED  _\nm\int                  <-
   [int] <depB>            [depB_1]  LOADED  _\nm\int\nm\depB          <-
     [depB_1] <depC>       [depC_1]  LOADED  _\nm\int\nm\depB\nm\depC  <-
       [depC_1] <depA>     [depA_1]  LOADED  _\nm\depA                 <-

caller                     called    ()-cnt  __dirname                 realpath
-------------------------  --------  ------  ------------------ key -  --------
node '_\index.js'()        [main_1]     1    _\                        <-
  [main_1] <int>()         [int]        1    _\nm\int                  <-
    [int] <depB>()         [depB_1]     1    _\nm\int\nm\depB          <-
      [depB_1] <depC>()    [depC_1]     1    _\nm\int\nm\depB\nm\depC  <-
        [depC_1] <depA>()  [depA_1]     1    _\nm\depA                 <-
```

#### `sjw.off`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 0
date   : Sat, 03 Dec 2016 17:27:10 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-ancestory'

require                    linked    ld/ksh  __dirname                 realpath
-------------------------  --------  ------  ------------------------  -- key -
node '_\index.js'          [main_1]  LOADED  _\                        <-
 [main_1] <int>            [int]     LOADED  _\nm\int                  <-
   [int] <depB>            [depB_1]  LOADED  _\nm\int\nm\depB          <-
     [depB_1] <depC>       [depC_1]  LOADED  _\nm\int\nm\depB\nm\depC  <-
       [depC_1] <depA>     [depA_1]  LOADED  _\nm\depA                 <-

caller                     called    ()-cnt  __dirname                 realpath
-------------------------  --------  ------  ------------------------  -- key -
node '_\index.js'()        [main_1]     1    _\                        <-
  [main_1] <int>()         [int]        1    _\nm\int                  <-
    [int] <depB>()         [depB_1]     1    _\nm\int\nm\depB          <-
      [depB_1] <depC>()    [depC_1]     1    _\nm\int\nm\depB\nm\depC  <-
        [depC_1] <depA>()  [depA_1]     1    _\nm\depA                 <-
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:09 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-ancestory'

require                    linked    ld/ksh  __dirname                 realpath
-------------------------  --------  ------  ------------------------  -- key -
node '_\index.js'          [main_1]  LOADED  _\                        <-
 [main_1] <int>            [int]     LOADED  _\nm\int                  <-
   [int] <depB>            [depB_1]  LOADED  _\nm\int\nm\depB          <-
     [depB_1] <depC>       [depC_1]  LOADED  _\nm\int\nm\depB\nm\depC  <-
       [depC_1] <depA>     [depA_1]  LOADED  _\nm\depA                 <-

caller                     called    ()-cnt  __dirname                 realpath
-------------------------  --------  ------  ------------------------  -- key -
node '_\index.js'()        [main_1]     1    _\                        <-
  [main_1] <int>()         [int]        1    _\nm\int                  <-
    [int] <depB>()         [depB_1]     1    _\nm\int\nm\depB          <-
      [depB_1] <depC>()    [depC_1]     1    _\nm\int\nm\depB\nm\depC  <-
        [depC_1] <depA>()  [depA_1]     1    _\nm\depA                 <-
```