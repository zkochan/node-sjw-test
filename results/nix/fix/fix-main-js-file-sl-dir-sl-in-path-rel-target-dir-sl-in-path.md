### Fixes - "main.js" - `symdir/sym-file.js -> ../symdir2/index.js`

#### Spec
```javascript
test('fix-main-js-file-sl-dir-sl-in-path-rel-target-dir-sl-in-path', t => {
  testfix(t, 'symbin/node_modules/main/index.js', {
    realdir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_WRONG')
          },
        })
      }
    },
    $symdir: './realdir',
    bin: {
      node_modules: {
        anc: mod('anc_1'),
        main: {
          '$index.js': '../../../symdir/node_modules/main/index.js',
          node_modules: {
            desc: mod('desc_1')
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
date   : Sat, 03 Dec 2016 19:46:08 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/fix-main-js-file-sl-dir-sl-in-path-rel-target-dir-sl-in-path'

require              linked    ld/ksh  __dirname                 realpath
-------------------  --------  ------  ------------------------  --------------- key -
node '_/index.js'    [main_1]  LOADED  _/symbin/nm/main          _/bin/nm/main
 [main_1] <anc>      [anc_1]   LOADED  _/symbin/nm/anc           _/bin/nm/anc
 [main_1] <desc>     [desc_1]  LOADED  _/symbin/nm/main/nm/desc  _/bin/nm/main/nm/desc

caller               called    ()-cnt  __dirname                 realpath
-------------------  --------  ------  ------------------------  --------------- key -
node '_/index.js'()  [main_1]     1    _/symbin/nm/main          _/bin/nm/main
  [main_1] <anc>()   [anc_1]      1    _/symbin/nm/anc           _/bin/nm/anc
  [main_1] <desc>()  [desc_1]     1    _/symbin/nm/main/nm/desc  _/bin/nm/main/nm/desc
```

#### `rel.on`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:46:08 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/fix-main-js-file-sl-dir-sl-in-path-rel-target-dir-sl-in-path'

require              linked        ld/ksh  __dirname                  realpath
-------------------  ------------  ------  ------------------- key -  --------
node '_/index.js'    [main_1]      LOADED  _/realdir/nm/main          <-
 [main_1] <anc>      [anc_WRONG]   LOADED  _/realdir/nm/anc           <-
 [main_1] <desc>     [desc_WRONG]  LOADED  _/realdir/nm/main/nm/desc  <-

caller               called        ()-cnt  __dirname                  realpath
-------------------  ------------  ------  ------------------- key -  --------
node '_/index.js'()  [main_1]         1    _/realdir/nm/main          <-
  [main_1] <anc>()   [anc_WRONG]      1    _/realdir/nm/anc           <-
  [main_1] <desc>()  [desc_WRONG]     1    _/realdir/nm/main/nm/desc  <-
```

