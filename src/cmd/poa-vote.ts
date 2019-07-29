import * as fs from 'fs';
import * as inquirer from 'inquirer';

import Vorpal, { Command, Args } from 'vorpal';

import Utils from 'evm-lite-utils';

import { V3JSONKeyStore } from 'evm-lite-keystore';

import Session from '../Session';
import Frames, {
	execute,
	IStagingFunction,
	IOptions,
	IStagedOutput
} from '../frames';

import { TRANSACTION, EVM_LITE } from '../errors/generals';
import { POA_VOTE } from '../errors/poa';

interface Options extends IOptions {
	interactive?: boolean;
	verdict?: boolean;
	from?: string;
	pwd?: string;
	host?: string;
	port?: number;
}

export interface Arguments extends Args<Options> {
	options: Options;
	address?: string;
}

export default function command(monet: Vorpal, session: Session): Command {
	const description = 'Vote for an nominee currently in election';

	return monet
		.command('poa vote [address]')
		.alias('p v')
		.description(description)
		.option('-i, --interactive', 'interactive')
		.option('-d, --debug', 'show debug output')
		.option('--verdict <boolean>', 'verdict for given address')
		.option('--pwd <password>', 'passphrase file path')
		.option('--from <address>', 'from address')
		.option('-h, --host <ip>', 'override config host value')
		.option('-p, --port <port>', 'override config port value')
		.types({
			string: ['_', 'from', 'pwd', 'host', 'h']
		})
		.action(
			(args: Arguments): Promise<void> => execute(stage, args, session)
		);
}

interface Answers {
	from: string;
	address: string;
	passphrase: string;
	verdict: boolean;
}

interface NomineeEntry {
	address: string;
	moniker: string;
	upVotes: number;
	downVotes: number;
}

export type Output = IStagedOutput<Arguments, string, string>;

