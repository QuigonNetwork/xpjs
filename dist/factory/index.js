"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactory = void 0;
const consts_1 = require("../consts");
__exportStar(require("./utils"), exports);
__exportStar(require("./factories"), exports);
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const __1 = require("..");
const out_1 = require("@elrondnetwork/erdjs/out");
const hethers_1 = require("@hashgraph/hethers");
const algosdk_1 = __importDefault(require("algosdk"));
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const js_base64_1 = require("js-base64");
const heartbeat_1 = require("../services/heartbeat");
const exchangeRate_1 = require("../services/exchangeRate");
const scVerify_1 = require("../services/scVerify");
const algorand_1 = require("../helpers/algorand");
const hts_abi_1 = require("../helpers/hedera/hts_abi");
const utils_1 = require("./utils");
const base64url_1 = __importDefault(require("base64url"));
function mapNonceToParams(chainParams) {
    const cToP = new Map();
    cToP.set(consts_1.Chain.ELROND, chainParams.elrondParams);
    cToP.set(consts_1.Chain.HECO, chainParams.hecoParams);
    cToP.set(consts_1.Chain.BSC, chainParams.bscParams);
    cToP.set(consts_1.Chain.ETHEREUM, chainParams.ropstenParams);
    cToP.set(consts_1.Chain.AVALANCHE, chainParams.avalancheParams);
    cToP.set(consts_1.Chain.POLYGON, chainParams.polygonParams);
    cToP.set(consts_1.Chain.FANTOM, chainParams.fantomParams);
    cToP.set(consts_1.Chain.TRON, chainParams.tronParams);
    cToP.set(consts_1.Chain.CELO, chainParams.celoParams);
    cToP.set(consts_1.Chain.HARMONY, chainParams.harmonyParams);
    cToP.set(consts_1.Chain.ONT, chainParams.ontologyParams);
    cToP.set(consts_1.Chain.XDAI, chainParams.xDaiParams);
    cToP.set(consts_1.Chain.ALGORAND, chainParams.algorandParams);
    cToP.set(consts_1.Chain.FUSE, chainParams.fuseParams);
    cToP.set(consts_1.Chain.UNIQUE, chainParams.uniqueParams);
    cToP.set(consts_1.Chain.TEZOS, chainParams.tezosParams);
    cToP.set(consts_1.Chain.VELAS, chainParams.velasParams);
    cToP.set(consts_1.Chain.IOTEX, chainParams.iotexParams);
    cToP.set(consts_1.Chain.AURORA, chainParams.auroraParams);
    cToP.set(consts_1.Chain.GODWOKEN, chainParams.godwokenParams);
    cToP.set(consts_1.Chain.GATECHAIN, chainParams.gateChainParams);
    cToP.set(consts_1.Chain.VECHAIN, chainParams.vechainParams);
    cToP.set(consts_1.Chain.SECRET, chainParams.secretParams);
    cToP.set(consts_1.Chain.HEDERA, chainParams.hederaParams);
    cToP.set(consts_1.Chain.SKALE, chainParams.skaleParams);
    cToP.set(consts_1.Chain.DFINITY, chainParams.dfinityParams);
    cToP.set(consts_1.Chain.NEAR, chainParams.nearParams);
    cToP.set(consts_1.Chain.MOONBEAM, chainParams.moonbeamParams);
    cToP.set(consts_1.Chain.ABEYCHAIN, chainParams.abeyChainParams);
    cToP.set(consts_1.Chain.TON, chainParams.tonParams);
    cToP.set(consts_1.Chain.APTOS, chainParams.aptosParams);
    cToP.set(consts_1.Chain.SOLANA, chainParams.solanaParams);
    cToP.set(consts_1.Chain.CADUCEUS, chainParams.caduceusParams);
    cToP.set(consts_1.Chain.OKC, chainParams.okcParams);
    cToP.set(consts_1.Chain.ARBITRUM, chainParams.arbitrumParams);
    cToP.set(consts_1.Chain.BITGERT, chainParams.bitgertParams);
    return cToP;
}
/**
 * This function is the basic entry point to use this package as a library.
 * @param appConfig: {@link AppConfig} The configuration of the library.
 * @param chainParams: {@link ChainParams} Contains the details for all the chains to mint and transfer NFTs between them.
 * @returns {ChainFactory}: A factory object that can be used to mint and transfer NFTs between chains.
 */
