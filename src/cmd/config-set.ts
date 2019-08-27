import * as inquirer from 'inquirer';

import Vorpal, { Args, Command } from 'vorpal';

import { Solo } from 'evm-lite-consensus';

import Globals from '../Globals';
import Session from '../Session';
import Staging, { execute, IOptions } from '../staging';

interface Options extends IOptions {
	interactive?: boolean;
	host?: string;
	port?: number;
	from?: string;
	gas?: number;
	gasprice?: number;
}

export interface Arguments extends Args<Options> {}

export default (evmlc: Vorpal, session: Session<Solo>): Command => {
	const description =
		'Set values of the configuration inside the data directory';

	return evmlc
		.command('config set')
		.alias('c s')
		.description(description)
		.option('-i, --interactive', 'enter interactive mode')
		.option('-h, --host <host>', 'default host')
		.option('-p, --port <port>', 'default port')
		.option('--from <moniker>', 'default from moniker')
		.option('--gas <gas>', 'default gas')
		.option('--gasprice <gasprice>', 'gas price')
		.types({
			string: ['h', 'host', 'from']
		})
		.action(
			(args: Arguments): Promise<void> => execute(stage, args, session)
		);
};

interface Answers {
	host: string;
	port: number;
	from: string;
	gas: number;
	gasPrice: number;
}

export const stage = async (args: Arguments, session: Session<Solo>) => {
	const staging = new Staging<Arguments, string>(args);

	// prepare
	const { options } = args;
	const { success, debug } = staging.handlers(session.debug);

	// config
	const config = session.datadir.config;

	const { list } = staging.keystoreHooks(session);

	// command execution
	debug(`Successfully read configuration: ${session.datadir.configPath}`);

	const keystore = await list();

	const interactive = options.interactive || session.interactive;
	const questions: inquirer.Questions<Answers> = [
		{
			default: config.connection.host,
			message: 'Host',
			name: 'host',
			type: 'input'
		},
		{
			default: config.connection.port,
			message: 'Port',
			name: 'port',
			type: 'number'
		},
		{
			choices: Object.keys(keystore).map(moniker => moniker),
			default: config.defaults.from,
			message: 'From',
			name: 'from',
			type: 'list'
		},
		{
			default: config.defaults.gas,
			message: 'Gas',
			name: 'gas',
			type: 'number'
		},
		{
			default: config.defaults.gasPrice,
			message: 'Gas Price',
			name: 'gasPrice',
			type: 'number'
		}
	];

	if (interactive) {
		const answers = await inquirer.prompt<Answers>(questions);

		options.host = answers.host;
		options.port = answers.port;
		options.gas = answers.gas;
		options.gasprice = answers.gasPrice;
		options.from = answers.from;
	}

	const newConfig = {
		connection: {
			host: options.host || config.connection.host,
			port: options.port || config.connection.port
		},
		defaults: {
			from: options.from || config.defaults.from,
			gas:
				options.gas !== undefined && options.gas >= 0
					? options.gas
					: config.defaults.gas,
			gasPrice:
				options.gasprice !== undefined && options.gasprice >= 0
					? options.gasprice
					: config.defaults.gasPrice
		}
	};

	debug(`Attempting to write modified configuration...`);

	await session.datadir.saveConfig(newConfig);

	Globals.info(session.datadir.configToml);

	return Promise.resolve(success('Configuration saved'));
};
