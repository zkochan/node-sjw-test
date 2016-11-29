### adjacent.node_modules - Ancestory

#### Spec
```javascript
test('anm-ancestory', t => {
  testsjw(t, mod('main_1', ['int1'], {
    node_modules: {
      depC: mod('depC_1'),
      int1: mod(['int2']),
      'int1.node_modules': {
        int2: mod(['depA']),
        'int2.node_modules': {
          depA: mod('depA_1', ['depB', 'depC']),
        },
        depB: mod('depB_1')
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
'_'    : '$/anm-ancestory'

require                    linked    ld/ksh  __dirname                  realpath  
-------------------------  --------  ------  -------------------------  -- key -  
node '_/index.js'          [main_1]  LOADED  _/                         <-        
 [main_1] <int1>           [int1]    LOADED  _/nm/int1                  <-        
   [int1] <int2>           [int2]    LOADED  _/nm/int1.nm/int2          <-        
     [int2] <depA>         [depA_1]  LOADED  _/nm/int1.nm/int2.nm/depA  <-        
       [depA_1] <depB>     [depB_1]  LOADED  _/nm/int1.nm/depB          <-        
       [depA_1] <depC>     [depC_1]  LOADED  _/nm/depC                  <-        

caller                     called    ()-cnt  __dirname                  realpath  
-------------------------  --------  ------  -------------------------  -- key -  
node '_/index.js'()        [main_1]     1    _/                         <-        
  [main_1] <int1>()        [int1]       1    _/nm/int1                  <-        
    [int1] <int2>()        [int2]       1    _/nm/int1.nm/int2          <-        
      [int2] <depA>()      [depA_1]     1    _/nm/int1.nm/int2.nm/depA  <-        
        [depA_1] <depB>()  [depB_1]     1    _/nm/int1.nm/depB          <-        
        [depA_1] <depC>()  [depC_1]     1    _/nm/depC                  <-        
```