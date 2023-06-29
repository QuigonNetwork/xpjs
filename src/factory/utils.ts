import { NftInfo, FullChain } from "..";
import { CHAIN_INFO, ChainType, Chain } from "../consts";

export const _headers = {
  "Content-Type": "application/json",
  Accept: "*/*",
};

export const oldXpWraps = new Set([
  "0xe12B16FFBf7D79eb72016102F3e3Ae6fe03fCA56",
  "0xc69ECD37122A9b5FD7e62bC229d478BB83063C9d",
  "0xe12B16FFBf7D79eb72016102F3e3Ae6fe03fCA56",
  "0xa1B8947Ff4C1fD992561F629cfE67aEb90DfcBd5",
  "0x09F4e56187541f2bC660B0810cA509D2f8c65c96",
  "0x8B2957DbDC69E158aFceB9822A2ff9F2dd5BcD65",
  "0xE773Be36b35e7B58a9b23007057b5e2D4f6686a1",
  "0xFC2b3dB912fcD8891483eD79BA31b8E5707676C9",
  "0xb4A252B3b24AF2cA83fcfdd6c7Fac04Ff9d45A7D",
]);

export function checkBlockedContracts(to: any, contract: string) {
  const chain = CHAIN_INFO.get(to);
  if (chain?.rejectUnfreeze && chain?.rejectUnfreeze.includes(contract)) {
    throw new Error(
      `Transfering to ${chain.name} is prohibited by the NFT project team`
    );
  }
}

export function getDefaultContract<SignerT, RawNftF, Resp, RawNftT>(
  nft: NftInfo<RawNftF>,
  fromChain: FullChain<SignerT, RawNftT, Resp>,
  toChain: FullChain<SignerT, RawNftT, Resp>
): string | undefined {
  const defaultMintError = new Error(
    `Transfer has been canceled. The NFT you are trying to send will be minted with a default NFT collection`
  );

  const from = fromChain.getNonce();
  const to = toChain.getNonce();

  const fromType = CHAIN_INFO.get(from)?.type;
  const toType = CHAIN_INFO.get(to)?.type;

  const contract =
    //@ts-ignore contractType is checked
    "contractType" in nft.native &&
    //@ts-ignore contractType is checked
    nft.native.contractType === "ERC1155" &&
    toChain.XpNft1155
      ? toChain.XpNft1155
      : toChain.XpNft;

  if (
    typeof window !== "undefined" &&
    (/(allowDefaultMint=true)/.test(window.location.search) ||
      /testnet/.test(window.location.pathname))
  ) {
    return contract;
  }

  if (
    (from === Chain.VECHAIN && toType === ChainType.EVM) ||
    (to === Chain.VECHAIN && fromType === ChainType.EVM)
  ) {
    throw defaultMintError;
  }

  if (
    (fromType === ChainType.EVM && toType === ChainType.ELROND) ||
    (fromType === ChainType.ELROND && toType === ChainType.EVM)
  ) {
    throw defaultMintError;
  }

  //   if (
  //     (fromType === ChainType.EVM && toType === ChainType.TEZOS) ||
  //     (fromType === ChainType.TEZOS && toType === ChainType.EVM)
  //   ) {
  //     throw defaultMintError;
  //   }

  if (from === Chain.SECRET) {
    throw defaultMintError;
  }

  if (fromType === ChainType.TRON) {
    throw defaultMintError;
  }

  return contract;
}

export function prepareTokenId(nft: NftInfo<any>, from: number) {
  const tokenId =
    //@ts-ignore
    nft.native && "tokenId" in nft.native && nft.native.tokenId.toString();

  if (tokenId) {
    const notNumber = isNaN(Number(tokenId));

    if (notNumber) {
      if (from === Chain.ELROND) {
        if (nft.native.nonce) return String(nft.native.nonce);
        const hex = tokenId.split("-")?.at(2);
        return String(hex ? parseInt(hex, 16) : "");
      }

      if (from === Chain.TON || from === Chain.SECRET) {
        return "1";
      }
    } else {
      return tokenId;
    }
  }
  return undefined;
}