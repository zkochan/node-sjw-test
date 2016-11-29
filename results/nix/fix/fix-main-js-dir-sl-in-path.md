### Fixes - "main.js" - `symdir/index.js`

#### Spec
```javascript
test('fix-main-js-dir-sl-in-path', t => {
  testfix(t, 'realdir/node_modules/symdir/main/index.js', {
    outsidedir: {
      node_modules: {
        anc: mod('anc_WRONG'),
        main: mod('main_1', ['anc', 'desc'], {
          node_modules: {
            desc: mod('desc_1')
          },
        })
      }
    },
    realdir: {
      node_modules: {
        anc: mod('anc_1'),
        $symdir: '../../outsidedir/node_modules/'
      }
    },
  })
})
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:46:08 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/fix-main-js-dir-sl-in-path'

require              linked    ld/ksh  __dirname                         realpath
-------------------  --------  ------  --------------------------------  ---------------------- key -
node '_/index.js'    [main_1]  LOADED  _/realdir/nm/symdir/main          _/outsidedir/nm/main
 [main_1] <anc>      [anc_1]   LOADED  _/realdir/nm/anc                  <-
 [main_1] <desc>     [desc_1]  LOADED  _/realdir/nm/symdir/main/nm/desc  _/outsidedir/nm/main/nm/desc

caller               called    ()-cnt  __dirname                         realpath
-------------------  --------  ------  --------------------------------  ---------------------- key -
node '_/index.js'()  [main_1]     1    _/realdir/nm/symdir/main          _/outsidedir/nm/main
  [main_1] <anc>()   [anc_1]      1    _/realdir/nm/anc                  <-
  [main_1] <desc>()  [desc_1]     1    _/realdir/nm/symdir/main/nm/desc  _/outsidedir/nm/main/nm/desc
```

#### `rel.on`
```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:46:08 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/fix-main-js-dir-sl-in-path'

require              linked       ld/ksh  __dirname                     realpath
-------------------  -----------  ------  ---------------------- key -  --------
node '_/index.js'    [main_1]     LOADED  _/outsidedir/nm/main          <-
 [main_1] <anc>      [anc_WRONG]  LOADED  _/outsidedir/nm/anc           <-
 [main_1] <desc>     [desc_1]     LOADED  _/outsidedir/nm/main/nm/desc  <-

caller               called       ()-cnt  __dirname                     realpath
-------------------  -----------  ------  ---------------------- key -  --------
node '_/index.js'()  [main_1]        1    _/outsidedir/nm/main          <-
  [main_1] <anc>()   [anc_WRONG]     1    _/outsidedir/nm/anc           <-
  [main_1] <desc>()  [desc_1]        1    _/outsidedir/nm/main/nm/desc  <-
```

