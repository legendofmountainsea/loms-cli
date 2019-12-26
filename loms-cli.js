#!/usr/bin/env node
const program = require('commander');
const Spinner = require('cli-spinner').Spinner;

const downloadClientAndSDK = require('./src/clientDownloadUtil').downloadClientAndSDK;
const childProcessRunNPM = require('./src/childProcessUtil').childProcessRunNPM;
const dist = require('./src/distUtil').dist;
const rebuildNW = require('./src/rebuildUtil').rebuildNW;

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

        downloadClientAndSDK().then(()=>{
            downloadingStr.stop();
            console.log('Download finished!');

            childProcessRunNPM(['i'], process.cwd()).then(() => {

                rebuildNW().then(()=>{
                    console.log('Install finished!');
                    console.log('Project is ready for development!');
                }).catch(e => {
                    console.log(`Build native module error: ${e}`);
                });

            }).catch(e => {
                console.log(`Download error: ${e}`);
            });

        }).catch(e => {
            console.log(`Download error: ${e}`);
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
        const platform = null;
        switch (process.platform) {
            case 'win32':
                platform = 'win';
                break;
            case 'linux':
                platform = 'linux';
                break;
            default:
                platform = 'osx';
                break;
        }

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
        childProcessRunNPM(['run', 'build-prod'], process.cwd()).then(async () => {
            await dist();
        }).catch(e => {
            console.log(`ERROR: ${e}`);
        });
    });

program
    .command('rebuild')
    .description('rebuild nw native module.')
    .action(()=>{
	    console.log(`No native module needs rebuild!`);
        // rebuildNW().then(()=>{
        //     console.log(`Rebuild native module finished!`);
        // }).catch(e => {
        //     console.log(`Error: ${e}`);
        // });
    });

program.parse(process.argv);
