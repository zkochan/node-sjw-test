### Fixes - Fun Memory Hug

#### Spec
```javascript
const memout = 'Math.round(process.memoryUsage().heapTotal / 1024).toLocaleString()'
const hogger = {
  'index.js': `
    require('hog')()
    console.log('heap = %s k', ${memout})
  `,
  node_modules: {
    $hog: '../../hog'
  }
}

test('fix-memhog-fun', t => {
  testfix(t, {
    'index.js': hdr(`
      console.log('heap = %s k', ${memout})
      require('hog1')
      require('hog2')
      require('hog3')
    `),
    node_modules: {
      hog: {
        'index.js': `
          const arr = []
          let callcount  = 0
          let i = 0
          while(i < 1024 * 100) arr[i++] = \`gobble \${i}\`
          module.exports = () => {
            if(callcount === 0) console.log('mmmmm.... memory... yummmm...')
            else if(callcount === 1) console.log('i\\'m pretty full.. thanks for asking though')
            else console.log('really.. i\\'m actually stuffed.. thanks anyways..')
            console.log()
            ++callcount
          }
        `
      },
      hog1: hogger,
      hog2: hogger,
      hog3: hogger,
    }
  }, line => !/^heap = /.test(line))
})
```

#### `sjw.on`
```
node     : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date     : Sat, 03 Dec 2016 19:46:09 GMT
base     : /home/phestermcs/src/node-sjw-test/test/_layouts
layout   : /fix-memhog-fun
dirname  : /
realpath : /

heap = 7,148 k
mmmmm.... memory... yummmm...

heap = 19,264 k
i'm pretty full.. thanks for asking though

heap = 19,264 k
really.. i'm actually stuffed.. thanks anyways..

heap = 19,264 k
```

#### `rel.on`
```
node     : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date     : Sat, 03 Dec 2016 19:46:09 GMT
base     : /home/phestermcs/src/node-sjw-test/test/_layouts
layout   : /fix-memhog-fun
dirname  : /
realpath : /

heap = 7,148 k
mmmmm.... memory... yummmm...

heap = 20,288 k
mmmmm.... memory... yummmm...

heap = 35,476 k
mmmmm.... memory... yummmm...

heap = 40,424 k
```

