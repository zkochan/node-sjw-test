### adjacent.node_modules - Cycle One

#### Spec
```javascript
test('anm-cycle-one', t => {
  // dep on lib Y uses anm to resolve
  testsjw(t, mod('main_1', ['libY'], {
    node_modules: {
      $libX: 'anm-mstore-pub/libX',
      $libY: 'anm-mstore-pub/libY',
      'libY.node_modules': {
        $libX: 'anm-mstore-pub/libX'
      }
    }
  }))
})
```


#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 17:27:46 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\anm-cycle-one'

require                  linked    ld/ksh  __dirname          realpath
-----------------------  --------  ------  -----------------  --------------- key -
node '_\index.js'        [main_1]  LOADED  _\                 <-
 [main_1] <libY>         [libY_1]  LOADED  _\nm\libY          $\anm-mstore-pub\libY
   [libY_1] <libX>       [libX_1]  LOADED  _\nm\libY.nm\libX  $\anm-mstore-pub\libX
     [libX_1] <libY>     [libY_1]    **    _\nm\libY          $\anm-mstore-pub\libY

caller                   called    ()-cnt  __dirname          realpath
-----------------------  --------  ------  -----------------  --------------- key -
node '_\index.js'()      [main_1]     1    _\                 <-
  [main_1] <libY>()      [libY_1]     1    _\nm\libY          $\anm-mstore-pub\libY
    [libY_1] <libX>()    [libX_1]     1    _\nm\libY.nm\libX  $\anm-mstore-pub\libX
      [libX_1] <libY>()  [libY_1]    r*    _\nm\libY          $\anm-mstore-pub\libY
```