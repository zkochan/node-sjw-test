### adjacent.node_modules - Descendancy

#### Spec
```javascript
test('anm-descendancy', t => {
  testsjw(t, mod('main_1', ['depA'], {
    node_modules: {
      depA: mod('depA_1', ['depB']),
      'depA.node_modules': {
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
'_'    : '$/anm-descendancy'

require                linked    ld/ksh  __dirname          realpath  
---------------------  --------  ------  -----------------  -- key -  
node '_/index.js'      [main_1]  LOADED  _/                 <-        
 [main_1] <depA>       [depA_1]  LOADED  _/nm/depA          <-        
   [depA_1] <depB>     [depB_1]  LOADED  _/nm/depA.nm/depB  <-        

caller                 called    ()-cnt  __dirname          realpath  
---------------------  --------  ------  -----------------  -- key -  
node '_/index.js'()    [main_1]     1    _/                 <-        
  [main_1] <depA>()    [depA_1]     1    _/nm/depA          <-        
    [depA_1] <depB>()  [depB_1]     1    _/nm/depA.nm/depB  <-        
```