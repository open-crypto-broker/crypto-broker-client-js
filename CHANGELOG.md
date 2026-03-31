# Changelog

The list of commits in this changelog is automatically generated in the release process.
The commits follow the Conventional Commit specification.

## [0.2.0] - 2026-03-31

### 🚀 Features

- Added npmjs publish workflow (#48)
- Add nightly security scan (#44)
- Using tsdown to support CommonJS (#43)

### 🚜 Refactor

- Client harmonization (#46)
- Adjust npm version (#45)

### ⚙️ Miscellaneous Tasks

- Bump version to v0.2.0
- Bump version to v0.2.0-rc.0
- Update actions to latest versions for Node 24 support (#47)

## [0.1.1-rc.0] - 2026-03-11

### 🚀 Features

- Version bump (#39)
- Added npm action to publish to github packages (#33)
- Otel tracing (#31)
- Server benchmark (#30)
- Added gRPC retry policy via service config (#29)
- [**breaking**] Validity timestamps (#27)
- Added default unknown health status when server is not reachable (#26)
- Implementation of status requests (#24)

### 🐛 Bug Fixes

- Moved checkout to workflow (#42)
- Npm version bump (#41)
- Added app token to workflow (#40)
- Renamed health status method name (#25)

### 🚜 Refactor

- Changed socket path (#38)
- Adjust Task setup (#28)

### 📚 Documentation

- Added installation instructions for the npm package (#34)

### ⚡ Performance

- Updated retry config (#37)

### ⚙️ Miscellaneous Tasks

- Bump version to 0.1.1-rc.0
- Updates (#36)
- Protobuf ref updated (#32)

## [0.1.0] - 2025-12-02

### 🚀 Features

- Adjust workflow files and remove local config files (#21)
- Add git-cliff for changelog generation (#16)
- The deployment loop is now configurable via CLI arguments. (#10)
- Added retry mechanism for the client library (#9)
- Added CLI support to define subject through flag (#8)
- New md rules
- Added MD pipeline, small fix to node
- Add security file
- Code migration

### 🐛 Bug Fixes

- Cli commands are supplied separately (#19)
- Docker update and test app improvements (#14)
- Removed SN examples (#11)
- Added clean task to clean the transpiled files
- Added ci task to the README
- Added vulnerability check and ci tasks
- Updated the README to use the task command for Taskfile
- Added apt-get update to the tools task
- Added missing newlines
- Added missing newlines
- Addded test, lint and format wrapper tasks
- Updated the README to reflect the changes
- Updated the dist files and formatting
- Updated the dist files and formatting
- [**breaking**] Cli.js now using argparse, removed redundant checks
- [**breaking**] Updated packages, introduced Taskfile and relocated scripts
- Updated pre-commit to track only selected files
- Added the protobuf submodule
- Small changes to package
- Small fixes to Readme
- Added clean protobuf
- Deleted all submodules
- Modified submodules
- Added md rules
- Quick fix to security
- Small fix to Readme
- Small fix to reuse
- Small fixes to reuse
- Small fixes to reuse and security
- Minor fixes to Readme

### 🚜 Refactor

- Removed cli test app from lib (#23)
- Adjust sign certificate task for new CSR and CA cert (#20)
- Adjust build task (#18)
- Adjust signing command in taskfile to store certificate response (#15)
- Changed CLI signing parameters to be flags (#13)

### 📚 Documentation

- Added conventional commits section (#12)
