
const program = require('commander');
const download = require('download');

program
	.version('0.0.1')
	.command('init', 'Setup project.')
	.action(function(){
		download('https://github.com/SkyHarp/LegendOfMountainSea/archive/master.zip', process.cwd() + '/',{ extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' }});
	});

program.parse(process.argv);