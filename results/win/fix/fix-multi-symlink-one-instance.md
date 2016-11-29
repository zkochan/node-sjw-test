### Fixes - Multiple Symlinks One Instance

#### Spec
```javascript
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
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:25 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\fix-multi-symlink-one-instance'

require                    linked       ld/ksh  __dirname                    realpath
-------------------------  -----------  ------  ---------------------------  ------------- key -
node '_\index.js'          [main_1]     LOADED  _\                           <-
 [main_1] <depA>           [depA_1]     LOADED  _\nm\depA                    <-
   [depA_1] <shr>          [shr_1]      LOADED  _\nm\depA\nm\shr             _\nm\shr
     [shr_1] <deepShr>     [deepShr_1]  LOADED  _\nm\depA\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
 [main_1] <depB>           [depB_1]     LOADED  _\nm\depB                    <-
   [depB_1] <shr>          [shr_1]        **    _\nm\depA\nm\shr             _\nm\shr
 [main_1] <depC>           [depC_1]     LOADED  _\nm\depC                    <-
   [depC_1] <shr>          [shr_1]        **    _\nm\depA\nm\shr             _\nm\shr

caller                     called       ()-cnt  __dirname                    realpath
-------------------------  -----------  ------  ---------------------------  ------------- key -
node '_\index.js'()        [main_1]        1    _\                           <-
  [main_1] <depA>()        [depA_1]        1    _\nm\depA                    <-
    [depA_1] <shr>()       [shr_1]         1    _\nm\depA\nm\shr             _\nm\shr
      [shr_1] <deepShr>()  [deepShr_1]     1    _\nm\depA\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
  [main_1] <depB>()        [depB_1]        1    _\nm\depB                    <-
    [depB_1] <shr>()       [shr_1]         2    _\nm\depA\nm\shr             _\nm\shr
      [shr_1] <deepShr>()  [deepShr_1]     2    _\nm\depA\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
  [main_1] <depC>()        [depC_1]        1    _\nm\depC                    <-
    [depC_1] <shr>()       [shr_1]         3    _\nm\depA\nm\shr             _\nm\shr
      [shr_1] <deepShr>()  [deepShr_1]     3    _\nm\depA\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
```

#### `rel.on`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:25 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\fix-multi-symlink-one-instance'

require                    linked       ld/ksh  __dirname                    realpath
-------------------------  -----------  ------  --------------------- key -  -------------------
node '_\index.js'          [main_1]     LOADED  _\                           <-
 [main_1] <depA>           [depA_1]     LOADED  _\nm\depA                    <-
   [depA_1] <shr>          [shr_1]      LOADED  _\nm\depA\nm\shr             _\nm\shr
     [shr_1] <deepShr>     [deepShr_1]  LOADED  _\nm\depA\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
 [main_1] <depB>           [depB_1]     LOADED  _\nm\depB                    <-
   [depB_1] <shr>          [shr_1]      LOADED  _\nm\depB\nm\shr             _\nm\shr
     [shr_1] <deepShr>     [deepShr_1]  LOADED  _\nm\depB\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
 [main_1] <depC>           [depC_1]     LOADED  _\nm\depC                    <-
   [depC_1] <shr>          [shr_1]      LOADED  _\nm\depC\nm\shr             _\nm\shr
     [shr_1] <deepShr>     [deepShr_1]  LOADED  _\nm\depC\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr

caller                     called       ()-cnt  __dirname                    realpath
-------------------------  -----------  ------  --------------------- key -  -------------------
node '_\index.js'()        [main_1]        1    _\                           <-
  [main_1] <depA>()        [depA_1]        1    _\nm\depA                    <-
    [depA_1] <shr>()       [shr_1]         1    _\nm\depA\nm\shr             _\nm\shr
      [shr_1] <deepShr>()  [deepShr_1]     1    _\nm\depA\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
  [main_1] <depB>()        [depB_1]        1    _\nm\depB                    <-
    [depB_1] <shr>()       [shr_1]         1    _\nm\depB\nm\shr             _\nm\shr
      [shr_1] <deepShr>()  [deepShr_1]     1    _\nm\depB\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
  [main_1] <depC>()        [depC_1]        1    _\nm\depC                    <-
    [depC_1] <shr>()       [shr_1]         1    _\nm\depC\nm\shr             _\nm\shr
      [shr_1] <deepShr>()  [deepShr_1]     1    _\nm\depC\nm\shr\nm\deepShr  _\nm\shr\nm\deepShr
```

