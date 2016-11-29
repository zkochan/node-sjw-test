### adjacent.node_modules - All Precedences

#### Spec
```javascript

test('anm-all-precedences', t => {
  testsjw(t, 'main', {
    main: mod('main_1', ['int1'], {
      node_modules: {
        int1: mod(['int2'], {
          node_modules: {
            int2: mod(['dscBc', 'dscAnm', 'adjBc', 'adjAnm', 'ancBc', 'ancAnm'], {
              node_modules: {
                dscBc: mod('dscBc_1')
              }
            }),
            'int2.node_modules': {
              dscAnm: mod('dscAnm_1'),

              dscBc: mod('dscBc_WRONG_1'),
            },
            adjBc: mod('adjBc_1'),

            dscBc: mod('dscBc_WRONG_2'),
            dscAnm: mod('dscAnm_WRONG_1')
          }
        }),
        'int1.node_modules': {
          adjAnm: mod('adjAnm_1'),

          adjBc: mod('adjBc_WRONG_1'),
          dscAnm: mod('dscAnm_WRONG_2'),
          dscBc: mod('dscBc_WRONG_3'),
        },
        ancBc: mod('ancBc_1'),

        adjAnm: mod('adjAnm_WRONG_1'),
        adjBc: mod('adjBc_WRONG_2'),
        dscAnm: mod('dscAnm_WRONG_3'),
        dscBc: mod('dscBc_WRONG_4'),
      }
    }),
    'main.node_modules': {
      ancAnm: mod('ancAnm_1'),

      ancBc: mod('ancBc_WRONG_1'),
      adjAnm: mod('adjAnm_WRONG_2'),
      adjBc: mod('adjBc_WRONG_3'),
      dscAnm: mod('dscAnm_WRONG_4'),
      dscBc: mod('dscBc_WRONG_5'),
    }
  })
})
```

#### `sjw.on`
```
node   : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date   : Sat, 03 Dec 2016 19:28:38 GMT
'$'    : '/home/phestermcs/src/node-sjw-test/test/_layouts'
'_'    : '$/anm-all-precedences'

require                  linked      ld/ksh  __dirname                         realpath  
-----------------------  ----------  ------  --------------------------------  -- key -  
node '_/index.js'        [main_1]    LOADED  _/main                            <-        
 [main_1] <int1>         [int1]      LOADED  _/main/nm/int1                    <-        
   [int1] <int2>         [int2]      LOADED  _/main/nm/int1/nm/int2            <-        
     [int2] <dscBc>      [dscBc_1]   LOADED  _/main/nm/int1/nm/int2/nm/dscBc   <-        
     [int2] <dscAnm>     [dscAnm_1]  LOADED  _/main/nm/int1/nm/int2.nm/dscAnm  <-        
     [int2] <adjBc>      [adjBc_1]   LOADED  _/main/nm/int1/nm/adjBc           <-        
     [int2] <adjAnm>     [adjAnm_1]  LOADED  _/main/nm/int1.nm/adjAnm          <-        
     [int2] <ancBc>      [ancBc_1]   LOADED  _/main/nm/ancBc                   <-        
     [int2] <ancAnm>     [ancAnm_1]  LOADED  _/main.nm/ancAnm                  <-        

caller                   called      ()-cnt  __dirname                         realpath  
-----------------------  ----------  ------  --------------------------------  -- key -  
node '_/index.js'()      [main_1]       1    _/main                            <-        
  [main_1] <int1>()      [int1]         1    _/main/nm/int1                    <-        
    [int1] <int2>()      [int2]         1    _/main/nm/int1/nm/int2            <-        
      [int2] <dscBc>()   [dscBc_1]      1    _/main/nm/int1/nm/int2/nm/dscBc   <-        
      [int2] <dscAnm>()  [dscAnm_1]     1    _/main/nm/int1/nm/int2.nm/dscAnm  <-        
      [int2] <adjBc>()   [adjBc_1]      1    _/main/nm/int1/nm/adjBc           <-        
      [int2] <adjAnm>()  [adjAnm_1]     1    _/main/nm/int1.nm/adjAnm          <-        
      [int2] <ancBc>()   [ancBc_1]      1    _/main/nm/ancBc                   <-        
      [int2] <ancAnm>()  [ancAnm_1]     1    _/main.nm/ancAnm                  <-        
```