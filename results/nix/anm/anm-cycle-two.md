### adjacent.node_modules - Cycle Two

#### Spec
```javascript
test('anm-cycle-two', t => {
  testsjw(t, mod('main_1', ['libX'], {
    // dep on lib X uses anc to resolve
    // but in the end, still same physical
    // mod as cycle-one
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
date   : Sat, 03 Dec 2016 19:28:38 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/anm-cycle-two'

require                  linked    ld/ksh  __dirname  realpath               
-----------------------  --------  ------  ---------  --------------- key -  
node '_/index.js'        [main_1]  LOADED  _/         <-                     
 [main_1] <libX>         [libX_1]  LOADED  _/nm/libX  $/anm-mstore-pub/libX  
   [libX_1] <libY>       [libY_1]  LOADED  _/nm/libY  $/anm-mstore-pub/libY  
     [libY_1] <libX>     [libX_1]    **    _/nm/libX  $/anm-mstore-pub/libX  

caller                   called    ()-cnt  __dirname  realpath               
-----------------------  --------  ------  ---------  --------------- key -  
node '_/index.js'()      [main_1]     1    _/         <-                     
  [main_1] <libX>()      [libX_1]     1    _/nm/libX  $/anm-mstore-pub/libX  
    [libX_1] <libY>()    [libY_1]     1    _/nm/libY  $/anm-mstore-pub/libY  
      [libY_1] <libX>()  [libX_1]    r*    _/nm/libX  $/anm-mstore-pub/libX  
```