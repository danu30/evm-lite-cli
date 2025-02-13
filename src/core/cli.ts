import * as mkdir from 'mkdirp';

import figlet from 'figlet';

import Vorpal, { Command } from 'vorpal';

import chalk from 'chalk';
import Utils from 'evm-lite-utils';

import color from './color';
import Session from './Session';

// default commands
// import debug from '../commands/debug';
import clear from '../commands/clear';
import interactive from '../commands/interactive';

export type CommandFunction = (evmlc: Vorpal, session: Session) => Command;

export interface ICLIConfig {
	name: string;
	delimiter: string;

	// data directory path
	datadir: string;

	// config file name (usually application name)
	config: string;
}

export default async function init(params: ICLIConfig, commands: any) {
	commands.push(interactive, clear);

	if (!Utils.exists(params.datadir)) {
		mkdir.sync(params.datadir);
	}

	let dataDirPath = params.datadir;

	if (process.argv[2] === '--datadir' || process.argv[2] === '-d') {
		dataDirPath = process.argv[3];

		if (!Utils.exists(process.argv[3])) {
			color.yellow(
				'Data directory path provided does ' +
					'not exist and will created.'
			);
		}

		process.argv.splice(2, 2);
	}

	const session = new Session(dataDirPath, params.config);
	const cli = new Vorpal();

	if (!process.argv[2]) {
		cli.log(
			`\n  Change datadir by: ${params.delimiter} --datadir [path] [command]`
		);
		cli.log(`\n  Data Directory: ${session.datadir.path}`);

		process.argv[2] = 'help';
	}

	commands.forEach((command: CommandFunction) => {
		command(cli, session).option('--silent', 'silence all logging output');
	});

	if (process.argv[2] === 'interactive' || process.argv[2] === 'i') {
		cli.log(
			chalk.bold(
				figlet.textSync(params.name, {
					horizontalLayout: 'full'
				})
			)
		);

		color.yellow(` Mode:        Interactive`);
		color.blue(` Data Dir:    ${session.datadir.path}`);
		color.purple(` Config File: ${session.datadir.configPath}`);
		color.purple(` Keystore:    ${session.datadir.keystorePath}`);

		session.interactive = true;

		const cmdInteractive = cli.find('interactive');
		if (cmdInteractive) {
			cmdInteractive.remove();
		}

		await cli.exec('help');

		cli.delimiter(`${params.delimiter}$`).show();
	} else {
		const cmdClear = cli.find('clear');
		const cmdDebug = cli.find('debug');

		if (cmdClear) {
			cmdClear.remove();
		}

		if (cmdDebug) {
			cmdDebug.remove();
		}

		cli.parse(process.argv);
	}
}
