#!/usr/bin/env node
const program = require('commander');
const download = require('download');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;

const childProcessRunNPM = require('./src/childProcessUtil').childProcessRunNPM;

const dist = require('./src/distUtil').dist;

program
    .version(require('./package.json').version)
    .option('-v, --version', 'output the version number')
    .description('LOMS Development CLI')
    .parse(process.argv);

program
    .command('init')
    .description('setup project.')
    .action(() => {
        const downloadingStr = new Spinner('download nwjs client to local %s');
        downloadingStr.setSpinnerString(18);
        downloadingStr.start();

        const downloadPlatform = /^win/.test(process.platform) ? 'win' : 'osx';

        const downloadURL = `https://dl.nwjs.io/v0.30.1/nwjs-v0.30.1-${downloadPlatform}-x64.zip`;

        download(downloadURL, path.join(process.cwd()), {
            extract: true,
            headers: {accept: 'application/zip'}
        }).then(() => {
            downloadingStr.stop();
            console.log('Download finished!');

            childProcessRunNPM(['i'], process.cwd()).then((code) => {
                console.log(`Code: ${code}`);
                console.log('Install finished!');
                console.log('Project is ready for development!');
            }).catch(e => {
                console.log(`ERROR: ${e}`);
            });

        }).catch(error => {
            console.log('download error: ' + error);
        });
    });

program
    .command('run-dev')
    .description('debug game with web.')
    .action(() => {
        childProcessRunNPM(['run', 'dev'], process.cwd()).then((code) => {
            console.log(`Code: ${code}`);
        }).catch(e => {
            console.log(`ERROR: ${e}`);
        });
    });

program
    .command('run-client')
    .description('debug game with nwjs client.')
    .action(() => {
        const platform = /^win/.test(process.platform) ? 'win' : 'mac';

        childProcessRunNPM(['run', `start-${platform}`], process.cwd()).then((code) => {
            console.log(`Code: ${code}`);
        }).catch(e => {
            console.log(`ERROR: ${e}`);
        });
    });

program
    .command('run-server')
    .description('debug game server.')
    .action(() => {
        childProcessRunNPM(['run', 'server'], process.cwd()).then((code) => {
            console.log(`Code: ${code}`);
        }).catch(e => {
            console.log(`ERROR: ${e}`);
        });
    });

program
    .command('test')
    .description('run game unit tests.')
    .action(() => {
        childProcessRunNPM(['test'], process.cwd()).then((code) => {
            console.log(`Code: ${code}`);
        }).catch(e => {
            console.log(`ERROR: ${e}`);
        });
    });

program
    .command('dist')
    .description('distribute game.')
    .action(() => {
        childProcessRunNPM(['run', 'build-prod'], process.cwd()).then(() => {
            dist();
        }).catch(e => {
            console.log(`ERROR: ${e}`);
        });
    });

program.parse(process.argv);
