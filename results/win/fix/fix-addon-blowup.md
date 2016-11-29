### Fixes - Addon Crashing

#### Spec
```javascript


test('fix-addon-blowup', t => {
  press('fix-addon-addoff', {
    'addoff': {
      'addoff.cc': `
      #include \x3cnode.h>

      namespace addoff {

      using v8::FunctionCallbackInfo;
      using v8::Isolate;
      using v8::Local;
      using v8::Object;
      using v8::String;
      using v8::Value;

      void Method(const FunctionCallbackInfo\x3cValue>& args) {
        static int callcount = 0;
        Isolate* isolate = args.GetIsolate();
        const char* message = callcount == 0
          ? "...add-off here... hey... i smell smoke..."
          : "...i'm still here... hmm... guess it was nothing...";
        args.GetReturnValue().Set(String::NewFromUtf8(isolate, message));
        ++callcount;
      }

      void LightBomb(Local\x3cObject> exports) {
        #define UNLIT 0
        #define LIT 1
        static int bomb = UNLIT;

        if (bomb == LIT)
          // os's LOVe this
          {*((int*)0) = 0;}

        if (bomb == UNLIT)
          // lets make things interesting, shall we?
          {bomb = LIT;}

        NODE_SET_METHOD(exports, "isLit", Method);
      }

      NODE_MODULE(addoff, LightBomb)

      }
      `,
      // node-gyp doesn't like this indented.. odd
      'binding.gyp': `
{
  "targets": [
    {
      "target_name": "addoff",
      "sources": [ "addoff.cc" ]
    }
  ]
}
`}})

  const cp = require('child_process')
  const cwd = {cwd: path.resolve(base, 'fix-addon-addoff/addoff')}
  cp.execSync('node-gyp --target=v7.2.0 configure', cwd)
  cp.execSync('node-gyp --target=v7.2.0 build', cwd)

  testfix(t, {
    'index.js': hdr(`
      const log = console.log.bind(console)
      const isSjw = /sjw$/.test(process.version)
      const symswitch = 'NODE_' + (isSjw ? 'SUPPORT' : 'PRESERVE') + '_SYMLINKS'
      if(process.env[symswitch] !== '1') {
        log('Hey Now!! No Cheating! We Only Play With Real Bombs Around Here!!')
        log('Youn Need To Set ' + symswitch + '=1')
        process.exit(1)
      }
      log('YELLOW ALERT!! - fuse1 IGNITING!!\\n')
      var fuse1 = require('fuse1/addoff')
      log(fuse1.isLit())
      log('\\nRED ALERT!!    - fuse2 IGNITING!!')
      try {
        var fuse2 = require('fuse2/addoff')
        log('\\nBomb Disarmed -- Cancel Red Alert.')
        log('War Games Simulation Complete.')
        log('Have A Nice Day :)\\n')
        log(fuse2.isLit())
      }
      catch(err) {
        log('\\n***********************************')
        log('**********  !!BOOOOMB!!  **********')
        log('***********************************\\n')
        log('add-off didn\\'t make it... :(')
        log('here\\'s his epitaph, if it helps.. :(\\n')
        log(err.stack)
      }
    `),
    node_modules: {
      $fuse1: '../../fix-addon-addoff/addoff/build/Release',
      $fuse2: '../../fix-addon-addoff/addoff/build/Release'
    }
  })
})

```

#### `sjw.on`
```
node     : v7.2.0-sjw  NODE_SUPPORT_SYMLINKS = 1
date     : Sat, 03 Dec 2016 17:27:37 GMT
base     : C:\src\node-sjw-test\test\_layouts
layout   : \fix-addon-blowup
dirname  : \
realpath : \

YELLOW ALERT!! - fuse1 IGNITING!!

...add-off here... hey... i smell smoke...

RED ALERT!!    - fuse2 IGNITING!!

Bomb Disarmed -- Cancel Red Alert.
War Games Simulation Complete.
Have A Nice Day :)

...i'm still here... hmm... guess it was nothing...
```

#### `rel.on`
```
node     : v7.2.0  NODE_PRESERVE_SYMLINKS = 1
date     : Sat, 03 Dec 2016 17:27:37 GMT
base     : C:\src\node-sjw-test\test\_layouts
layout   : \fix-addon-blowup
dirname  : \
realpath : \

YELLOW ALERT!! - fuse1 IGNITING!!

...add-off here... hey... i smell smoke...

RED ALERT!!    - fuse2 IGNITING!!

***********************************
**********  !!BOOOOMB!!  **********
***********************************

add-off didn't make it... :(
here's his epitaph, if it helps.. :(

Error: Module did not self-register.
    at Object.Module._extensions..node (module.js:598:18)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
    at Module.require (module.js:498:17)
    at require (internal/module.js:20:19)
    at C:\src\node-sjw-test\test\_layouts\fix-addon-blowup\index.js:30:21
    at Object.<anonymous> (C:\src\node-sjw-test\test\_layouts\fix-addon-blowup\index.js:45:7)
    at Module._compile (module.js:571:32)
    at Object.Module._extensions..js (module.js:580:10)
```

