### Fixes - "main.js" - `sym-file.js -> ../index.js`

#### Spec
```javascript
test('fix-main-js-file-sl-rel-target', t => {
  testfix(t, 'maindir/node_modules/odd/index.js', {
    outsidedir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          }
        }),
      }
    },
    maindir: {
      node_modules: {
        anc: mod('anc_1'),
        odd: {
          '$index.js': '../../../outsidedir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
          }
        },
      }
    }
  })
})
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sun, 04 Dec 2016 00:34:58 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\fix-main-js-file-sl-rel-target'

require              linked    ld/ksh  __dirname                 realpath
-------------------  --------  ------  ------------------------  -- key -
node '_\index.js'    [main_1]  LOADED  _\maindir\nm\odd          <-
 [main_1] <anc>      [anc_1]   LOADED  _\maindir\nm\anc          <-
 [main_1] <desc>     [desc_1]  LOADED  _\maindir\nm\odd\nm\desc  <-

caller               called    ()-cnt  __dirname                 realpath
-------------------  --------  ------  ------------------------  -- key -
node '_\index.js'()  [main_1]     1    _\maindir\nm\odd          <-
  [main_1] <anc>()   [anc_1]      1    _\maindir\nm\anc          <-
  [main_1] <desc>()  [desc_1]     1    _\maindir\nm\odd\nm\desc  <-
```

#### `rel.on`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date   : Sun, 04 Dec 2016 00:34:58 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\fix-main-js-file-sl-rel-target'

require              linked        ld/ksh  __dirname                     realpath
-------------------  ------------  ------  ---------------------- key -  --------
node '_\index.js'    [main_1]      LOADED  _\outsidedir\nm\main          <-
 [main_1] <anc>      [anc_WRONG]   LOADED  _\outsidedir\nm\anc           <-
 [main_1] <desc>     [desc_WRONG]  LOADED  _\outsidedir\nm\main\nm\desc  <-

caller               called        ()-cnt  __dirname                     realpath
-------------------  ------------  ------  ---------------------- key -  --------
node '_\index.js'()  [main_1]         1    _\outsidedir\nm\main          <-
  [main_1] <anc>()   [anc_WRONG]      1    _\outsidedir\nm\anc           <-
  [main_1] <desc>()  [desc_WRONG]     1    _\outsidedir\nm\main\nm\desc  <-
```

