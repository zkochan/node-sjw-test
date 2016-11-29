### adjacent.node_modules - Adjacency

#### Spec
```javascript
test('anm-adjacency', t => {
  testsjw(t, mod('main_1', ['int'], {
    node_modules: {
      int: mod(['depA']),
      'int.node_modules': {
        depA: mod('depA_1', ['depB']),
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
'_'    : '$/anm-adjacency'

require                  linked    ld/ksh  __dirname         realpath  
-----------------------  --------  ------  ----------------  -- key -  
node '_/index.js'        [main_1]  LOADED  _/                <-        
 [main_1] <int>          [int]     LOADED  _/nm/int          <-        
   [int] <depA>          [depA_1]  LOADED  _/nm/int.nm/depA  <-        
     [depA_1] <depB>     [depB_1]  LOADED  _/nm/int.nm/depB  <-        

caller                   called    ()-cnt  __dirname         realpath  
-----------------------  --------  ------  ----------------  -- key -  
node '_/index.js'()      [main_1]     1    _/                <-        
  [main_1] <int>()       [int]        1    _/nm/int          <-        
    [int] <depA>()       [depA_1]     1    _/nm/int.nm/depA  <-        
      [depA_1] <depB>()  [depB_1]     1    _/nm/int.nm/depB  <-        
```