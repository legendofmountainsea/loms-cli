#!/usr/bin/env node
const program = require('commander');
const clone = require('git-clone');
const path = require('path');

const Spinner = require('cli-spinner').Spinner;
const loadingStr = new Spinner('Clone LegendOfMountainSea to local %s');

program
	.version('0.0.2')
	.description('LOMS Development CLI');

program
	.command('init')
	.description('Setup project.')
	.action(function () {
		
		loadingStr.setSpinnerString(18);
		loadingStr.start();
		
		clone('https://github.com/SkyHarp/LegendOfMountainSea.git', path.join(process.cwd(), 'LegendOfMountainSea'),
			{checkout: 'master'},
			function () {
				loadingStr.stop();
				console.log('');
				console.log('Clone finished!');
				
			});
	});

program.parse(process.argv);
