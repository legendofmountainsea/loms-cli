# loms-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/SkyHarp/loms-cli.svg)](https://greenkeeper.io/)

LOMS Development CLI
![icon](https://raw.githubusercontent.com/SkyHarp/LegendOfMountainSea/master/assets/LOMS.png)

## Installing
```
$ npm install loms-cli -g
```
- For Windows platform, please make sure you had installed windows-build-tools first
```
$  npm i -g --prodution --vs2015 --add-python-to-path windows-build-tools
``` 
## Usage
**Run game on web browser without NW.js Client**
```
$ loms run-dev
```
**Run game on Windows or macOS with NW.js Client**
```
$ loms run-client
```

**Run server**
```
$ loms run-server
```

**Run unit tests**
```
$ loms test
```

**Run release build process**
```
$ loms dist
```

## Requirement
Node.js **version 10.0.0 or higher**

## License
GPL-2.0
