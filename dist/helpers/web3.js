"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3HelperFactory = exports.NFT_METHOD_MAP = exports.baseWeb3HelperFactory = void 0;
/**
 * Web3 Implementation for cross chain traits
 * @module
 */
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const xpnet_web3_contracts_1 = require("xpnet-web3-contracts");
const __1 = require("..");
/**
 * Create an object implementing minimal utilities for a web3 chain
 *
 * @param provider An ethers.js provider object
 */
async function baseWeb3HelperFactory(provider) {
    const w3 = provider;
    return {
        async balance(address) {
            const bal = await w3.getBalance(address);
            // ethers BigNumber is not compatible with our bignumber
            return new bignumber_js_1.default(bal.toString());
        },
        async deployErc721(owner) {
            const factory = new xpnet_web3_contracts_1.UserNftMinter__factory(owner);
            const contract = await factory.deploy();
            return contract.address;
        },
        async mintNft(owner, { contract, uris }) {
            const erc721 = xpnet_web3_contracts_1.UserNftMinter__factory.connect(contract, owner);
            const txm = await erc721.mint(uris[0]);
            const receipt = await txm.wait();
            return receipt.transactionHash;
        },
    };
}
exports.baseWeb3HelperFactory = baseWeb3HelperFactory;
exports.NFT_METHOD_MAP = {
    ERC1155: {
        freeze: "freezeErc1155",
        validateUnfreeze: "validateUnfreezeErc1155",
        umt: xpnet_web3_contracts_1.Erc1155Minter__factory,
        approved: (umt, sender, minterAddr) => {
            return umt.isApprovedForAll(sender, minterAddr);
        },
        approve: (umt, forAddr) => {
            return umt.setApprovalForAll(forAddr, true);
        },
    },
    ERC721: {
        freeze: "freezeErc721",
        validateUnfreeze: "validateUnfreezeErc721",
        umt: xpnet_web3_contracts_1.UserNftMinter__factory,
        approved: async (umt, _, minterAddr, tok) => {
            return (await umt.getApproved(tok)) == minterAddr;
        },
        approve: (umt, forAddr, tok) => {
            return umt.approve(forAddr, tok);
        },
    },
};
async function web3HelperFactory(params) {
    const w3 = params.provider;
    const { minter_addr, provider } = params;
    const minter = xpnet_web3_contracts_1.Minter__factory.connect(minter_addr, provider);
    async function notifyValidator(hash) {
        await params.notifier.notifyWeb3(params.nonce, hash);
    }
    async function extractAction(txr) {
        const receipt = await txr.wait();
        const log = receipt.logs.find((log) => log.address === minter.address);
        if (log === undefined) {
            throw Error("Couldn't extract action_id");
        }
        const evdat = minter.interface.parseLog(log);
        const action_id = evdat.args[0].toString();
        return action_id;
    }
    const isApprovedForMinter = async (id, signer) => {
        const erc = exports.NFT_METHOD_MAP[id.native.contractType].umt.connect(id.native.contract, signer);
        return await exports.NFT_METHOD_MAP[id.native.contractType].approved(erc, await signer.getAddress(), minter_addr, id.native.tokenId);
    };
    const approveForMinter = async (id, sender) => {
        const isApproved = await isApprovedForMinter(id, sender);
        if (isApproved) {
            return undefined;
        }
        const erc = exports.NFT_METHOD_MAP[id.native.contractType].umt.connect(id.native.contract, sender);
        const receipt = await exports.NFT_METHOD_MAP[id.native.contractType].approve(erc, minter_addr, id.native.tokenId);
        await receipt.wait();
        return receipt.hash;
    };
    const base = await baseWeb3HelperFactory(params.provider);
    return Object.assign(Object.assign({}, base), { XpNft: params.erc721_addr, approveForMinter, getProvider: () => provider, async estimateValidateUnfreezeNft(_to, _id, _mW) {
            const gas = await provider.getGasPrice();
            return new bignumber_js_1.default(gas.mul(150000).toString());
        },
        isApprovedForMinter, preTransfer: (s, id, _fee) => approveForMinter(id, s), extractAction, getNonce: () => params.nonce, async preTransferRawTxn(id, address, _value) {
            const isApproved = await isApprovedForMinter(id, new ethers_1.VoidSigner(address, provider));
            if (isApproved) {
                return undefined;
            }
            const erc = xpnet_web3_contracts_1.UserNftMinter__factory.connect(id.native.contract, new ethers_1.VoidSigner(address, provider));
            const approvetxn = await erc.populateTransaction.approve(minter_addr, id.native.tokenId);
            return approvetxn;
        },
        async extractTxnStatus(txn) {
            const status = (await (await provider.getTransaction(txn)).wait()).status;
            if (status === undefined) {
                return __1.TransactionStatus.PENDING;
            }
            if (status === 1) {
                return __1.TransactionStatus.SUCCESS;
            }
            else if (status === 0) {
                return __1.TransactionStatus.FAILURE;
            }
            return __1.TransactionStatus.UNKNOWN;
        },
        async unfreezeWrappedNftBatch(signer, chainNonce, to, nfts, txFees) {
            const res = await minter.connect(signer).withdrawNftBatch(to, chainNonce, nfts.map((nft) => nft.native.tokenId), new Array(nfts.length).fill(1), nfts[0].native.contract, {
                value: ethers_1.BigNumber.from(txFees.toString()),
            });
            await notifyValidator(res.hash);
            return res;
        },
        async transferNftBatchToForeign(signer, chainNonce, to, nfts, mintWith, txFees) {
            const res = await minter.connect(signer).freezeErc1155Batch(nfts[0].native.contract, nfts.map((nft) => nft.native.tokenId), new Array(nfts.length).fill(1), chainNonce, to, mintWith, {
                value: ethers_1.BigNumber.from(txFees.toString()),
            });
            await notifyValidator(res.hash);
            return res;
        },
        async estimateValidateTransferNftBatch(_to, nfts, _mintWith) {
            const gasPrice = await w3.getGasPrice();
            const gas = 40000 + 60000 * nfts.length;
            return new bignumber_js_1.default(gasPrice.mul(gas).toString());
        },
        async estimateValidateUnfreezeNftBatch(_to, nfts) {
            const gasPrice = await w3.getGasPrice();
            const gas = 40000 + 60000 * nfts.length;
            return new bignumber_js_1.default(gasPrice.mul(gas).toString());
        },
        createWallet(privateKey) {
            return new ethers_1.Wallet(privateKey, provider);
        },
        async transferNftToForeign(sender, chain_nonce, to, id, txFees, mintWith) {
            await approveForMinter(id, sender);
            const method = exports.NFT_METHOD_MAP[id.native.contractType].freeze;
            const txr = await minter
                .connect(sender)[method](id.native.contract, id.native.tokenId, chain_nonce, to, mintWith, {
                value: ethers_1.BigNumber.from(txFees.toString(10)),
            });
            await notifyValidator(txr.hash);
            return txr;
        },
        async unfreezeWrappedNft(sender, to, id, txFees, nonce) {
            const res = await minter
                .connect(sender)
                .withdrawNft(to, nonce, id.native.tokenId, id.native.contract, {
                value: ethers_1.BigNumber.from(txFees.toString(10)),
            });
            await notifyValidator(res.hash);
            return res;
        },
        async estimateValidateTransferNft(_to, _nftUri, _mintWith) {
            const gas = await provider.getGasPrice();
            return new bignumber_js_1.default(gas.mul(150000).toString());
        },
        validateAddress(adr) {
            return Promise.resolve(ethers_1.ethers.utils.isAddress(adr));
        },
        isNftWhitelisted(nft) {
            return minter.nftWhitelist(nft.native.contract);
        } });
}
exports.web3HelperFactory = web3HelperFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3dlYjMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsZ0VBQXFDO0FBV3JDLG1DQVNnQjtBQUVoQiwrREFNOEI7QUFDOUIsMEJBV1k7QUFzR1o7Ozs7R0FJRztBQUNJLEtBQUssVUFBVSxxQkFBcUIsQ0FDekMsUUFBa0I7SUFFbEIsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBRXBCLE9BQU87UUFDTCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQWU7WUFDM0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpDLHdEQUF3RDtZQUN4RCxPQUFPLElBQUksc0JBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFhO1lBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksNkNBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFeEMsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQzFCLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUNYLEtBQWEsRUFDYixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQWU7WUFFL0IsTUFBTSxNQUFNLEdBQUcsNkNBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVoRSxNQUFNLEdBQUcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakMsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFD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