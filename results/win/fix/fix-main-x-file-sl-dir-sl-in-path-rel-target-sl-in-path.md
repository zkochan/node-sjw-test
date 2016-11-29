### Fixes - "mainx" - `symdir1/sym-x-file -> ../symdir2/index.js`

#### Spec
```javascript
const $mainx = process.platform === 'win32' ? '$main.jx' : '$main.jx:777'

test('fix-main-x-file-sl-dir-sl-in-path-rel-target-sl-in-path', t => {
  testfix(t, 'symbin/node_modules/int/main.jx', {
    main: {
      node_modules: {
        anc: mod('anc_WRONG_2'),
        mainmod: mod('main', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          }
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: '../../main/node_modules/mainmod'
      }
    },
    bin: {
      node_modules: {
        anc: mod('anc_WRONG_1'),
        int: {
          [$mainx]: '../../../realdir/node_modules/symdir/index.js',
          node_modules: {
            desc: mod('desc_WRONG_1')
          }
        }
      }
    },
    $symbin: './bin'
  })
})

```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sun, 04 Dec 2016 00:35:04 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\fix-main-x-file-sl-dir-sl-in-path-rel-target-sl-in-path'

require              linked    ld/ksh  __dirname                    realpath
-------------------  --------  ------  ---------------------------  ------------------- key -
node '_\index.js'    [main]    LOADED  _\realdir\nm\symdir          _\main\nm\mainmod
 [main] <anc>        [anc_1]   LOADED  _\realdir\nm\anc             <-
 [main] <desc>       [desc_1]  LOADED  _\realdir\nm\symdir\nm\desc  _\main\nm\mainmod\nm\desc

caller               called    ()-cnt  __dirname                    realpath
-------------------  --------  ------  ---------------------------  ------------------- key -
node '_\index.js'()  [main]       1    _\realdir\nm\symdir          _\main\nm\mainmod
  [main] <anc>()     [anc_1]      1    _\realdir\nm\anc             <-
  [main] <desc>()    [desc_1]     1    _\realdir\nm\symdir\nm\desc  _\main\nm\mainmod\nm\desc
```

#### `rel.on`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date   : Sun, 04 Dec 2016 00:35:04 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\fix-main-x-file-sl-dir-sl-in-path-rel-target-sl-in-path'

require              linked         ld/ksh  __dirname                  realpath
-------------------  -------------  ------  ------------------- key -  --------
node '_\index.js'    [main]         LOADED  _\main\nm\mainmod          <-
 [main] <anc>        [anc_WRONG_2]  LOADED  _\main\nm\anc              <-
 [main] <desc>       [desc_1]       LOADED  _\main\nm\mainmod\nm\desc  <-

caller               called         ()-cnt  __dirname                  realpath
-------------------  -------------  ------  ------------------- key -  --------
node '_\index.js'()  [main]            1    _\main\nm\mainmod          <-
  [main] <anc>()     [anc_WRONG_2]     1    _\main\nm\anc              <-
  [main] <desc>()    [desc_1]          1    _\main\nm\mainmod\nm\desc  <-
```

