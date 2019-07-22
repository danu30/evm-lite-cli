// Accounts Create Errors

export const ACCOUNTS_CREATE = {
	// Non-interactive
	PWD_PATH_EMPTY: '@error/accounts/CREATE/PWD_PATH_EMPTY',
	PWD_IS_DIR: '@error/accounts/CREATE/PWD_IS_DIR',
	PWD_PATH_NOT_FOUND: '@error/accounts/CREATE/PWD_PATH_NOT_FOUND',

	OUT_PATH_IS_NOT_DIR: '@error/accounts/CREATE/OUT_PATH_IS_NOT_DIR',
	OUT_PATH_NOT_FOUND: '@error/accounts/CREATE/OUT_PATH_NOT_FOUND',

	// Interactive
	PASS_FIELDS_BLANK: '@error/accounts/CREATE/PASS_FIELDS_BLANK',
	PASS_DO_NOT_MATCH: '@error/accounts/CREATE/PASS_DO_NOT_MATCH'
};

export const ACCOUNTS_GET = {
	ADDRESS_EMPTY: '@error/accounts/GET/ADDRESS_EMPTY',
	ADDRESS_INVALID_LENGTH: '@error/accounts/GET/ADDRESS_INVALID_LENGTH'
};

export const ACCOUNTS_UPDATE = {
	// Non-interactive
	ADDRESS_EMPTY: '@error/accounts/UPDATE/ADDRESS_EMPTY',
	ADDRESS_INVALID_LENGTH: '@error/accounts/UPDATE/ADDRESS_INVALID_LENGTH',

	OLD_PWD_NOT_FOUND: '@error/accounts/UPDATE/OLD_PWD_NOT_FOUND',
	OLD_PWD_IS_DIR: '@error/accounts/UPDATE/OLD_PWD_IS_DIR',
	OLD_PWD_EMPTY: '@error/accounts/UPDATE/OLD_PWD_EMPTY',

	NEW_PWD_NOT_FOUND: '@error/accounts/UPDATE/NEW_PWD_NOT_FOUND',
	NEW_PWD_IS_DIR: '@error/accounts/UPDATE/NEW_PWD_IS_DIR',
	NEW_PWD_EMPTY: '@error/accounts/UPDATE/NEW_PWD_EMPTY',

	SAME_OLD_NEW_PWD: '@error/accounts/UPDATE/SAME_OLD_NEW_PWD',

	// Interactive
	PASS_FIELDS_BLANK: '@error/accounts/UPDATE/PASS_FIELDS_BLANK',
	PASS_DO_NOT_MATCH: '@error/accounts/UPDATE/PASS_DO_NOT_MATCH'
};

export const TRANSFER = {
	FROM_EMPTY: '@error/accounts/TRANSFER/PASS_FIELDS_BLANK',
	TO_VALUE_EMPTY: '@error/accounts/TRANSFER/PASS_FIELDS_BLANK',

	PWD_PATH_EMPTY: '@error/accounts/TRANSFER/PWD_PATH_EMPTY',
	PWD_IS_DIR: '@error/accounts/TRANSFER/PWD_IS_DIR',
	PWD_PATH_NOT_FOUND: '@error/accounts/TRANSFER/PWD_PATH_NOT_FOUND'
};

export const ACCOUNTS_IMPORT = {
	FILE_PATH_EMPTY: '@error/accounts/IMPORT/FILE_PATH_EMPTY',
	FILE_IS_DIR: '@error/accounts/IMPORT/FILE_IS_DIR',
	FILE_PATH_NOT_FOUND: '@error/accounts/IMPORT/FILE_PATH_NOT_FOUND'
};
