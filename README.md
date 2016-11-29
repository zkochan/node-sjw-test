# node-sjw-test
### Tests for node's _**Symlinks Just Work**_ [fork/branch]()
This tool was built specifically for testing and exercising a version of `node` that embraces `symlinks` from the ground up, to optimize the storage of `node` `modules`. It is intended to show those skeptical `symlinks` can ever work with `node`, that they may have formed an entirely unwarranted first impression.

### Results

 - _**`citgm`:**_ [v7.2.0](), [v7.2.0-sjw (off)](), [v7.2.0-sjw (on)]()
 - _**`Backwards Compatibility`:**_ [nix](), [win]()
 - _**`--preserve-symlinks Fixes`:**_ [nix](), [win]()
 - _**`adjacent.node_modules`:**_ [nix](), [win]()

### Process
A _**test**_ is simply a directory & file layout of a top-level `'/node_modules'` root structure with auto-generated modules, that output their dependency _**linking**_ and _**call**_ trees, over which a version of `node` is executed to generate the output. An example of a test spec:

```javascript
test('bc-descendancy', t => {
  testbc(t,

    mod('main_1', ['depA'], {
      node_modules: {
        depA: mod('depA@1.0.0', ['depB'], {
          node_modules: {
            depB: mod('depB@1.0.0')
          }
        })
      }
    }

  ))
})
```

...and its output...

```
node   : v7.2.0  NODE_PRESERVE_SYMLINKS = 0
date   : Sat, 26 Nov 2016 04:57:49 GMT
'$'    : 'C:\src\node-sjw-test\test\_layouts'
'_'    : '$\bc-descendancy'

require                    linked        ld/ksh  __dirname          realpath
-------------------------  ------------  ------  ----------- key -  --------
node '_\index.js'          [main_1]      LOADED  _\                 <-
 [main_1] <depA>           [depA@1.0.0]  LOADED  _\nm\depA          <-
   [depA@1.0.0] <depB>     [depB@1.0.0]  LOADED  _\nm\depA\nm\depB  <-

caller                     called        ()-cnt  __dirname          realpath
-------------------------  ------------  ------  ----------- key -  --------
node '_\index.js'()        [main_1]         1    _\                 <-
  [main_1] <depA>()        [depA@1.0.0]     1    _\nm\depA          <-
    [depA@1.0.0] <depB>()  [depB@1.0.0]     1    _\nm\depA\nm\depB  <-
```
```
Legend
--------------------------------------------------
[ver]  : module's name with version
<dep>  : alias used in require()
'nm'   : 'node_modules' abbreviation to save space
'key'  : Module._cache key to instance
```

Specifying a directory structure and content can also include symlinks and inline file content, like so:

```javascript
var spec = {
  realdir: {
    'main.js': 'console.log(\'Hello world\')'
  },
  $symdir: './realdir',
  $symfile: './symdir/main.js'
}
```

...and is used in certain tests to verify fixes operate correctly.

After a given run, the directory layout and all generated output is stored in the `test` subdirectory:


#### Identifying `node` versions and switches
 - `rel.off` v7.2.0 : NODE_PRESERVE_SYMLINKS = 0
 - `rel.on` v7.2.0 : NODE_PRESERVE_SYMLINKS = 1
 - `sjw.off` v7.2.0-sjw : NODE_SUPPORT_SYMLINKS = 0
 - `sjw.on` v7.2.0-sjw : NODE_SUPPORT_SYMLINKS = 1

#### Three categories of tests:

 - [bc]() - Backwards Compatibility
    - Shows that `sjw.off` and `sjw.on` behave identical to `rel.off` on non-symlinked directory structures, by first running tests on `rel.off`, then comparing output to that of `sjw.off` and `sjw.on`.
    - In the context of backwards compatibility, the assumption is made symlink support in the `rel` is broken, and therefore there's no need to test `sjw.on` against `rel.on` over symlinked structures.
 - [fix]() - `--preserve-symlinks` Fixes
    - Outputs from `sjw.on` are generated for review.
    - Output from `rel.on` is compared to `sjw.on` to show failure.
    - Tests faithfully reproduce:
       - memory bloat.
       - addon crashing.
       - multiple module instancing for individual physical modules multiply symlinked to.
    - Various combinations of symlinking of "main.js" path passed to `node` via command line:
      - Directory symlinks in request path.
      - Directory symlinks in target path
      - Absolute and Relative target paths
      - Execute permission on and off
 - [anm]() - `adjacent.node_modules` Demonstrations
    - Not actual 'tests', merely output generation for review.
    - Shows how `anm` is mechanically equivalent to and interoperable with `'module/node_modules'`.
    - Various uses cases using symlinks to machine stores, within flat structures, etc.

### Running the tests yourself

 - You will need to build the sjw fork/branch
 - `node-gyp` must be installed (and necessary build chains)
 - On Windows:
    - Must run with elevated permissions (required to create symlinks)
    - Execute [win-mk-jx-exec.cmd]() to configure '.js', '.jx', and their associations to mirror 'nix behavior
    - Recommend reviewing .cmd script to understand what it's changing
    - This is only to fully test behavior on Windows. In all practicality, nearly 0 Windows environments will be using file-symlinks meant to have 'execute permission", doubly linked to target '.js' files; Windows' CMD always follows a file-symlink before passing to executable, unlike 'nix, and 'execute' permission is not at the file level, but via PATHEXT evironment variable and ASSOC, FTYPE configuration.
 - Set `SJW_TEST_NODE_REL` env-var to absolute path of `rel` node executable (will default to PATH-located `node` if it's a non-sjw release version)
 - Set `SJW_TEST_NODE_SJW` env-var to absolute path of `sjw` node executable (will default to PATH-located `node` if it's a `sjw` version)
 - Use **npm run (bc | fix | anm)**
 - `test/_layouts` will contain created directory structures
 - `test/expect` and `test/results` will contain outputs, with extensions indicating version and configuration that generated the output.
 - Can optionally use `npm run <tstcat> -- --node-sjw` (or --node-rel), to set locations rather than `SJW_TEST_` env-vars