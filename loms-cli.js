#!/usr/bin/env node
const exec = require('child_process').exec;

const program = require('commander');
const clone = require('git-clone');
const download = require('download');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;

program
	.version('0.0.6')
	.description('LOMS Development CLI');

program
	.command('init')
	.description('Setup project.')
	.action(function () {
		
		const cloneLoadingStr = new Spinner('Clone LegendOfMountainSea to local %s');
		cloneLoadingStr.setSpinnerString(18);
		cloneLoadingStr.start();
		
		clone('https://github.com/SkyHarp/LegendOfMountainSea.git', path.join(process.cwd(), 'LegendOfMountainSea'),
			{checkout: 'master'},
			function () {
				cloneLoadingStr.stop();
				console.log(' Clone finished!');
				
				const downloadingStr = new Spinner('download nwjs client to local %s');
				downloadingStr.setSpinnerString(18);
				downloadingStr.start();
				
				let downloadURL = null;
				
				if(/^win/.test(process.platform)){
					downloadURL = 'https://dl.nwjs.io/v0.27.0/nwjs-v0.27.0-win-x64.zip';
				}else {
					downloadURL = 'https://dl.nwjs.io/v0.27.0/nwjs-v0.27.0-osx-x64.zip';
				}
				
				download(downloadURL, path.join(process.cwd(), path.join('LegendOfMountainSea','LOMS')),{ extract: true, headers: { accept: 'application/zip' } } ).then(() => {
					downloadingStr.stop();
					console.log(' download finished!');
					
					const initloadingStr = new Spinner('install project %s');
					initloadingStr.setSpinnerString(18);
					initloadingStr.start();
					
					exec('cd LegendOfMountainSea/LOMS && npm i && cd ../LOMS-Server && npm i', function(error, npmInitLog, npmError) {
						initloadingStr.stop();
						console.log('install finished!');
						
						console.log(npmInitLog, npmError);
						
						console.log('Project is ready for development!');
						
						if (error !== null) {
							console.log('exec error: ' + error);
						}
					});
				}).catch(error => {
					console.log('download error: ' + error);
				});
				
			});
	});

program.parse(process.argv);
