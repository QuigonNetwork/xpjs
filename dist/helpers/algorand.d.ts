import algosdk from "algosdk";
import { BigNumber } from "bignumber.js";
import { AlgoNft } from "xpnet-nft-list";
import { AlgorandSocketHelper, ChainNonceGet, EstimateTxFees, TransferNftForeign, UnfreezeForeignNft, ValidateAddress, WrappedNftCheck } from "..";
declare type TxResp = {
    txId: string;
};
declare type SignedTxn = {
    txID: string;
    blob: string;
};
declare type Ledger = "MainNet" | "TestNet" | "any";
declare type BrowserSigner = {
    accounts(args: {
        ledger: Ledger;
    }): Promise<{
        address: string;
    }[]>;
    signTxn(transactions: {
        txn: string;
    }[]): Promise<SignedTxn[]>;
    send(info: {
        ledger: Ledger;
        tx: string;
    }): Promise<TxResp>;
};
export declare type ClaimNftInfo = {
    appId: number;
    nftId: number;
};
/**
 * Selected address & ledger must be given explicitly
 */
export declare type AlgoSignerH = {
    readonly algoSigner: BrowserSigner;
    readonly address: string;
    readonly ledger: Ledger;
};
/**
 * This library is written in typescript.
 * unfortunately the browser extension injects the AlgoSigner in a way we can't get a typed object wwithout this hack.
 *
 * @return Strongly typed AlgoSigner from extension
 */
export declare function typedAlgoSigner(): BrowserSigner;
export declare function algoSignerWrapper(algod: algosdk.Algodv2, acc: algosdk.Account): AlgoSignerH;
export interface ClaimAlgorandNft {
    claimAlgorandNft(signer: AlgoSignerH, actionId: string, socket: AlgorandSocketHelper): Promise<string>;
}
export declare type AlgorandHelper = ChainNonceGet & WrappedNftCheck<AlgoNft> & TransferNftForeign<AlgoSignerH, string, BigNumber, AlgoNft, string> & UnfreezeForeignNft<AlgoSignerH, string, BigNumber, AlgoNft, string> & EstimateTxFees<BigNumber> & ValidateAddress & {
    claimNft(claimer: AlgoSignerH, info: ClaimNftInfo): Promise<string>;
} & {
    algod: algosdk.Algodv2;
} & ClaimAlgorandNft;
export declare type AlgorandArgs = {
    algodApiKey: string;
    algodUri: string;
    algodPort: number | undefined;
    sendNftAppId: number;
    nonce: number;
};
export declare function algorandHelper(args: AlgorandArgs): AlgorandHelper;
export {};
