/**
 * Web3 Implementation for cross chain traits
 * @module
 */
import BigNumber from "bignumber.js";
import { BalanceCheck, EstimateTxFeesBatch, FeeMargins, GetFeeMargins, GetProvider, IsContractAddress, MintNft, TransferNftForeign, TransferNftForeignBatch, UnfreezeForeignNft, UnfreezeForeignNftBatch, ParamsGetter } from "../chain";
import { ContractTransaction, ethers, PopulatedTransaction, providers, Signer, Wallet } from "ethers";
import { Provider, TransactionResponse } from "@ethersproject/providers";
import { Erc1155Minter, Erc1155Minter__factory, UserNftMinter, UserNftMinter__factory } from "xpnet-web3-contracts";
import { ChainNonceGet, EstimateTxFees, ExtractAction, ExtractTxnStatus, GetTokenURI, NftInfo, PreTransfer, PreTransferRawTxn, ValidateAddress, WhitelistCheck } from "../..";
import { ChainNonce } from "../../type-utils";
import { EvNotifier } from "../../services/notifier";
type HSDK = typeof import("@hashgraph/sdk");
/**
 * Information required to perform NFT transfers in this chain
 */
export type EthNftInfo = {
    chainId: string;
    tokenId: string;
    owner: string;
    uri: string;
    contract: string;
    contractType: "ERC721" | "ERC1155";
};
/**
 * Arguments required for minting a new nft
 *
 * contract: address of the sc
 * token: token ID of the newly minted nft
 * owner: Owner of the newly minted nft
 * uri: uri of the nft
 */
export type MintArgs = {
    contract: string;
    uri: string;
};
export interface IsApproved<Sender> {
    isApprovedForMinter(address: NftInfo<EthNftInfo>, sender: Sender, txFee: BigNumber, gasPrice?: ethers.BigNumber): Promise<boolean>;
}
export interface Approve<Sender> {
    approveForMinter(address: NftInfo<EthNftInfo>, sender: Sender, txFee: BigNumber, gasPrice?: ethers.BigNumber): Promise<string | undefined>;
}
type NullableCustomData = Record<string, any> | undefined;
/**
 * Base util traits
 */
export type BaseWeb3Helper = BalanceCheck & 
/**
 * Mint an nft in the given ERC1155 smart contract
 *
 * @argument signer  owner of the smart contract
 * @argument args  See [[MintArgs]]
 */ MintNft<Signer, MintArgs, ContractTransaction> & {
    /**
     * Deploy an ERC721 smart contract
     *
     * @argument owner  Owner of this smart contract
     * @returns Address of the deployed smart contract
     */
    deployErc721(owner: Signer): Promise<string>;
} & {
    mintNftErc1155(owner: Signer, options: MintArgs): Promise<ContractTransaction>;
};
type ExtraArgs = {
    gasPrice: ethers.BigNumber;
};
/**
 * Traits implemented by this module
 */
export type Web3Helper = BaseWeb3Helper & TransferNftForeign<Signer, EthNftInfo, TransactionResponse> & UnfreezeForeignNft<Signer, EthNftInfo, TransactionResponse> & TransferNftForeignBatch<Signer, EthNftInfo, TransactionResponse> & UnfreezeForeignNftBatch<Signer, EthNftInfo, TransactionResponse> & EstimateTxFees<EthNftInfo> & EstimateTxFeesBatch<EthNftInfo> & ChainNonceGet & IsApproved<Signer> & Approve<Signer> & ValidateAddress & ExtractAction<TransactionResponse> & {
    createWallet(privateKey: string): Wallet;
} & Pick<PreTransfer<Signer, EthNftInfo, string, ExtraArgs>, "preTransfer"> & PreTransferRawTxn<EthNftInfo, PopulatedTransaction> & ExtractTxnStatus & GetProvider<providers.Provider> & {
    XpNft: string;
    XpNft1155: string;
} & WhitelistCheck<EthNftInfo> & GetFeeMargins & IsContractAddress & GetTokenURI & ParamsGetter<Web3Params> & {
    injectSDK(sdk: HSDK): void;
} & {
    listHederaClaimableNFT(proxyContract: string, htsToken: string, signer: any): Promise<string>;
} & {
    claimNFT(token: string, htsToken: string, signer: any): Promise<boolean>;
} & {
    assosiateToken(token: string, signer: any): Promise<boolean>;
};
/**
 * Create an object implementing minimal utilities for a web3 chain
 *
 * @param provider An ethers.js provider object
 */
export declare function baseWeb3HelperFactory(provider: Provider, nonce: number): Promise<BaseWeb3Helper>;
/**
 * Create an object implementing cross chain utilities for a web3 chain
 *
 * @param provider  An ethers.js provider object
 * @param minter_addr  Address of the minter smart contract
 * @param minter_abi  ABI of the minter smart contract
 */
export interface Web3Params {
    provider: Provider;
    notifier: EvNotifier;
    minter_addr: string;
    erc721_addr: string;
    erc1155_addr: string;
    erc721Minter: string;
    erc1155Minter: string;
    nonce: ChainNonce;
    feeMargin: FeeMargins;
}
type NftMethodVal<T, Tx> = {
    freeze: "freezeErc1155" | "freezeErc721";
    validateUnfreeze: "validateUnfreezeErc1155" | "validateUnfreezeErc721";
    umt: typeof Erc1155Minter__factory | typeof UserNftMinter__factory;
    approved: (umt: T, sender: string, minterAddr: string, tok: string, customData: NullableCustomData) => Promise<boolean>;
    approve: (umt: T, forAddr: string, tok: string, txnUp: (tx: PopulatedTransaction) => Promise<void>, customData: NullableCustomData, gasPrice: ethers.BigNumberish | undefined, signer: any) => Promise<Tx>;
};
type EthNftMethodVal<T> = NftMethodVal<T, ContractTransaction>;
type NftMethodMap = Record<"ERC1155" | "ERC721", EthNftMethodVal<Erc1155Minter> | EthNftMethodVal<UserNftMinter>>;
export declare const NFT_METHOD_MAP: NftMethodMap;
export declare function web3HelperFactory(params: Web3Params & {
    api: string;
}): Promise<Web3Helper>;
export {};
//# sourceMappingURL=helper.d.ts.map