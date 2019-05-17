import { BaseContractSchema, Transaction } from 'evm-lite-lib';

export const POA_BYTECODE =
	'608060405234801561001057600080fd5b50604051602080610cc98339810160405251610035338264010000000061004c810204565b610046640100000000610129810204565b50610220565b61005e82640100000000610200810204565b151561012557604080518082018252600160a060020a03848116808352600060208085018281528383529082905285822094518554600160a060020a0319169416939093178455915160019384015582548301909255915183927f1d48c1c80f973622ea182e7afdb4c88d758cb0ee74df1bf4dcba402816a624f091a360408051600080825260208201528151600192600160a060020a038616927fa23f78a07caf905f2fb70e67d2bf2c43d02fe4ab47489fbeefdfb7af008fe427929081900390910190a35b5050565b6101707312345678901234567890123456789012345678907f546f6d000000000000000000000000000000000000000000000000000000000064010000000061004c810204565b6101b77323456789012345678901234567890123456789017f4469636b0000000000000000000000000000000000000000000000000000000064010000000061004c810204565b6101fe7334567890123456789012345678901234567890127f486172727900000000000000000000000000000000000000000000000000000064010000000061004c810204565b565b600160a060020a0390811660009081526020819052604090205416151590565b610a9a8061022f6000396000f30060806040526004361061006c5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630eefa3ab81146100715780631a3e99451461009d578063372c12b1146100be578063d14abf1814610102578063eab10dd014610136575b600080fd5b34801561007d57600080fd5b5061008960043561014f565b604080519115158252519081900360200190f35b3480156100a957600080fd5b50610089600160a060020a03600435166101d8565b3480156100ca57600080fd5b506100df600160a060020a03600435166101fd565b60408051600160a060020a03909316835260208301919091528051918290030190f35b61011b600160a060020a03600435166024351515610222565b60408051921515835290151560208301528051918290030190f35b61014d600160a060020a03600435166024356104a0565b005b6040805160208082018490528251808303820181529183019283905281516000936101d29392909182918401908083835b6020831061019f5780518252601f199092019160209182019101610180565b5181516020939093036101000a6000190180199091169216919091179052604051920182900390912092506101d8915050565b92915050565b60006101e382610639565b806101d257506001541580156101d257506101d282610659565b60006020819052908152604090208054600190910154600160a060020a039091169082565b60008060008033600154600014156102895761023d81610659565b1515610281576040805160e560020a62461bcd02815260206004820152600e6024820152600080516020610a4f833981519152604482015290519081900360640190fd5b6102896106a4565b61029281610639565b15156102d6576040805160e560020a62461bcd02815260206004820152600e6024820152600080516020610a4f833981519152604482015290519081900360640190fd5b60009250600091506102e787610760565b1561047d57600160a060020a03878116600090815260026020908152604080832033845260040190915290205416156104785760408051808201825233808252881580156020808501918252600160a060020a038d811660009081526002835287812095815260049095019091529490922092518354925173ffffffffffffffffffffffffffffffffffffffff1990931694169390931774ff0000000000000000000000000000000000000000191674010000000000000000000000000000000000000000911515919091021790556103e257600160a060020a03871660009081526002602081905260409091200180546001019055610405565b600160a060020a0387166000908152600260205260409020600301805460010190555b600160a060020a03871660008181526002602081815260409283902091820154600390920154835192835290820152815189151593339390927f7d6cf66ed9df169483597e1721e4e5db5596ea6cd9a992cc6f563823bf2fd8ad929081900390910190a461047287610780565b90935091505b610482565b600192505b82156104945761049187610639565b91505b50909590945092505050565b3360015460001415610501576104b581610659565b15156104f9576040805160e560020a62461bcd02815260206004820152600e6024820152600080516020610a4f833981519152604482015290519081900360640190fd5b6105016106a4565b61050a81610639565b151561054e576040805160e560020a62461bcd02815260206004820152600e6024820152600080516020610a4f833981519152604482015290519081900360640190fd5b60408051608081018252600160a060020a038086168083523360208085018281526000868801818152606088018281528683526002948590528983209851895490891673ffffffffffffffffffffffffffffffffffffffff19918216178a55935160018a018054919099169416939093179096559451918601919091555160039094019390935592519192917f9c34c3e7380ed59c1755aadf34cc377bf803ef282f0dfcb52db0f2818f56f3709190a36040518290600160a060020a038516907f1d48c1c80f973622ea182e7afdb4c88d758cb0ee74df1bf4dcba402816a624f090600090a3505050565b600160a060020a0390811660009081526020819052604090205416151590565b6000731234567890123456789012345678901234567890600160a060020a03831614806101d2575050600160a060020a03167323456789012345678901234567890123456789011490565b6106e27312345678901234567890123456789012345678907f546f6d0000000000000000000000000000000000000000000000000000000000610880565b6107207323456789012345678901234567890123456789017f4469636b00000000000000000000000000000000000000000000000000000000610880565b61075e7334567890123456789012345678901234567890127f4861727279000000000000000000000000000000000000000000000000000000610880565b565b600160a060020a0390811660009081526002602052604090205416151590565b60008061078b610a27565b50600160a060020a03808416600090815260026020818152604080842081516080810183528154871681526001820154909616928601929092529181015491840191909152600301546060830181905281908110156107fb5782516107ef90610961565b5060019050600061081a565b60015460408401511061081a5782516108139061096d565b5060019050805b81156108755780151586600160a060020a03167fa23f78a07caf905f2fb70e67d2bf2c43d02fe4ab47489fbeefdfb7af008fe42785604001518660600151604051808381526020018281526020019250505060405180910390a35b909590945092505050565b61088982610639565b151561095d57604080518082018252600160a060020a0384811680835260006020808501828152838352908290528582209451855473ffffffffffffffffffffffffffffffffffffffff19169416939093178455915160019384015582548301909255915183927f1d48c1c80f973622ea182e7afdb4c88d758cb0ee74df1bf4dcba402816a624f091a360408051600080825260208201528151600192600160a060020a038616927fa23f78a07caf905f2fb70e67d2bf2c43d02fe4ab47489fbeefdfb7af008fe427929081900390910190a35b5050565b61096a816109da565b50565b61097681610639565b151561096157604080518082018252600160a060020a0383811680835260006020808501828152928252819052939093209151825473ffffffffffffffffffffffffffffffffffffffff19169116178155905160019182015580548101905561096a815b600160a060020a031660009081526002602081905260408220805473ffffffffffffffffffffffffffffffffffffffff199081168255600182018054909116905590810182905560030155565b6040805160808101825260008082526020820181905291810182905260608101919091529056004e6f7420617574686f7269736564000000000000000000000000000000000000a165627a7a7230582071fa12b1277fef9538741a41aa99ee3d412a71a7dacefdbcd57db1b2f17251370029';
