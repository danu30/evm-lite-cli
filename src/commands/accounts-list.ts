import Table from 'cli-table';
import Node from 'evm-lite-core';
import Vorpal from 'vorpal';

import color from '../core/color';
import Session from '../core/Session';

import Command, { IArgs, IOptions } from '../core/Command';

interface Opts extends IOptions {
	formatted?: boolean;
	remote?: boolean;
	host?: string;
	port?: number;
	exact?: boolean;
}

export interface Args extends IArgs<Opts> {
	options: Opts;
}

export default (evmlc: Vorpal, session: Session) => {
	const description = 'List all accounts in the local keystore directory';

	return evmlc
		.command('accounts list')
		.alias('a l')
		.description(description)
		.option('-f, --formatted', 'format output')
		.option('-h, --host <ip>', 'override config host value')
		.option('-p, --port <port>', 'override config port value')
		.option('-e, --exact', 'show exact balance')
		.types({
			string: ['h', 'host']
		})
		.action((args: Args) => new AccountListCommand(session, args).run());
};

class AccountListCommand extends Command<Args> {
	protected async init(): Promise<boolean> {
		this.args.options.host =
			this.args.options.host || this.config.connection.host;
		this.args.options.port =
			this.args.options.port || this.config.connection.port;

		this.args.options.formatted = this.args.options.formatted || false;

		return false;
	}

	protected async interactive(): Promise<void> {
		return;
	}

	protected async check(): Promise<void> {
		return;
	}

	protected async exec(): Promise<void> {
		this.debug('Does this work');
		const keystore = await this.session.datadir.listKeyfiles();

		let accounts: any = Object.keys(keystore).map(moniker => ({
			moniker,
			address: keystore[moniker].address,
			balance: 0,
			nonce: 0,
			bytecode: ''
		}));

		if (!accounts.length) {
			color.green('[]');
		}

		const node = new Node(this.args.options.host!, this.args.options.port);

		// check connection is valid
		let status: boolean = false;
		try {
			await node.getInfo();
			status = true;
		} catch (e) {
			status = false;
		}

		if (status) {
			const promises = accounts.map(async (acc: any) => {
				const base = await node.getAccount(acc.address);

				return {
					...base,
					moniker: acc.moniker
				};
			});

			accounts = await Promise.all(promises);
		}

		if (!this.args.options.formatted && !this.session.interactive) {
			return color.green(JSON.stringify(accounts));
		}

		const table = new Table({
			head: ['Moniker', 'Address', 'Balance', 'Nonce', 'Bytecode']
		});

		for (const a of accounts) {
			let balance = a.balance.format('T');

			if (!this.args.options.exact) {
				const l = balance.split('.');
				if (l[1]) {
					if (l[1].length > 4) {
						l[1] = l[1].slice(0, 4);

						balance = '~' + l.join('.') + 'T';
					}
				}
			}

			table.push([a.moniker, a.address, balance, a.nonce, a.bytecode]);
		}

		return color.green(table.toString());
	}
}