export const stage: IStagingFunction<Arguments, string, string> = async (
	args: Arguments,
	session: Session
) => {
	const frames = new Frames<Arguments, string, string>(session, args);

	// prepare
	const { options } = args;
	const { state } = session.config;

	// generate success, error, debug handlers
	const { debug, success, error } = frames.staging();

	// generate frames
	const { connect } = frames.generics();
	const { call, send } = frames.transaction();
	const { list, decrypt, get } = frames.keystore();
	const { contract: getContract } = frames.POA();

	/** Command Execution */
	let passphrase: string = '';

	const host = options.host || state.connection.host;
	const port = options.port || state.connection.port;

	const interactive = options.interactive || session.interactive;

	await connect(
		host,
		port
	);

	const contract = await getContract();
	const keystore: V3JSONKeyStore[] = await list();

	debug(`Attempting to generate nominee count transaction...`);

	const tx = contract.methods.getNomineeCount({
		gas: session.config.state.defaults.gas,
		gasPrice: session.config.state.defaults.gasPrice
	});

	let response: any = await call(tx);

	const nomineeCount = response.toNumber();
	debug(`Nominee Count: ${response}`);

	const nominees: NomineeEntry[] = [];

	debug(`Attempting to fetch nominee details...`);

	for (const i of Array.from(Array(nomineeCount).keys())) {
		const nominee: NomineeEntry = {
			address: '',
			moniker: '',
			upVotes: 0,
			downVotes: 0
		};

		const tx = contract.methods.getNomineeAddressFromIdx(
			{
				gas: session.config.state.defaults.gas,
				gasPrice: session.config.state.defaults.gasPrice
			},
			i
		);

		try {
			nominee.address = await session.node.callTransaction(tx);
		} catch (e) {
			return Promise.reject(error(EVM_LITE, e.text));
		}

		debug(`Received nominee address: ${nominee.address}`);

		const monikerTx = contract.methods.getMoniker(
			{
				gas: session.config.state.defaults.gas,
				gasPrice: session.config.state.defaults.gasPrice
			},
			nominee.address
		);

		let hex: string;

		try {
			hex = await session.node.callTransaction(monikerTx);
		} catch (e) {
			return Promise.reject(error(EVM_LITE, e.text));
		}

		nominee.moniker = Utils.hexToString(hex);

		debug(`Moniker received: ${nominee.moniker}`);

		const votesTransaction = contract.methods.getCurrentNomineeVotes(
			{
				from: session.config.state.defaults.from,
				gas: session.config.state.defaults.gas,
				gasPrice: session.config.state.defaults.gasPrice
			},
			Utils.cleanAddress(nominee.address)
		);

		let votes: [string, string];

		try {
			votes = await session.node.callTransaction<[string, string]>(
				votesTransaction
			);
		} catch (e) {
			return Promise.reject(error(EVM_LITE, e.text));
		}

		nominee.upVotes = parseInt(votes[0], 10);
		nominee.downVotes = parseInt(votes[1], 10);

		nominees.push(nominee);
	}

	if (!nominees.length) {
		return Promise.reject(
			error(POA_VOTE.NO_NOMINEES, 'No nominees to vote.')
		);
	}

	const questions: inquirer.Questions<Answers> = [
		{
			choices: keystore.map(keyfile => keyfile.address),
			message: 'From: ',
			name: 'from',
			type: 'list'
		},
		{
			message: 'Passphrase: ',
			name: 'passphrase',
			type: 'password'
		},
		{
			choices: nominees.map(nominee => nominee.address),
			message: 'Nominee: ',
			name: 'address',
			type: 'list'
		},
		{
			message: 'Verdict: ',
			name: 'verdict',
			type: 'confirm'
		}
	];

	if (interactive) {
		const { address, from, passphrase: p, verdict } = await inquirer.prompt<
			Answers
		>(questions);

		debug(`Nominee address: ${address || 'null'}`);
		debug(`From address: ${from || 'null'}`);
		debug(`Verdict: ${verdict ? 'Yes' : 'No'}`);

		debug(`Passphrase: ${p || 'null'}`);

		args.address = address;
		options.from = from;
		options.verdict = verdict;
		passphrase = p;
	}

	if (!args.address) {
		return Promise.reject(
			error(POA_VOTE.ADDRESS_EMPTY, 'No address provided to nominate.')
		);
	}

	if (!options.verdict) {
		return Promise.reject(
			error(POA_VOTE.VERDICT_EMPTY, 'No verdict provided for nominee.')
		);
	}

	args.address = Utils.trimHex(args.address);

	if (args.address.length !== 40) {
		return Promise.reject(
			error(
				POA_VOTE.ADDRESS_INVALID_LENGTH,
				'Address has an invalid length.'
			)
		);
	}

	debug(`Nominee address validated: ${args.address}`);

	const from = options.from || session.config.state.defaults.from;

	if (!from) {
		return Promise.reject(
			error(
				POA_VOTE.FROM_EMPTY,
				'No from address provided or set in config.'
			)
		);
	}

	if (from.length !== 40) {
		return Promise.reject(
			error(
				POA_VOTE.FROM_INVALID_LENGTH,
				'Address has an invalid length.'
			)
		);
	}

	debug(`From address validated: ${options.from}`);

	if (!passphrase) {
		debug(`Passphrase path: ${options.pwd || 'null'}`);

		if (!args.options.pwd) {
			return Promise.reject(
				error(
					POA_VOTE.PWD_PATH_EMPTY,
					'Passphrase file path not provided.'
				)
			);
		}

		if (!Utils.exists(args.options.pwd)) {
			return Promise.reject(
				error(
					POA_VOTE.PWD_PATH_NOT_FOUND,
					'Passphrase file path provided does not exist.'
				)
			);
		}

		if (Utils.isDirectory(args.options.pwd)) {
			return Promise.reject(
				error(
					POA_VOTE.PWD_IS_DIR,
					'Passphrase file path provided is a directory.'
				)
			);
		}

		passphrase = fs.readFileSync(args.options.pwd, 'utf8').trim();

		debug(`Passphrase read successfully: ${passphrase}`);
	}

	const keyfile = await get(from);
	const decrypted = await decrypt(keyfile, passphrase);

	debug(`Attempting to generate vote transaction...`);

	const transaction = contract.methods.castNomineeVote(
		{
			from,
			gas: session.config.state.defaults.gas,
			gasPrice: session.config.state.defaults.gasPrice
		},
		Utils.cleanAddress(args.address),
		options.verdict
	);

	const receipt = await send(transaction, decrypted);

	debug(JSON.stringify(receipt));

	if (!receipt.logs.length) {
		return Promise.reject(
			error(
				TRANSACTION.EMPTY_LOGS,
				'No logs were returned. ' +
					'Possibly due to lack of `gas` or may not be whitelisted.'
			)
		);
	}

	debug(`Received transaction logs and parsing...`);

	const nomineeVoteCastEvent = receipt.logs.filter(
		log => log.event === 'NomineeVoteCast'
	)[0];

	let nomineeDecisionLogs: any[] = [];
	let nomineeDecisionEvent;

	if (receipt.logs.length > 1) {
		nomineeDecisionLogs = receipt.logs.filter(
			log => log.event === 'NomineeVoteCast'
		);
	}

	if (nomineeDecisionLogs.length) {
		nomineeDecisionEvent = nomineeDecisionLogs[0];
	}

	const vote = nomineeVoteCastEvent.args._accepted ? 'Yes' : 'No';

	let message = `You (${
		nomineeVoteCastEvent.args._voter
	}) voted '${vote}' for '${nomineeVoteCastEvent.args._nominee}'. `;

	if (nomineeDecisionEvent) {
		const accepted = nomineeDecisionEvent.args._accepted
			? 'Accepted'
			: 'Rejected';

		message += `\nElection completed with the nominee being '${accepted}'.`;
	}

	return Promise.resolve(success(message));
};
