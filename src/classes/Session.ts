import * as nodepath from 'path';

import { EVMLC } from 'evm-lite-core';
import { DataDirectory } from 'evm-lite-datadir';
import { Keystore } from 'evm-lite-keystore';
import { ABI } from 'evm-lite-core/dist/typings/Contract';

export default class Session {
	public interactive: boolean = false;

	public node: EVMLC = new EVMLC('localhost', 8080);
	public directory: DataDirectory<Keystore>;

	constructor(path: string) {
		const keystore = new Keystore(nodepath.join(path, 'keystore'));

		this.directory = new DataDirectory(path);
		this.directory.setKeystore(keystore);
	}

	get keystore() {
		return this.directory.keystore!;
	}

	get config() {
		return this.directory.config;
	}

	public async getPOAContract(): Promise<{
		address: string;
		abi: ABI[];
	}> {
		if (process.env.DEBUG) {
			return {
				address: process.env.CONTRACT_ADDRESS,
				abi: JSON.parse(
					'[{"constant":true,"inputs":[{"name":"_publicKey","type":"bytes32"}],"name":"checkAuthorisedPublicKey","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"dev_isGenesisWhitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"dev_27","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"checkAuthorised","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nomineeAddress","type":"address"}],"name":"getNoVoteCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whiteList","outputs":[{"name":"person","type":"address"},{"name":"flags","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dev_getSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nomineeAddress","type":"address"},{"name":"_idx","type":"uint256"}],"name":"getYesVoterFromIdx","outputs":[{"name":"voter","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getNomineeElection","outputs":[{"name":"nominee","type":"address"},{"name":"proposer","type":"address"},{"name":"yesVotes","type":"uint256"},{"name":"noVotes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nomineeAddress","type":"address"},{"name":"_idx","type":"uint256"}],"name":"getNoVoterFromIdx","outputs":[{"name":"voter","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getNomineeElectionFromIdx","outputs":[{"name":"nominee","type":"address"},{"name":"proposer","type":"address"},{"name":"yesVotes","type":"uint256"},{"name":"noVotes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getWhiteListCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNomineeCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dev_getWhitelistCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getWhiteListAddressFromIdx","outputs":[{"name":"WhiteListAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getNomineeAddressFromIdx","outputs":[{"name":"NomineeAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nomineeAddress","type":"address"}],"name":"getYesVoteCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getMoniker","outputs":[{"name":"moniker","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nomineeAddress","type":"address"},{"name":"_accepted","type":"bool"}],"name":"castNomineeVote","outputs":[{"name":"decided","type":"bool"},{"name":"voteresult","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"dev_getGenesisWhitelist0","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"dev_isWhitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"dev_getCurrentNomineeVotes","outputs":[{"name":"yes","type":"uint256"},{"name":"no","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nomineeAddress","type":"address"},{"name":"_moniker","type":"bytes32"}],"name":"submitNominee","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_moniker","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_nominee","type":"address"},{"indexed":false,"name":"_yesVotes","type":"uint256"},{"indexed":false,"name":"_noVotes","type":"uint256"},{"indexed":true,"name":"_accepted","type":"bool"}],"name":"NomineeDecision","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_nominee","type":"address"},{"indexed":true,"name":"_voter","type":"address"},{"indexed":false,"name":"_yesVotes","type":"uint256"},{"indexed":false,"name":"_noVotes","type":"uint256"},{"indexed":true,"name":"_accepted","type":"bool"}],"name":"NomineeVoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_nominee","type":"address"},{"indexed":true,"name":"_proposer","type":"address"}],"name":"NomineeProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":true,"name":"_moniker","type":"bytes32"}],"name":"MonikerAnnounce","type":"event"}]'
				)
			};
		}

		return await this.node.getPOAContract();
	}

	public async connect(
		forcedHost?: string,
		forcedPort?: number
	): Promise<boolean> {
		const { state } = this.directory.config;

		const host: string = forcedHost || state.connection.host || '127.0.0.1';
		const port: number = forcedPort || state.connection.port || 8080;
		const node = new EVMLC(host, port);

		try {
			await node.getInfo();

			this.node = node;

			return Promise.resolve(true);
		} catch (e) {
			return Promise.reject(false);
		}
	}
}