export const POA_ABI =
	'[{"constant":true,"inputs":[{"name":"_publicKey","type":"bytes32"}],"name":"checkAuthorisedPublicKey","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"dev_isGenesisWhitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"dev_27","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"checkAuthorised","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whiteList","outputs":[{"name":"person","type":"address"},{"name":"flags","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dev_getSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dev_getWhitelistCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"isNominee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nomineeAddress","type":"address"},{"name":"_accepted","type":"bool"}],"name":"castNomineeVote","outputs":[{"name":"decided","type":"bool"},{"name":"voteresult","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"dev_getGenesisWhitelist0","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"dev_isWhitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"dev_getCurrentNomineeVotes","outputs":[{"name":"yes","type":"uint256"},{"name":"no","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nomineeAddress","type":"address"},{"name":"_moniker","type":"bytes32"}],"name":"submitNominee","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_moniker","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_nominee","type":"address"},{"indexed":false,"name":"_yesVotes","type":"uint256"},{"indexed":false,"name":"_noVotes","type":"uint256"},{"indexed":true,"name":"_accepted","type":"bool"}],"name":"NomineeDecision","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_nominee","type":"address"},{"indexed":true,"name":"_voter","type":"address"},{"indexed":false,"name":"_yesVotes","type":"uint256"},{"indexed":false,"name":"_noVotes","type":"uint256"},{"indexed":true,"name":"_accepted","type":"bool"}],"name":"NomineeVoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_nominee","type":"address"},{"indexed":true,"name":"_proposer","type":"address"}],"name":"NomineeProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":true,"name":"_moniker","type":"bytes32"}],"name":"MonikerAnnounce","type":"event"}]';
export interface POASchema extends BaseContractSchema {
	checkAuthorised(address: string): Transaction;
	submitNominee(address: string, moniker: string): Transaction;
	castNomineeVote(address: string, verdict: boolean): Transaction;
	isNominee(address: string): Transaction;
	dev_getCurrentNomineeVotes(address: string);
}

export const POA_ADDRESS: string = '0xabbaabbaabbaabbaabbaabbaabbaabbaabbaabba';
