import log from 'npmlog';

import { IConfiguration } from 'evm-lite-datadir';
import { Args } from 'vorpal';

import Node from 'evm-lite-core';
import Datadir from 'evm-lite-datadir';
import Keystore from 'evm-lite-keystore';

import Session from './Session';

// default options for all commands
export interface IOptions {}

export type IArgs<T> = Args<T>;

abstract class Command<T = IArgs<IOptions>> {
	protected readonly config: IConfiguration;
	protected readonly datadir: Datadir<Keystore>;

	protected node?: Node<any>;

	constructor(protected readonly session: Session, public readonly args: T) {
		this.config = this.session.datadir.config;
		this.datadir = this.session.datadir;

		const style = {
			bg: '',
			bold: true
		};

		log.addLevel('debug', 5, style);
	}

	// runs the command
	public async run(): Promise<void> {
		const interactive = await this.init();

		try {
			if (this.session.interactive || interactive) {
				await this.interactive();
			}

			await this.check();

			return await this.exec();
		} catch (e) {
			let err: Error = e;

			if (typeof e !== 'object') {
				err = new Error(e);
			}

			log.error('evmlc', err.message);
		}
	}

	// prepare command execution
	protected abstract async init(): Promise<boolean>;

	// do interactive command execution
	protected abstract async interactive(): Promise<void>;

	// parse arguments of command here
	protected abstract async check(): Promise<void>;

	// execute command
	protected abstract async exec(): Promise<void>;

	protected debug(s: string) {
		log.debug('debug', s);
	}
}

export default Command;
