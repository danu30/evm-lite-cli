"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const AccountsGet_1 = require("../../src/commands/AccountsGet");
const stage_1 = require("../stage");
const Staging_1 = require("../../src/classes/Staging");
const assert = Chai.assert;
describe('Command: accounts get', () => {
    it('should return error as socket provided is not running an active node', () => __awaiter(this, void 0, void 0, function* () {
        const args = {
            options: {
                host: '127.0.0.1',
                port: '1234',
            }
        };
        const result = yield AccountsGet_1.stage(args, stage_1.session);
        assert.equal(result.type, Staging_1.default.ERROR);
        assert.equal(result.subtype, Staging_1.default.ERRORS.INVALID_CONNECTION);
    }));
    it('should return error no address was provided', () => __awaiter(this, void 0, void 0, function* () {
        const args = {
            options: {
                host: '127.0.0.1',
                port: '8080',
            }
        };
        const result = yield AccountsGet_1.stage(args, stage_1.session);
        assert.equal(result.type, Staging_1.default.ERROR);
        assert.equal(result.subtype, Staging_1.default.ERRORS.BLANK_FIELD);
    }));
    it('should return unformatted output for provided address', () => __awaiter(this, void 0, void 0, function* () {
        const args = {
            address: '0x3d906545a6f4e20062fe1e08760cfdbead0d1d96',
            options: {
                host: '127.0.0.1',
                port: '8080',
            }
        };
        const result = yield AccountsGet_1.stage(args, stage_1.session);
        assert.equal(result.type, Staging_1.default.SUCCESS);
        assert.equal(result.args.address, '0x3d906545a6f4e20062fe1e08760cfdbead0d1d96');
        assert.equal(result.args.options.formatted, undefined);
    }));
    it('should return formatted output for provided address', () => __awaiter(this, void 0, void 0, function* () {
        const args = {
            address: '0x3d906545a6f4e20062fe1e08760cfdbead0d1d96',
            options: {
                formatted: true,
                host: '127.0.0.1',
                port: '8080',
            }
        };
        const result = yield AccountsGet_1.stage(args, stage_1.session);
        assert.equal(result.type, Staging_1.default.SUCCESS);
        assert.equal(result.args.address, '0x3d906545a6f4e20062fe1e08760cfdbead0d1d96');
        assert.equal(result.args.options.formatted, true);
    }));
});
