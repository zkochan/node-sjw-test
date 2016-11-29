### Fixes - "mainx" - `sym-x-file -> ../symdir/index.js`

#### Spec
```javascript
const $mainx = process.platform === 'win32' ? '$main.jx' : '$main.jx:777'

test('fix-main-x-file-sl-rel-target-dir-sl-in-path', t => {
  testfix(t, 'bin/node_modules/int/main.jx', {
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
    }
  })
})
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:46:08 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/fix-main-x-file-sl-rel-target-dir-sl-in-path'

require              linked    ld/ksh  __dirname                    realpath
-------------------  --------  ------  ---------------------------  ------------------- key -
node '_/index.js'    [main]    LOADED  _/realdir/nm/symdir          _/main/nm/mainmod
 [main] <anc>        [anc_1]   LOADED  _/realdir/nm/anc             <-
 [main] <desc>       [desc_1]  LOADED  _/realdir/nm/symdir/nm/desc  _/main/nm/mainmod/nm/desc

caller               called    ()-cnt  __dirname                    realpath
-------------------  --------  ------  ---------------------------  ------------------- key -
node '_/index.js'()  [main]       1    _/realdir/nm/symdir          _/main/nm/mainmod
  [main] <anc>()     [anc_1]      1    _/realdir/nm/anc             <-
  [main] <desc>()    [desc_1]     1    _/realdir/nm/symdir/nm/desc  _/main/nm/mainmod/nm/desc
```

#### `rel.on`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:46:08 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/fix-main-x-file-sl-rel-target-dir-sl-in-path'

require              linked         ld/ksh  __dirname                  realpath
-------------------  -------------  ------  ------------------- key -  --------
node '_/index.js'    [main]         LOADED  _/main/nm/mainmod          <-
 [main] <anc>        [anc_WRONG_2]  LOADED  _/main/nm/anc              <-
 [main] <desc>       [desc_1]       LOADED  _/main/nm/mainmod/nm/desc  <-

caller               called         ()-cnt  __dirname                  realpath
-------------------  -------------  ------  ------------------- key -  --------
node '_/index.js'()  [main]            1    _/main/nm/mainmod          <-
  [main] <anc>()     [anc_WRONG_2]     1    _/main/nm/anc              <-
  [main] <desc>()    [desc_1]          1    _/main/nm/mainmod/nm/desc  <-
```