function ChainFactory(appConfig, chainParams) {
    let helpers = new Map();
    let cToP = mapNonceToParams(chainParams);
    const heartbeatRepo = (0, heartbeat_1.bridgeHeartbeat)(appConfig.heartbeatUri);
    const remoteExchangeRate = (0, exchangeRate_1.exchangeRateRepo)(appConfig.exchangeRateUri);
    const txSocket = (0, __1.socketHelper)(appConfig.txSocketUri);
    const nftlistRest = axios_1.default.create({
        baseURL: appConfig.nftListUri,
        headers: {
            Authorization: `Bearer ${appConfig.nftListAuthToken}`,
        },
    });
    const scVerifyRest = (0, scVerify_1.scVerify)(appConfig.scVerifyUri);
    const inner = async (chain) => {
        let helper = helpers.get(chain);
        if (helper === undefined) {
            helper = await consts_1.CHAIN_INFO.get(chain).constructor(cToP.get(chain));
            helpers.set(chain, helper);
        }
        return helper;
    };
    const setProvider = async (chain, provider) => {
        const args = {
            ...cToP.get(chain),
            provider,
        };
        const helper = await consts_1.CHAIN_INFO.get(chain).constructor(args);
        helpers.set(chain, helper);
    };
    async function calcExchangeFees(fromChain, toChain, val, toChainFee) {
        const rate = await remoteExchangeRate.getBatchedRate([
            consts_1.CHAIN_INFO.get(toChain).currency,
            consts_1.CHAIN_INFO.get(fromChain).currency,
        ]);
        const feeR = val.dividedBy(consts_1.CHAIN_INFO.get(toChain).decimals);
        const fromExRate = rate.get(consts_1.CHAIN_INFO.get(fromChain).currency);
        const toExRate = rate.get(consts_1.CHAIN_INFO.get(toChain).currency);
        const usdFee = Math.min(Math.max(toChainFee.min, feeR.times(toExRate * 0.1).toNumber()), toChainFee.max);
        const feeProfit = usdFee / fromExRate;
        return feeR
            .times(toExRate / fromExRate)
            .plus(feeProfit * 0.5)
            .times(consts_1.CHAIN_INFO.get(fromChain).decimals)
            .integerValue(bignumber_js_1.default.ROUND_CEIL);
    }
    const estimateFees = async (fromChain, toChain, nft, receiver, extraFee) => {
        const estimate = await toChain.estimateValidateTransferNft(receiver, nft, "");
        let conv = await calcExchangeFees(fromChain.getNonce(), toChain.getNonce(), estimate, toChain.getFeeMargin());
        if (extraFee) {
            conv = conv.multipliedBy(extraFee).integerValue(bignumber_js_1.default.ROUND_CEIL);
        }
        return fromChain.getExtraFees ? fromChain.getExtraFees().plus(conv) : conv;
    };
    const estimateWithContractDep = async (fromChain, toChain, nft) => {
        const from = fromChain.getNonce();
        const to = toChain.getNonce();
        const noDeploy = new Error(`${from} or ${to} is undeployable`);
        let calcContractDep = new bignumber_js_1.default("0");
        let originalContract;
        let originalChain;
        try {
            const { bool, wrapped } = await isWrappedNft(nft, from, to);
            if (bool) {
                originalContract = wrapped?.contract;
                originalChain = wrapped?.origin;
                if (to == Number(originalChain))
                    throw noDeploy;
            }
            else {
                originalContract = nft.collectionIdent || nft.native.contract;
                originalChain = nft.native.chainId;
            }
            const fromType = consts_1.CHAIN_INFO.get(Number(originalChain))?.type;
            const toType = consts_1.CHAIN_INFO.get(to)?.type;
            const deployable = [
                consts_1.ChainType.EVM,
                consts_1.ChainType.SOLANA,
                consts_1.ChainType.NEAR,
                consts_1.ChainType.APTOS,
                consts_1.ChainType.TON,
            ];
            const deployableFrom = deployable.find((type) => type === fromType);
            const deployableTo = deployable.find((type) => type === toType);
            if (!deployableFrom || !deployableTo)
                throw noDeploy;
            const _chain = from == Number(originalChain) //if first time sending
                ? to
                : to == Number(originalChain) //if sending back
                    ? from
                    : to; //all the rest
            const [checkWithOutTokenId, verifyList] = await Promise.all([
                scVerifyRest.checkWithOutTokenId(Number(originalChain), _chain, originalContract),
                scVerifyRest.list(originalContract, to, from),
            ]);
            if (!checkWithOutTokenId &&
                !verifyList &&
                toChain?.estimateContractDeploy) {
                //@ts-ignore
                const contractFee = await toChain?.estimateContractDeploy(toChain);
                calcContractDep = (await calcExchangeFees(from, to, contractFee, toChain.getFeeMargin())).multipliedBy(1.1);
            }
            return { calcContractDep };
        }
        catch (error) {
            console.log(error.message, console.log("error in estimateWithContractDep"));
            return { calcContractDep };
        }
    };
    const estimateSFTfees = async (fromChain, amount, price = 0.05) => {
        const rate = await remoteExchangeRate.getBatchedRate([
            consts_1.CHAIN_INFO.get(fromChain.getNonce()).currency,
        ]);
        const fromExRate = rate.get(consts_1.CHAIN_INFO.get(fromChain.getNonce()).currency);
        const y = price / fromExRate;
        const sftFees = Number(amount) <= 10 ? 0 : y * (Number(amount) - 10);
        return new bignumber_js_1.default(sftFees)
            .multipliedBy(consts_1.CHAIN_INFO.get(fromChain.getNonce()).decimals)
            .integerValue();
    };
    async function bridgeStatus() {
        const res = await heartbeatRepo.status();
        return Object.fromEntries(Object.entries(res).map(([c, s]) => [
            c,
            s.bridge_alive ? "alive" : "dead",
        ]));
    }
    async function estimateBatchFees(fromChain, toChain, nft, receiver) {
        const estimate = await toChain.estimateValidateTransferNftBatch(receiver, nft, new Array(nft.length).fill(toChain.XpNft));
        const conv = await calcExchangeFees(fromChain.getNonce(), toChain.getNonce(), estimate.times(nft.length), toChain.getFeeMargin());
        return conv;
    }
    async function requireBridge(chains) {
        const status = await heartbeatRepo.status();
        let deadChain;
        const alive = chains.every((c) => {
            const stat = status[c].bridge_alive;
            if (!stat) {
                deadChain = c;
            }
            return stat;
        });
        if (!alive) {
            throw Error(`chain ${deadChain} is dead! its unsafe to use the bridge`);
        }
    }
    function checkNotOldWrappedNft(contract) {
        if (utils_1.oldXpWraps.has(contract)) {
            throw new Error(`${contract} is an old wrapped NFT`);
        }
    }
    async function isWrappedNft(nft, fc, tc) {
        if (fc === consts_1.Chain.TEZOS) {
            return {
                bool: typeof nft.native.meta?.token?.metadata?.wrapped !==
                    "undefined",
                wrapped: undefined,
            };
        }
        try {
            checkNotOldWrappedNft(nft.collectionIdent);
        }
        catch (_) {
            return { bool: false, wrapped: undefined };
        }
        if (/w\/$/.test(nft.uri)) {
            nft = {
                ...nft,
                uri: nft.uri + nft.native.tokenId,
            };
        }
        const wrapped = (await axios_1.default.get(nft.uri).catch(() => undefined))?.data
            .wrapped;
        const contract = wrapped?.contract || wrapped?.source_mint_ident;
        tc && contract && (0, utils_1.checkBlockedContracts)(tc, contract);
        return { bool: typeof wrapped !== "undefined", wrapped };
    }
    async function algoOptInCheck(nft, toChain, receiver, wrapped) {
        if ("meta" in nft.native)
            return;
        //const nftDat = await axios.get(nft.uri);
        if (wrapped.origin == consts_1.Chain.ALGORAND.toString() &&
            "isOptIn" in toChain &&
            //@ts-ignore
            !(await toChain.isOptIn(receiver, parseInt(wrapped.assetID)))) {
            throw Error("receiver hasn't opted-in to wrapped nft");
        }
    }
    async function getVerifiedContract(from, tc, fc, _) {
        const res = await scVerifyRest.checkWithOutTokenId(fc, tc, from); /*await scVerifyRest.default(
                from,
                tc,
                fc,
                tokenId && !isNaN(Number(tokenId)) ? tokenId : undefined
            );*/
        return res?.data;
    }
    /*async function checkMintWith(
          from: string,
          to: string,
          targetChain: number,
          fromChain: number,
          tokenId?: string
      ): Promise<boolean> {
          const res = await scVerifyRest.verify(
              from,
              to,
              targetChain,
              fromChain,
              tokenId
          );
  
          return res?.data.data == "allowed";
      }*/
    return {
        estimateWithContractDep,
        getVerifiedContract,
        balance: (i, a) => i.balance(a),
        async transferBatchNft(from, to, nfts, signer, receiver, fee, mw) {
            let result = [];
            if (appConfig.network === "mainnet") {
                await requireBridge([from.getNonce(), to.getNonce()]);
            }
            if (!fee) {
                fee = await estimateBatchFees(from, to, nfts, receiver);
            }
            if (!(await to.validateAddress(receiver))) {
                throw Error("invalid address");
            }
            console.log(`Batch Minting With: ${mw || to.XpNft1155}`);
            const wrapped = [];
            const unwrapped = [];
            await Promise.all(nfts.map(async (e) => {
                if (
                // @ts-ignore
                e.native.contractType &&
                    // @ts-ignore
                    e.native.contractType === "ERC721") {
                    throw new Error(`ERC721 is not supported`);
                }
                if ((await isWrappedNft(e, from.getNonce())).bool) {
                    wrapped.push(e);
                }
                else {
                    unwrapped.push(e);
                }
            }));
            const toNonce = to.getNonce();
            unwrapped.length &&
                result.push(from.transferNftBatchToForeign(signer, toNonce, receiver, unwrapped, mw || to.XpNft1155, new bignumber_js_1.default(fee), cToP.get(toNonce)));
            wrapped.length &&
                result.push(from.unfreezeWrappedNftBatch(signer, to.getNonce(), receiver, wrapped, new bignumber_js_1.default(fee)));
            return await Promise.all(result);
        },
        estimateBatchFees,
        async whitelistEVM(chain, address) {
            const chainLocal = cToP.get(chain);
            if (!chainLocal)
                throw new Error("Chain not found");
            const params = await consts_1.CHAIN_INFO.get(chain)?.constructor(chainLocal);
            if (!params)
                throw new Error("An error occured");
            const isAddressValid = await params.validateAddress(address);
            if (!isAddressValid)
                throw new Error("Address is not valid");
            try {
                await chainLocal.notifier.notifyEVM(chain, address);
                return { success: true };
            }
            catch (error) {
                throw new Error("An error occured");
            }
        },
        async transferSft(from, to, nft, sender, receiver, amt, fee, mintWith) {
            if (Number(amt) > 50)
                throw new Error("Currenly more that 50 SFTs is not supported");
            let transfers = Array(parseInt(amt.toString())).fill(nft);
            if (!fee) {
                fee = await estimateFees(from, to, transfers[0], receiver);
                const deplFees = (await estimateWithContractDep(from, to, transfers[0]))
                    .calcContractDep;
                if (deplFees.gt(0)) {
                    fee = new bignumber_js_1.default(fee)
                        .plus(deplFees)
                        .integerValue(bignumber_js_1.default.ROUND_CEIL);
                }
            }
            const sftFees = await estimateSFTfees(from, amt, 0.05);
            const x = new bignumber_js_1.default(fee).plus(sftFees);
            console.log(x.toNumber());
            if (amt === BigInt(1)) {
                const response = this.transferNft(from, to, nft, sender, receiver, new bignumber_js_1.default(x).integerValue(), mintWith);
                return response;
            }
            else {
                const response = this.transferBatchNft(from, to, transfers, sender, receiver, new bignumber_js_1.default(x).integerValue(), mintWith);
                return response;
            }
            const response = this.transferBatchNft(from, to, transfers, sender, receiver, new bignumber_js_1.default(x).integerValue(), mintWith);
            return response;
        },
        async getDestinationTransaction(chain, targetNonce, txn) {
            const action = await chain.extractAction(txn);
            const hash = await txSocket.waitTxHash(targetNonce, action);
            const status = await chain.extractTxnStatus(hash);
            return [hash, status];
        },
        async pkeyToSigner(nonce, key) {
            switch (nonce) {
                case consts_1.Chain.ELROND: {
                    return out_1.UserSigner.fromPem(key);
                }
                case consts_1.Chain.TRON: {
                    return key;
                }
                case consts_1.Chain.ALGORAND: {
                    const algo = await inner(consts_1.Chain.ALGORAND);
                    const mnem = algosdk_1.default.secretKeyToMnemonic(js_base64_1.Base64.toUint8Array(key));
                    return (0, algorand_1.algoSignerWrapper)(algo.algod, algosdk_1.default.mnemonicToSecretKey(mnem));
                }
                default: {
                    const chainH = (await inner(nonce));
                    return chainH.createWallet(key);
                }
            }
        },
        estimateFees,
        estimateSFTfees,
        inner,
        bridgeStatus,
        updateParams(chainNonce, params) {
            helpers.delete(chainNonce);
            cToP.set(chainNonce, params);
        },
        async nftList(chain, owner) {
            if (chain.getNonce() === consts_1.Chain.TON) {
                console.log("decode for ton");
                owner = base64url_1.default.encode(owner);
            }
            let res = await nftlistRest.get(`/nfts/${chain.getNonce()}/${owner}`);
            if (res.headers["Retry-After"]) {
                await new Promise((r) => setTimeout(r, 30000));
                return await this.nftList(chain, owner);
            }
            return res.data.data;
        },
        transferNft: async (fromChain, toChain, nft, sender, receiver, fee, mintWith, gasLimit, extraFee, gasPrice) => {
            const fromNonce = fromChain.getNonce();
            const toNonce = toChain.getNonce();
            //@ts-ignore
            if (nft.native.contract) {
                if (![9, 18, 24, 31, 27, 26].includes(fromNonce)) {
                    try {
                        checkNotOldWrappedNft(
                        //@ts-ignore
                        ethers_1.utils.getAddress(nft.native.contract));
                    }
                    catch {
                        console.log("non evm nonce");
                    }
                }
            }
            if (appConfig.network === "mainnet") {
                await requireBridge([fromNonce, toNonce]);
            }
            if (!fee) {
                fee = await estimateFees(fromChain, toChain, nft, receiver, extraFee);
                const deplFees = (await estimateWithContractDep(fromChain, toChain, nft)).calcContractDep;
                if (deplFees.gt(0)) {
                    fee = new bignumber_js_1.default(fee)
                        .plus(deplFees)
                        .integerValue(bignumber_js_1.default.ROUND_CEIL);
                }
            }
            // if (!(await toChain.validateAddress(receiver))) {
            //   throw Error("invalid address");
            // }
            const { bool: unfreeze, wrapped } = await isWrappedNft(nft, fromNonce, toNonce);
            if (unfreeze) {
                await algoOptInCheck(nft, toChain, receiver, wrapped);
                const res = await fromChain.unfreezeWrappedNft(sender, receiver, nft, new bignumber_js_1.default(fee), String(toNonce), gasLimit, gasPrice);
                return res;
            }
            else {
                const mw = 
                /*//@ts-ignore contract is checked
                          "contract" in nft.native &&
                          mintWith &&
                          (await checkMintWith(
                              nft.collectionIdent,
                              mintWith,
                              toNonce,
                              fromNonce,
                              prepareTokenId(nft, fromNonce)
                          ))
                              ? mintWith
                              : */ mintWith ||
                    (0, utils_1.getDefaultContract)(nft, fromChain, toChain);
                console.log(`Minting With : ${mw}`);
                if (mw === undefined) {
                    throw new Error(`Mint with is not set`);
                }
                const res = await fromChain.transferNftToForeign(sender, toNonce, receiver, nft, new bignumber_js_1.default(fee), mw, gasLimit, gasPrice, cToP.get(toNonce));
                return res;
            }
        },
        mint: async (chain, owner, args) => {
            return await chain.mintNft(owner, args);
        },
        /**
         * Claim a transferred NFT
         * @param serialNumber The Serial Number of the claimable NFTs
         * @param contractAddress The MintWith HTS Proxy Contract used in the transfer
         * @param sender wallet of the sender
         * @returns txn response of the claimer
         */
        async claimHederaNFT(serialNumber, contractAddress, htsToken, sender) {
            const htscf = new hethers_1.ContractFactory(hts_abi_1.HEDERA_PROXY_ABI, hts_abi_1.HEDERA_PROXY_BC, sender);
            const hts_contract = htscf.attach(contractAddress);
            const cf = new hethers_1.ContractFactory(hts_abi_1.HEDERA_TOKEN_SERVICE_ABI, "0x", sender);
            const contract = cf.attach("0x0000000000000000000000000000000000000167");
            (await contract.associateToken(await sender.getAddress(), htsToken, {
                gasLimit: 1000000,
            })).wait();
            const res = await hts_contract.functions.claimNft(serialNumber, htsToken, {
                gasLimit: 1000000,
            });
            return res;
        },
        /**
         *  Returns all the claimable NFTs of the contract
         * @param proxyContract the address of the HTS Proxy contract that was used as mintWith in the transfer
         * @param sender wallet of the sender
         * @returns array of tokens that were minted
         */
        async listHederaClaimableNFT(proxyContract, htsToken, sender) {
            const cf = new hethers_1.ContractFactory(hts_abi_1.HEDERA_PROXY_ABI, hts_abi_1.HEDERA_PROXY_BC, sender);
            const contract = cf.attach(proxyContract);
            const tokens = await contract.functions.getClaimableNfts(await sender.getAddress(), htsToken, {
                gasLimit: 1000000,
            });
            return tokens[0];
        },
        waitAlgorandNft: async (origin, hash, claimer) => {
            const action = await origin.extractAction(hash);
            return await txSocket.waitAlgorandNft(origin.getNonce(), claimer.address, action);
        },
        claimableAlgorandNfts: async (claimer) => {
            const algo = await inner(consts_1.Chain.ALGORAND);
            return await algo.claimableNfts(txSocket, claimer);
        },
        async checkWhitelist(chain, nft) {
            if (!chain.isNftWhitelisted ||
                (await isWrappedNft(nft, chain.getNonce())).bool) {
                return true;
            }
            return await chain.isNftWhitelisted(nft);
        },
        isWrappedNft,
        setProvider,
    };
}
exports.ChainFactory = ChainFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFjdG9yeS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUF5RDtBQUt6RCwwQ0FBd0I7QUFDeEIsOENBQTRCO0FBRTVCLGdFQUFxQztBQUNyQywwQkFhWTtBQUVaLGtEQUFzRDtBQUN0RCxnREFBNkQ7QUFDN0Qsc0RBQThCO0FBQzlCLGtEQUEwQjtBQUMxQixtQ0FBdUM7QUFDdkMseUNBQW1DO0FBQ25DLHFEQUF3RDtBQUN4RCwyREFBNEQ7QUFDNUQsbURBQWdEO0FBQ2hELGtEQU02QjtBQWE3Qix1REFJbUM7QUFnQm5DLG1DQUtpQjtBQUNqQiwwREFBa0M7QUE4UmxDLFNBQVMsZ0JBQWdCLENBQUMsV0FBaUM7SUFDekQsTUFBTSxJQUFJLEdBQWEsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsY0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQUssQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsY0FBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFLLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQUssQ0FBQyxNQUFN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