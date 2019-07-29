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

import { ACCOUNTS_CREATE } from '../errors/accounts';

interface Options extends IOptions {
	interactive?: boolean;
	debug?: boolean;
	pwd?: string;
	out?: string;
}

export interface Arguments extends Args<Options> {
	options: Options;
}

export default function command(evmlc: Vorpal, session: Session): Command {
	const description = 'Creates an encrypted keypair locally';

	return evmlc
		.command('accounts create')
		.alias('a c')
		.description(description)
		.option('-i, --interactive', 'enter interactive mode')
		.option('-d, --debug', 'show debug output')
		.option('--pwd <file_path>', 'passphrase file path')
		.option('--out <output_path>', 'write keystore to output path')
		.types({
			string: ['pwd', 'out']
		})
		.action((args: Arguments) => execute(stage, args, session));
}

interface Answers {
	passphrase: string;
	verifyPassphrase: string;
}

export type Output = IStagedOutput<Arguments, V3JSONKeyStore, V3JSONKeyStore>;

export const stage: IStagingFunction<
	Arguments,
	V3JSONKeyStore,
	V3JSONKeyStore
> = async (args: Arguments, session: Session) => {
	const frames = new Frames<Arguments, V3JSONKeyStore, V3JSONKeyStore>(
		session,
		args
	);

	// args
	const { options } = args;

	// decontruct
	const { success, error, debug } = frames.staging();

	/** Command Execution */
	let passphrase: string = '';

	const interactive = options.interactive || session.interactive;
	const questions: inquirer.Questions<Answers> = [
		{
			message: 'Passphrase: ',
			name: 'passphrase',
			type: 'password'
		},
		{
			message: 'Re-enter passphrase: ',
			name: 'verifyPassphrase',
			type: 'password'
		}
	];

	if (interactive) {
		const answers = await inquirer.prompt<Answers>(questions);

		debug(`Passphrase received: ${answers.passphrase || 'null'}`);
		debug(
			`Verify passphrase received: ${answers.verifyPassphrase || 'null'}`
		);

		if (!(answers.passphrase && answers.verifyPassphrase)) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.PASS_FIELDS_BLANK,
					'Fields cannot be blank'
				)
			);
		}

		if (answers.passphrase !== answers.verifyPassphrase) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.PASS_DO_NOT_MATCH,
					'Passphrases do not match'
				)
			);
		}

		passphrase = answers.passphrase.trim();

		debug(`Passphrase set: ${passphrase}`);
	}

	if (!passphrase) {
		debug(`Passphrase file path: ${options.pwd || 'null'}`);

		if (!options.pwd) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.PWD_PATH_EMPTY,
					'No passphrase file path provided'
				)
			);
		}

		if (!Utils.exists(options.pwd)) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.PWD_PATH_NOT_FOUND,
					'Passphrase file path provided does not exist.'
				)
			);
		}

		if (Utils.isDirectory(options.pwd)) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.PWD_IS_DIR,
					'passphrase file path provided is a directory.'
				)
			);
		}

		passphrase = fs.readFileSync(options.pwd, 'utf8').trim();

		debug(`Passphrase read successfully: ${passphrase}`);
	}

	if (options.out) {
		debug(`Output path: ${options.out || 'null'}`);

		if (!Utils.exists(options.out)) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.OUT_PATH_NOT_FOUND,
					'Output path provided does not exist.'
				)
			);
		}

		if (!Utils.isDirectory(options.out)) {
			return Promise.reject(
				error(
					ACCOUNTS_CREATE.OUT_PATH_IS_NOT_DIR,
					'Output path provided is a not a directory.'
				)
			);
		}

		debug(`Output path verified: ${options.out}`);
	}

	debug(`Attempting to create account...`);

	const account: V3JSONKeyStore = await session.keystore.create(
		passphrase,
		options.out
	);

	debug(
		`Account creation successful: ${Utils.cleanAddress(account.address)}`
	);

	return Promise.resolve(success(account));
};
