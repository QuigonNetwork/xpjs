"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.algorandHelper = exports.algoSignerWrapper = exports.typedAlgoSigner = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const utils_1 = require("@json-rpc-tools/utils");
const axios_1 = __importDefault(require("axios"));
const bignumber_js_1 = require("bignumber.js");
const js_base64_1 = require("js-base64");
/**
 * This library is written in typescript.
 * unfortunately the browser extension injects the AlgoSigner in a way we can't get a typed object wwithout this hack.
 *
 * @return Strongly typed AlgoSigner from extension
 */
function typedAlgoSigner() {
    //@ts-expect-error why do you inject libraries like this :|
    if (typeof AlgoSigner === "undefined") {
        throw Error("algosigner not available!");
    }
    //@ts-expect-error why do you inject libraries like this :|
    return AlgoSigner;
}
exports.typedAlgoSigner = typedAlgoSigner;
function algoSignerWrapper(algod, acc) {
    const signer = {
        accounts(_) {
            return Promise.resolve([
                {
                    address: acc.addr,
                },
            ]);
        },
        signTxn(txns) {
            return Promise.resolve(txns.map((t) => {
                const signed = algosdk_1.default.signTransaction(algosdk_1.default.decodeUnsignedTransaction(js_base64_1.Base64.toUint8Array(t.txn)), acc.sk);
                return {
                    txID: signed.txID,
                    blob: js_base64_1.Base64.fromUint8Array(signed.blob),
                };
            }));
        },
        send({ tx }) {
            return algod.sendRawTransaction(js_base64_1.Base64.toUint8Array(tx)).do();
        },
    };
    return {
        algoSigner: signer,
        address: acc.addr,
        ledger: "any",
    };
}
exports.algoSignerWrapper = algoSignerWrapper;
const encoder = new TextEncoder();
const MINT_NFT_COST = new bignumber_js_1.BigNumber(1000);
function algorandHelper(args) {
    const appAddr = algosdk_1.default.getApplicationAddress(args.sendNftAppId);
    const algod = new algosdk_1.default.Algodv2(args.algodApiKey, args.algodUri, args.algodPort);
    async function waitTxnConfirm(txId) {
        const status = await algod.status().do();
        let lastRound = status["last-round"];
        let pendingInfo = await algod.pendingTransactionInformation(txId).do();
        while (!(pendingInfo["confirmed-round"] && pendingInfo["confirmed-round"] > 0)) {
            lastRound += 1;
            await algod.statusAfterBlock(lastRound).do();
            pendingInfo = await algod.pendingTransactionInformation(txId).do();
        }
    }
    const transferNft = async (signer, chain_nonce, to, nft, _, // TODO: handle mintWith
    txFees) => {
        const suggested = await algod.getTransactionParams().do();
        const feesTx = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
            from: signer.address,
            to: appAddr,
            amount: BigInt(txFees.toString()),
            suggestedParams: suggested,
        });
        const transferTx = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: signer.address,
            to: appAddr,
            amount: 1,
            assetIndex: nft.native.nftId,
            suggestedParams: suggested,
        });
        const tCallTx = algosdk_1.default.makeApplicationNoOpTxnFromObject({
            from: signer.address,
            appIndex: args.sendNftAppId,
            appArgs: [
                encoder.encode("receive_nft"),
                encoder.encode(to),
                new Uint8Array(Buffer.concat([
                    Buffer.from(new Uint32Array([0]).buffer),
                    Buffer.from(new Uint32Array([chain_nonce]).buffer).reverse(),
                ])),
            ],
            foreignAssets: [nft.native.nftId],
            suggestedParams: suggested,
        });
        algosdk_1.default.assignGroupID([feesTx, transferTx, tCallTx]);
        const encodedTxns = [
            { txn: js_base64_1.Base64.fromUint8Array(feesTx.toByte()) },
            { txn: js_base64_1.Base64.fromUint8Array(transferTx.toByte()) },
            { txn: js_base64_1.Base64.fromUint8Array(tCallTx.toByte()) },
        ];
        const signedTxns = await signer.algoSigner.signTxn(encodedTxns);
        const sendRes = await algod
            .sendRawTransaction([
            js_base64_1.Base64.toUint8Array(signedTxns[0].blob),
            js_base64_1.Base64.toUint8Array(signedTxns[1].blob),
            js_base64_1.Base64.toUint8Array(signedTxns[2].blob),
        ])
            .do();
        await waitTxnConfirm(sendRes.txId);
        return sendRes.txId;
    };
    async function isOptIn(addr, nftId) {
        const user = await algod.accountInformation(addr).do();
        for (let i = 0; i < user["assets"].length; i++) {
            if (user["assets"][i]["asset-id"] === nftId) {
                return true;
            }
        }
        return false;
    }
    async function optInNft(signer, nft) {
        if (await isOptIn(signer.address, nft.nftId)) {
            return undefined;
        }
        const suggested = await algod.getTransactionParams().do();
        const optIn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: signer.address,
            to: signer.address,
            amount: 0,
            assetIndex: nft.nftId,
            suggestedParams: suggested,
        });
        const encodedTx = js_base64_1.Base64.fromUint8Array(optIn.toByte());
        const signedTx = await signer.algoSigner.signTxn([{ txn: encodedTx }]);
        const res = await signer.algoSigner.send({
            ledger: signer.ledger,
            tx: signedTx[0].blob,
        });
        await waitTxnConfirm(res.txId);
        return res.txId;
    }
    async function claimNft(signer, info) {
        await optInNft(signer, info);
        const suggested = await algod.getTransactionParams().do();
        const callTxn = algosdk_1.default.makeApplicationNoOpTxnFromObject({
            from: signer.address,
            appIndex: info.appId,
            appArgs: [encoder.encode("transfer_nft")],
            foreignAssets: [info.nftId],
            suggestedParams: suggested,
        });
        const encodedCall = js_base64_1.Base64.fromUint8Array(callTxn.toByte());
        const signedCall = await signer.algoSigner.signTxn([
            {
                txn: encodedCall,
            },
        ]);
        const callRes = await signer.algoSigner.send({
            ledger: signer.ledger,
            tx: signedCall[0].blob,
        });
        await waitTxnConfirm(callRes.txId);
        return callRes.txId;
    }
    return {
        algod,
        getNonce: () => args.nonce,
        claimNft,
        optInNft,
        isOptIn,
        async preTransfer(sender, nft, _fee) {
            if (await isOptIn(appAddr, nft.native.nftId)) {
                return undefined;
            }
            const suggested = await algod.getTransactionParams().do();
            const callTx = algosdk_1.default.makeApplicationNoOpTxnFromObject({
                from: sender.address,
                appIndex: args.sendNftAppId,
                appArgs: [encoder.encode("opt_in_nft")],
                foreignAssets: [nft.native.nftId],
                suggestedParams: suggested,
            });
            const encodedTx = js_base64_1.Base64.fromUint8Array(callTx.toByte());
            const signedTxCall = await sender.algoSigner.signTxn([
                { txn: encodedTx },
            ]);
            const res = await sender.algoSigner.send({
                ledger: sender.ledger,
                tx: signedTxCall[0].blob,
            });
            await waitTxnConfirm(res.txId);
            return suggested;
        },
        isWrappedNft(nft) {
            return nft.native.creator === appAddr;
        },
        transferNftToForeign: transferNft,
        unfreezeWrappedNft: async (signer, _, to, nft, txFees) => {
            const nftMeta = await axios_1.default.get(nft.uri);
            return await transferNft(signer, parseInt(nftMeta.data.wrapped.origin), to, nft, "", txFees);
        },
        estimateValidateTransferNft: () => Promise.resolve(MINT_NFT_COST),
        estimateValidateUnfreezeNft: () => Promise.resolve(MINT_NFT_COST),
        validateAddress: (adr) => Promise.resolve(algosdk_1.default.isValidAddress(adr)),
        claimableNfts: async (txSocket, owner) => {
            await txSocket.cleanNfts(owner);
            const claims = await txSocket.claimNfts(owner);
            const res = await Promise.all(claims.map(async (v) => {
                const appId = parseInt(v.app_id);
                const nftId = parseInt(v.nft_id);
                const assetInfo = await algod.getAssetByID(nftId).do();
                return {
                    nftId,
                    appId,
                    uri: assetInfo.params.url,
                    name: assetInfo.params.name || "",
                };
            }));
            return res;
        },
        walletConnectSigner(connector, address) {
            const signer = {
                accounts(_) {
                    return Promise.resolve(connector.accounts.map((s) => ({ address: s })));
                },
                async signTxn(txns) {
                    const req = utils_1.formatJsonRpcRequest("algo_signTxn", [txns]);
                    const signed = await connector.sendCustomRequest(req);
                    const decoded = signed.map((s) => {
                        return {
                            blob: s !== null && s !== void 0 ? s : "",
                        };
                    });
                    if (decoded.length != txns.length) {
                        throw Error("Couldn't sign all transactions!");
                    }
                    return decoded;
                },
                send(info) {
                    return algod.sendRawTransaction(js_base64_1.Base64.toUint8Array(info.tx)).do();
                },
            };
            return {
                algoSigner: signer,
                address,
                ledger: "any",
            };
        },
        myAlgoSigner(myAlgo, address) {
            const signer = {
                async accounts(_) {
                    const accs = await myAlgo.connect();
                    return accs;
                },
                async signTxn(txns) {
                    const stxs = await myAlgo.signTransaction(txns.map(({ txn }) => txn));
                    return stxs.map((tx) => ({
                        txID: tx.txID,
                        blob: js_base64_1.Base64.fromUint8Array(tx.blob),
                    }));
                },
                send(info) {
                    return algod.sendRawTransaction(js_base64_1.Base64.toUint8Array(info.tx)).do();
                },
            };
            return {
                algoSigner: signer,
                address,
                ledger: "any",
            };
        },
    };
}
exports.algorandHelper = algorandHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxnb3JhbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGVscGVycy9hbGdvcmFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxzREFBbUQ7QUFDbkQsaURBQTZEO0FBQzdELGtEQUEwQjtBQUMxQiwrQ0FBeUM7QUFDekMseUNBQTJDO0FBc0QzQzs7Ozs7R0FLRztBQUNILFNBQWdCLGVBQWU7SUFDN0IsMkRBQTJEO0lBQzNELElBQUksT0FBTyxVQUFVLEtBQUssV0FBVyxFQUFFO1FBQ3JDLE1BQU0sS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDMUM7SUFFRCwyREFBMkQ7SUFDM0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQVJELDBDQVFDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQy9CLEtBQXNCLEVBQ3RCLEdBQW9CO0lBRXBCLE1BQU0sTUFBTSxHQUFrQjtRQUM1QixRQUFRLENBQUMsQ0FBQztZQUNSLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDckI7b0JBQ0UsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJO2lCQUNsQjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLENBQUMsSUFBSTtZQUNWLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNiLE1BQU0sTUFBTSxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUNwQyxpQkFBTyxDQUFDLHlCQUF5QixDQUFDLGtCQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUM3RCxHQUFHLENBQUMsRUFBRSxDQUNQLENBQUM7Z0JBQ0YsT0FBTztvQkFDTCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7b0JBQ2pCLElBQUksRUFBRSxrQkFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2lCQUN6QyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNKLENBQUM7UUFDRCxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7WUFDVCxPQUFPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2hFLENBQUM7S0FDRixDQUFDO0lBRUYsT0FBTztRQUNMLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSTtRQUNqQixNQUFNLEVBQUUsS0FBSztLQUNkLENBQUM7QUFDSixDQUFDO0FBcENELDhDQW9DQztBQTBDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ2xDLE1BQU0sYUFBYSxHQUFHLElBQUksd0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUUxQyxTQUFnQixjQUFjLENBQUMsSUFBb0I7SUFDakQsTUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDakUsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE9BQU8sQ0FDL0IsSUFBSSxDQUFDLFdBQVcsRUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsU0FBUyxDQUNmLENBQUM7SUFFRixLQUFLLFVBQVUsY0FBYyxDQUFDLElBQVk7UUFDeEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JDLElBQUksV0FBVyxHQUFHLE1BQU0sS0FBSyxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3ZFLE9BQ0UsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUN2RTtZQUNBLFNBQVMsSUFBSSxDQUFDLENBQUM7WUFDZixNQUFNLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxFQUN2QixNQUFtQixFQUNuQixXQUFtQixFQUNuQixFQUFVLEVBQ1YsR0FBcUIsRUFDckIsQ0FBUyxFQUFFLHdCQUF3QjtJQUNuQyxNQUFpQixFQUNqQixFQUFFO1FBQ0YsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMxRCxNQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLDJDQUEyQyxDQUFDO1lBQ2pFLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTztZQUNwQixFQUFFLEVBQUUsT0FBTztZQUNYLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pDLGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUNILE1BQU0sVUFBVSxHQUNkLGlCQUFPLENBQUMsaURBQWlELENBQUM7WUFDeEQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3BCLEVBQUUsRUFBRSxPQUFPO1lBQ1gsTUFBTSxFQUFFLENBQUM7WUFDVCxVQUFVLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQzVCLGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUNMLE1BQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZ0NBQWdDLENBQUM7WUFDdkQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMzQixPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNsQixJQUFJLFVBQVUsQ0FDWixNQUFNLENBQUMsTUFBTSxDQUFDO29CQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFO2lCQUM3RCxDQUFDLENBQ0g7YUFDRjtZQUNELGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pDLGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUNILGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sV0FBVyxHQUFHO1lBQ2xCLEVBQUUsR0FBRyxFQUFFLGtCQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQy9DLEVBQUUsR0FBRyxFQUFFLGtCQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQ25ELEVBQUUsR0FBRyxFQUFFLGtCQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1NBQ2pELENBQUM7UUFDRixNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sT0FBTyxHQUFHLE1BQU0sS0FBSzthQUN4QixrQkFBa0IsQ0FBQztZQUNsQixrQkFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLGtCQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDdkMsa0JBQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUN4QyxDQUFDO2FBQ0QsRUFBRSxFQUFFLENBQUM7UUFDUixNQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkMsT0FBTyxPQUFPLENBQUMsSUFBYyxDQUFDO0lBQ2hDLENBQUMsQ0FBQztJQUVGLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBWSxFQUFFLEtBQWE7UUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDOUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxFQUFFO2dCQUMzQyxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQW1CLEVBQUUsR0FBaUI7UUFDNUQsSUFBSSxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QyxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLG9CQUFvQixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDMUQsTUFBTSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxpREFBaUQsQ0FBQztZQUN0RSxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDcEIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ2xCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsVUFBVSxFQUFFLEdBQUcsQ0FBQyxLQUFLO1lBQ3JCLGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLGtCQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUN2QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUNILE1BQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQUVELEtBQUssVUFBVSxRQUFRLENBQUMsTUFBbUIsRUFBRSxJQUFrQjtRQUM3RCxNQUFNLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUUxRCxNQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGdDQUFnQyxDQUFDO1lBQ3ZELElBQUksRUFBRSxNQUFNLENBQUMsT0FBTztZQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDcEIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN6QyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzNCLGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLGtCQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzVELE1BQU0sVUFBVSxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDakQ7Z0JBQ0UsR0FBRyxFQUFFLFdBQVc7YUFDakI7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQzNDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsT0FBTztRQUNMLEtBQUs7UUFDTCxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFDMUIsUUFBUTtRQUNSLFFBQVE7UUFDUixPQUFPO1FBQ1AsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7WUFDakMsSUFBSSxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFELE1BQU0sTUFBTSxHQUFHLGlCQUFPLENBQUMsZ0NBQWdDLENBQUM7Z0JBQ3RELElBQUksRUFBRSxNQUFNLENBQUMsT0FBTztnQkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMzQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN2QyxhQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakMsZUFBZSxFQUFFLFNBQVM7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxTQUFTLEdBQUcsa0JBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDekQsTUFBTSxZQUFZLEdBQUcsTUFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDbkQsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO2FBQ25CLENBQUMsQ0FBQztZQUNILE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtnQkFDckIsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2FBQ3pCLENBQUMsQ0FBQztZQUNILE1BQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQsWUFBWSxDQUFDLEdBQUc7WUFDZCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQztRQUN4QyxDQUFDO1FBQ0Qsb0JBQW9CLEVBQUUsV0FBVztRQUNqQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3ZELE1BQU0sT0FBTyxHQUFHLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBZ0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sTUFBTSxXQUFXLENBQ3RCLE1BQU0sRUFDTixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3JDLEVBQUUsRUFDRixHQUFHLEVBQ0gsRUFBRSxFQUNGLE1BQU0sQ0FDUCxDQUFDO1FBQ0osQ0FBQztRQUNELDJCQUEyQixFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQ2pFLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQ2pFLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RSxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQThCLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDckUsTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUvQyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLFNBQVMsR0FBRyxNQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBRXZELE9BQU87b0JBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEdBQUcsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQWE7b0JBQ25DLElBQUksRUFBRyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQWUsSUFBSSxFQUFFO2lCQUM5QyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztZQUVGLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELG1CQUFtQixDQUNqQixTQUF3QixFQUN4QixPQUFlO1lBRWYsTUFBTSxNQUFNLEdBQWtCO2dCQUM1QixRQUFRLENBQUMsQ0FBQztvQkFDUixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQ3BCLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDaEQsQ0FBQztnQkFDSixDQUFDO2dCQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSTtvQkFDaEIsTUFBTSxHQUFHLEdBQUcsNEJBQW9CLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDekQsTUFBTSxNQUFNLEdBQ1YsTUFBTSxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDL0IsT0FBTzs0QkFDTCxJQUFJLEVBQUUsQ0FBQyxhQUFELENBQUMsY0FBRCxDQUFDLEdBQUksRUFBRTt5QkFDRCxDQUFDO29CQUNqQixDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDakMsTUFBTSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztxQkFDaEQ7b0JBRUQsT0FBTyxPQUFPLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLElBQW9CO29CQUN2QixPQUFPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDckUsQ0FBQzthQUNGLENBQUM7WUFFRixPQUFPO2dCQUNMLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixPQUFPO2dCQUNQLE1BQU0sRUFBRSxLQUFLO2FBQ2QsQ0FBQztRQUNKLENBQUM7UUFDRCxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU87WUFDMUIsTUFBTSxNQUFNLEdBQWtCO2dCQUM1QixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2QsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3BDLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJO29CQUNoQixNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3RFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJO3dCQUNiLElBQUksRUFBRSxrQkFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO3FCQUNyQyxDQUFDLENBQUMsQ0FBQztnQkFDTixDQUFDO2dCQUNELElBQUksQ0FBQyxJQUFvQjtvQkFDdkIsT0FBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsa0JBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JFLENBQUM7YUFDRixDQUFDO1lBRUYsT0FBTztnQkFDTCxVQUFVLEVBQUUsTUFBTTtnQkFDbEIsT0FBTztnQkFDUCxNQUFNLEVBQUUsS0FBSzthQUNkLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUEvUUQsd0NBK1FDIn0=