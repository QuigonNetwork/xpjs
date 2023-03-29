"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearHelperFactory = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bn_js_1 = require("bn.js");
const near_api_js_1 = require("near-api-js");
const providers_1 = require("near-api-js/lib/providers");
const consts_1 = require("../consts");
async function nearHelperFactory({ networkId, bridge, rpcUrl, xpnft, feeMargin, notifier, walletUrl, signatureSvc, helperUrl, }) {
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
        return result;
    };
    const getWalletCallbackUrl = (params) => {
        let walletCallbackUrl = undefined;
        if (globalThis.window !== undefined) {
            const network = location.pathname.match(/^\/(staging|testnet)\/.+/)?.at(1) || "";
            const query = new URLSearchParams(window.location.search.replace("?", ""));
            const wid = query.get("wid");
            walletCallbackUrl = `${location.protocol}//${location.host}/${network}/connect?${wid ? `wid=${wid}` : ""}${params}`;
        }
        return walletCallbackUrl;
    };
    const notifyValidators = async (hash) => {
        //await new Promise((r) => setTimeout(r, 15_000));
        return notifier.notifyNear(hash);
    };
    return {
        notify: notifyValidators,
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
                attachedDeposit: new bn_js_1.BN("10000000000000000000000"), // 0.01 Near
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
        async preTransfer(sender, nft, _fee, args) {
            if (await isApproved(sender, nft)) {
                return undefined;
            }
            if (!args) {
                throw new Error("Missing args");
            }
            const { receiver, to } = args;
            const walletCallbackUrl = getWalletCallbackUrl(`NEARTRX=true&type=approve&to=${to}&receiver=${encodeURIComponent(receiver)}&tokenId=${encodeURIComponent(nft.native.tokenId)}`);
            const result = await sender.functionCall({
                contractId: nft.native.contract,
                methodName: "nft_approve",
                args: {
                    token_id: nft.native.tokenId,
                    account_id: bridge,
                },
                attachedDeposit: new bn_js_1.BN("1000000000000000000000"),
                ...(walletCallbackUrl ? { walletCallbackUrl } : {}),
            });
            return result.transaction_outcome.id;
        },
        XpNft: xpnft,
        async transferNftToForeign(sender, chain_nonce, to, id, txFees, mint_with) {
            const walletCallbackUrl = getWalletCallbackUrl(`NEARTRX=true&type=transfer&to=${chain_nonce}&receiver=${encodeURIComponent(to)}&tokenId=${encodeURIComponent(id.native.tokenId)}&contract=${encodeURIComponent(id.native.contract)}`);
            const res = await signatureSvc
                .getSignatureNear(consts_1.Chain.NEAR, chain_nonce, id.native.tokenId, id.collectionIdent, id.native.tokenId, to)
                .catch(() => undefined);
            if (res) {
                const result = await sender.functionCall({
                    contractId: bridge,
                    args: {
                        token_id: id.native.tokenId,
                        chain_nonce,
                        to,
                        amt: new bignumber_js_1.default(txFees) /*.div(2)*/,
                        mint_with,
                        token_contract: id.native.contract,
                        ...(res?.signature
                            ? { sig_data: [...Buffer.from(res.signature, "hex")] }
                            : {}),
                    },
                    methodName: "freeze_nft",
                    attachedDeposit: new bn_js_1.BN(res?.fee) /*.div(new BN(2))*/,
                    gas: new bn_js_1.BN("300000000000000"),
                    ...(walletCallbackUrl ? { walletCallbackUrl } : {}),
                });
                await notifyValidators(result.transaction.hash);
                return [result, (0, providers_1.getTransactionLastResult)(result)];
            }
            else {
                return undefined;
            }
        },
        getFeeMargin() {
            return feeMargin;
        },
        getProvider() {
            return near;
        },
        async unfreezeWrappedNft(sender, to, id, txFees, nonce) {
            const walletCallbackUrl = getWalletCallbackUrl(`NEARTRX=true&type=unfreeze&to=${nonce}&receiver=${encodeURIComponent(to)}&tokenId=${encodeURIComponent(id.native.tokenId)}&contract=${encodeURIComponent(id.native.contract)}`);
            const res = await signatureSvc.getSignatureNear(consts_1.Chain.NEAR, nonce, id.native.tokenId, id.collectionIdent, id.native.tokenId, to);
            const result = await sender.functionCall({
                contractId: bridge,
                args: {
                    token_id: id.native.tokenId,
                    chain_nonce: parseInt(nonce),
                    to,
                    amt: parseInt(txFees.toString()),
                    token_contract: id.native.contract,
                    sig_data: [...Buffer.from(res?.signature, "hex")],
                },
                methodName: "withdraw_nft",
                attachedDeposit: new bn_js_1.BN(res?.fee),
                gas: new bn_js_1.BN("300000000000000"),
                ...(walletCallbackUrl ? { walletCallbackUrl } : {}),
            });
            await notifyValidators(result.transaction.hash);
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
        async connectWallet(url) {
            if (typeof window === "undefined") {
                throw new Error("Browser method only");
            }
            const nearConnection = await (0, near_api_js_1.connect)({
                networkId,
                nodeUrl: rpcUrl,
                keyStore: new near_api_js_1.keyStores.BrowserLocalStorageKeyStore(),
                headers: {},
                walletUrl: url || walletUrl,
                helperUrl,
            });
            const wc = new near_api_js_1.WalletConnection(nearConnection, "");
            return wc;
        },
        async isNftWhitelisted(nft, signer) {
            const result = await signer
                .viewFunction({
                args: {
                    contract_id: nft.native.contract,
                },
                contractId: bridge,
                methodName: "is_whitelist",
            })
                .catch(() => false);
            return result;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL25lYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQXFDO0FBQ3JDLGlDQUEyQjtBQUUzQiw2Q0FRcUI7QUFFckIseURBR21DO0FBQ25DLHNDQUFrQztBQTRGM0IsS0FBSyxVQUFVLGlCQUFpQixDQUFDLEVBQ3RDLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1QsUUFBUSxFQUNSLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxHQUNFO0lBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHFCQUFPLEVBQUM7UUFDekIsT0FBTyxFQUFFLE1BQU07UUFDZixTQUFTO1FBQ1QsT0FBTyxFQUFFLEVBQUU7S0FDWixDQUFDLENBQUM7SUFFSCxNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQ3RCLE9BQWdCLEVBQ2hCLEdBQXFCLEVBQ0gsRUFBRTtRQUNwQixNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFZLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FBQztZQUNqRCxJQUFJLEVBQUU7Z0JBQ0osUUFBUTtnQkFDUixtQkFBbUIsRUFBRSxNQUFNO2dCQUMzQixXQUFXLEVBQUUsSUFBSTthQUNsQjtZQUNELFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFVBQVUsRUFBRSxpQkFBaUI7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0lBRUYsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQzlDLElBQUksaUJBQWlCLEdBQXVCLFNBQVMsQ0FBQztRQUN0RCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ25DLE1BQU0sT0FBTyxHQUNYLFFB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