"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearHelperFactory = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bn_js_1 = __importDefault(require("bn.js"));
const near_api_js_1 = require("near-api-js");
const providers_1 = require("near-api-js/lib/providers");
const consts_1 = require("../consts");
async function nearHelperFactory({ networkId, bridge, rpcUrl, xpnft, feeMargin, notifier, walletUrl, helperUrl, }) {
    const near = await (0, near_api_js_1.connect)({
        nodeUrl: rpcUrl,
        networkId,
        headers: {},
    });
    const isApproved = async (account, nft) => {
        const { tokenId: token_id, contract } = nft.native;
        const result = await account.viewFunction({
            args: {
                token_id,
                approved_account_id: bridge,
                approval_id: null,
            },
            contractId: contract,
            methodName: "nft_is_approved",
        });
        console.log(`Is approved: ${result}`);
        return result;
    };
    return {
        async estimateValidateTransferNft(_to, _metadata, _mintWith) {
            return new bignumber_js_1.default(0); // TODO
        },
        async estimateValidateUnfreezeNft(_to, _metadata, _mintWith) {
            return new bignumber_js_1.default(0); // TODO
        },
        getNonce() {
            return consts_1.Chain.NEAR;
        },
        async balance(address) {
            const res = (await new near_api_js_1.Account(near.connection, address).getAccountBalance()).available;
            return new bignumber_js_1.default(res);
        },
        async mintNft(owner, options) {
            const result = await owner.functionCall({
                contractId: options.contract,
                methodName: "nft_mint",
                args: {
                    token_id: options.token_id,
                    token_owner_id: options.token_owner_id,
                    token_metadata: options.metadata,
                },
                attachedDeposit: new bn_js_1.default("10000000000000000000000"), // 0.01 Near
            });
            return [result, (0, providers_1.getTransactionLastResult)(result)];
        },
        async nftList(owner, contract) {
            const result = await owner.functionCall({
                contractId: contract,
                methodName: "nft_tokens_for_owner",
                args: { account_id: owner.accountId },
            });
            const res = (0, providers_1.getTransactionLastResult)(result);
            return res.map((r) => {
                return {
                    native: {
                        tokenId: r.token_id,
                        contract,
                    },
                    collectionIdent: contract,
                    uri: r.metadata.extra || r.metadata.media,
                };
            });
        },
        async preTransfer(sender, nft, _fee) {
            if (await isApproved(sender, nft)) {
                return undefined;
            }
            const result = await sender
                .functionCall({
                contractId: nft.native.contract,
                methodName: "nft_approve",
                args: {
                    token_id: nft.native.tokenId,
                    account_id: bridge,
                    msg: "Approval for NFT Transfer via XP Network Multichain NFT Bridge",
                },
                attachedDeposit: new bn_js_1.default("1000000000000000000000"), // 0.001 Near
            })
                .catch((e) => {
                return e["transaction_outcome"]["id"];
            });
            return result;
        },
        XpNft: xpnft,
        async transferNftToForeign(sender, chain_nonce, to, id, txFees, mint_with, gasLimit) {
            var _a;
            const result = await sender.functionCall({
                contractId: bridge,
                args: {
                    token_id: id.native.tokenId,
                    chain_nonce,
                    to,
                    amt: new bignumber_js_1.default(txFees),
                    mint_with,
                    token_contract: id.native.contract,
                },
                methodName: "freeze_nft",
                attachedDeposit: new bn_js_1.default(txFees.toString()),
                gas: new bn_js_1.default((_a = gasLimit === null || gasLimit === void 0 ? void 0 : gasLimit.toString()) !== null && _a !== void 0 ? _a : near_api_js_1.DEFAULT_FUNCTION_CALL_GAS),
            });
            await notifier.notifyNear(result.transaction.hash);
            return [result, (0, providers_1.getTransactionLastResult)(result)];
        },
        getFeeMargin() {
            return feeMargin;
        },
        getProvider() {
            return near;
        },
        async unfreezeWrappedNft(sender, to, id, txFees, nonce) {
            const result = await sender.functionCall({
                contractId: bridge,
                args: {
                    token_id: id.native.tokenId,
                    chain_nonce: parseInt(nonce),
                    to,
                    amt: parseInt(txFees.toString()),
                    token_contract: id.native.contract,
                },
                methodName: "withdraw_nft",
                attachedDeposit: new bn_js_1.default(txFees.toString()),
                gas: near_api_js_1.DEFAULT_FUNCTION_CALL_GAS,
            });
            await notifier.notifyNear(result.transaction.hash);
            return [result, (0, providers_1.getTransactionLastResult)(result)];
        },
        async validateAddress(adr) {
            try {
                await new near_api_js_1.Account(near.connection, adr).getAccountBalance();
                return true;
            }
            catch (e) {
                return false;
            }
        },
        async connectWallet() {
            if (typeof window === "undefined") {
                throw new Error("Browser method only");
            }
            const nearConnection = await (0, near_api_js_1.connect)({
                networkId,
                nodeUrl: rpcUrl,
                keyStore: new near_api_js_1.keyStores.BrowserLocalStorageKeyStore(),
                headers: {},
                walletUrl,
                helperUrl,
            });
            const wc = new near_api_js_1.WalletConnection(nearConnection, "");
            return wc;
        },
        async getContract(signer, _contract) {
            return new near_api_js_1.Contract(signer, _contract, {
                viewMethods: [],
                changeMethods: ["nft_mint"],
            });
        },
        async getUserMinter(keypair, address) {
            const keyStore = new near_api_js_1.keyStores.InMemoryKeyStore();
            const keyPair = near_api_js_1.KeyPair.fromString(keypair);
            keyStore.setKey(networkId, address, keyPair);
            const signer = new near_api_js_1.InMemorySigner(keyStore);
            const provider = await (0, near_api_js_1.connect)({
                headers: {},
                nodeUrl: rpcUrl,
                networkId,
                signer,
            });
            return provider;
        },
    };
}
exports.nearHelperFactory = nearHelperFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL25lYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQXFDO0FBQ3JDLGtEQUF1QjtBQUV2Qiw2Q0FVcUI7QUFFckIseURBR21DO0FBQ25DLHNDQUFrQztBQTRFM0IsS0FBSyxVQUFVLGlCQUFpQixDQUFDLEVBQ3RDLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1QsUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEdBQ0U7SUFDWCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEscUJBQU8sRUFBQztRQUN6QixPQUFPLEVBQUUsTUFBTTtRQUNmLFNBQVM7UUFDVCxPQUFPLEVBQUUsRUFBRTtLQUNaLENBQUMsQ0FBQztJQUVILE1BQU0sVUFBVSxHQUFHLEtBQUssRUFDdEIsT0FBZ0IsRUFDaEIsR0FBcUIsRUFDSCxFQUFFO1FBQ3BCLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQVksTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQ2pELElBQUksRUFBRTtnQkFDSixRQUFRO2dCQUNSLG1CQUFtQixFQUFFLE1BQU07Z0JBQzNCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCO1lBQ0QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtTQUM5QixDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztJQUVGLE9BQU87UUFDTCxLQUFLLENBQUMsMkJBQTJCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTO1lBQ3pELE9BQU8sSUFBSSxzQkFBUyxDQUFDLENBQUMsQ0FB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