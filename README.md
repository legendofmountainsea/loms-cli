# loms-cli
LOMS Development CLI
![icon](https://raw.githubusercontent.com/SkyHarp/LegendOfMountainSea/master/LOMS.png)

## Installing
```
$ npm install loms-cli -g
```
Fork repository, create your branch from master and run CLI command-line at project's root directory
```
$ loms init
```
- Windows might get `node-gyp rebuild` error, open Powershell as admin and run
```
$ npm install -g windows-build-tools
```

## Getting started
**Run game on web browser without NW.js Client**
```
$ loms run-dev
```
**Run game on Windows or macOS with NW.js Client**
```
$ loms run-client
```

## Getting started Server
```
$ loms run-server
```

## Requirement
Node.js **version 9.2.0 or higher**

## License
GPL-2.0
