# Are Symlinks The Problem?
One day long ago, a version of `node` was released that purported to support symlinking of module directories. Its implementation was fundamentally flawed. It offered no way to turn the "support" off. And thus the ecosystem proclaimed symlinks to be "_**a very bad thing**_", best avoided in practice, choosing to believe they could never possibly work well with, let alone actually improve `node`.

### This simple [fork/branch](https://github.com/phestermcs/node/tree/v7.2.0-sjw) challenges that by:

 - Fixing three critical problems with `--preserve-symlinks`:
    - _**Memory Bloat**_
    - _**Add-on Crashing**_
    - And "The Fundamental Flaw": _**That it always converts "main.js" to its real path**_
 - Backward compatibly enhancing `node` so modules can be stored separately from the directory structures that dictate their dependency version resolutions, while keeping those version-specifying structures coupled to a given top-level `'/node_modules'` root. This seamlessly enables:
   - _**Machine level stores**_
   - _**Simplified single-machine, concurrent development of dependent modules**_
   - _**50x reduction in install times (after initial install)**_
   - _**A way out of symlink directory cycles**_

### These tests hopefully demolish any notion symlinks are the problem:

 - `citgm-all` v1.7.0 results from baselined v7.2.0 and v7.2.0-sjw are _**[equivalent](https://github.com/phestermcs/node-sjw-test/tree/master/results/citgm#bottom-line-citgm-all-v170-results-identical)**_.
 - Purpose built [testing tool](https://github.com/phestermcs/node-sjw-test#node-sjw-test) generates some 30 different layouts of regular and symlinked directory structures using inline and auto-generated modules, covering _**[backwards compatibility](https://github.com/phestermcs/node-sjw-test/tree/master/results/nix/bc)**_, _**[--preserve-symlinks fixes](https://github.com/phestermcs/node-sjw-test/tree/master/results/nix/fix)**_, _**[enhanced resolution](https://github.com/phestermcs/node-sjw-test/tree/master/results/nix/anm)**_.
 - The auto generated modules show _**link**_ and _**call**_ chains, detailed with module _**versions**_, _**aliases**_, _**__dirnames**_, _**realpaths**_, _**cache-keys**_, _**module loads vs references**_, and _**call-counts**_.
 - Test's ran against _**both versions of `node`**_, with _**symlink support on and off**_, on both _**windows and linux**_.

## Why
 - Eliminate need to copy modules all over the place all the time, because...
 - Developers tend to have 10's to 100's of _thousands_ of module instances (directories) on there machine.
 - Commonly shared modules from tooling, and framework and application layers, are often duplicated dozens of times.
 - Larger systems built by teams can require concurrent development on the same machine of interdependent application domain model and layer module-components.
 - Developers are often installing and re-installing modules for one reason or another.
    - New application-layer component development projects.
    - Feature & bug work on prior versions.
    - Open source contributions.
    - Test types that require re-installing modules on every run.
 - QA environments often test against different and evolving versions of applications.
 - Certain classes of load, smoke, and integration testing require re-installation of modules on every run.
 - Production environments can have physical trees identical to development, while using a localized tree store to completely isolate them from each other when necessary.



## How

 - `REL` is v7.2.0
 - [SJW](https://github.com/phestermcs/node/blob/a0d0b6ebf10e6afcd8ad1aa244d04f022bb16f39/src/node.cc#L4222-L4225) is v7.2.0-sjw. with magical _**S**ymlinks **J**ust **W**ork_ switch

### Broken From The Get-Go: _`main.js` Never Had A Chance!_
 - `REL`: Not just follows, but always _**converts**_ the "main.js" path passed on the `node` command line _**all the way down to its absolute "realpath"**_, before the program has even begun, regardless of `--preserve-symlinks` switch. This immediately removes the program from any symbolic path space, pretty much guaranteeing symlinks won't work like they'd be seen in a file system explorer, and how we'd all expect them to.

 - [SJW](https://github.com/phestermcs/node/blob/a0d0b6ebf10e6afcd8ad1aa244d04f022bb16f39/lib/module.js#L434-L471): Always _**preserves**_ the "main.js" path, except in one special case: when it's a file type symbolic link, _**AND**_   has execute permission (on windows, is in PATHEXT). In that one case, it simply follows the target of the file symlink, correctly resolving if it's relative, preserving all directory symlinks in its path. This difference in behavior is quintessential in allowing developers and tooling written in node to transparently work on top of symlinks, operating as of they don't exist; it's actually quite stunning `REL` ever shipped without this behavior.

### Memory Bloat & Add-on Crashing: _Be Gone!_
 - `REL`: Couples a module's `__dirname` with the `cache-key` used to internally cache its instance. When `__dirname` is a symlink, this results in multiple module instances being created and initialized for the same physical module. This is the singular cause of both memory bloat and add-on crashes.

 - [SJW](https://github.com/phestermcs/node/blob/a0d0b6ebf10e6afcd8ad1aa244d04f022bb16f39/lib/module.js#L478-L480): Decouples `__dirname` from the `cache-key`. `_dirname` is always the request path and can contain directory symlinks, while the `cache-key` is always the `realpath` ensuring only one module instance is ever created. The instance runs in the symbolic path space of the first request path that it was initialized with (relying on package managers doing their primary job of laying down correct trees), so `require()` resolutions work just like we'd all expect them to; as would be seen by a file system explorer.

### Machine Level Stores: _`adjacent.node_modules` To The Rescue!_
 - `REL`: In the context of a directory structure, which versions of dependencies get resolved for a given module depends entirely on where the module is physically used, i.e. in what `'/node_modules'` top-level roots it's used in, and consequently the resolved versions can vary from root to root. Yet those dependencies can only be physically represented in directory form through subdirectories of the modules themselves. This essentially prevents modules from being immutably stored at the machine level and symlinked to from wherever used, while still ensuring dependency versions deterministically resolve specific to top level `'/node_modules'` roots.

 - [SJW](https://github.com/phestermcs/node/blob/a0d0b6ebf10e6afcd8ad1aa244d04f022bb16f39/lib/module.js#L313-L315): With a simple, backwards compatible and interoperable enhancement of just [3 lines](https://github.com/phestermcs/node/blob/a0d0b6ebf10e6afcd8ad1aa244d04f022bb16f39/lib/module.js#L313-L315), the physical directory structure that dictates dependency resolution can now be completely decoupled from the physical location of the dependent and depending modules. This is accomplished by interleaving equivalently scoping _**adjacent**_ `'module.node_modules'` directories into the search list just after their companion `'module/node_modules'` _**subordinate**_ directories (simply changing the `'/'` to a `'.'`), giving hierarchical precedence to the latter. This decoupling also enables representing module dependency cycles without requiring cycles in a symlinked directory structure. It further simplifies using multiple stores, and various patterns of concurrent development of dependent modules on the same machine. All this while ensuring dependency versions are always resolved through, and specific to, a given top-level `'/node_modules'` root, regardless of where the modules themselves physically reside.

