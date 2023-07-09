export type EvNotifier = ReturnType<typeof evNotifier>;
export declare function evNotifier(url: string): {
    getCollectionContract(collectionAddress: string, chainNonce: number): Promise<string>;
    createCollectionContract(collectionAddress: string, chainNonce: number, type: string): Promise<string>;
    notifyWeb3(fromChain: number, fromHash: string, actionId?: string, type?: string, toChain?: number, txFees?: string, senderAddress?: string, targetAddress?: string, nftUri?: string, tokenId?: string, contract?: string): Promise<void>;
    notifyTron(txHash: string): Promise<void>;
    notifyElrond(txHash: string, sender: string, uris: string[], action_id: string | undefined): Promise<void>;
    notifyTezos(txHash: string): Promise<void>;
    notifyAlgorand(txHash: string): Promise<void>;
    notifySecret(txHash: string, vk: string): Promise<void>;
    notifySolana(txHash: string): Promise<void>;
    notifyNear(txHash: string): Promise<void>;
    notifyDfinity(actionId: string): Promise<void>;
    notifyTon(txHash: string): Promise<void>;
    notifyAptos(txHash: string): Promise<void>;
    notifyEVM(nonce: number, address: string): Promise<void>;
    notifyCasper(txHash: string): Promise<void>;
};
//# sourceMappingURL=index.d.ts.map