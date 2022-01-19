"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
//@ts-ignore
const tronweb_1 = __importDefault(require("tronweb"));
const consts_1 = require("../consts");
const ethers_1 = require("ethers");
const taquito_1 = require("@taquito/taquito");
const EVM_VALIDATORS = [
    "0xadFF46B0064a490c1258506d91e4325A277B22aE",
    "0xa50d8208B15F5e79A1ceABdB4a3ED1866CEB764c",
    "0xa3F99eF33eDA9E54DbA4c04a6133c0c507bA4352",
    // '0xAC415a404b5275EF9B3E1808870d8393eCa843Ec',
    // '0xca2e73418bEbe203c9E88407f68C216CdCd60b38',
    // '0x2523d5F7E74A885c720085713a71389845A8F0D2',
    // '0xEBAC44f9e63988112Eb4AfE8B8E03e179b6429A6'
];
const EVM_TESTNET_VALIDATORS = ["0x63A0bC7286e80A3a46D5113e1C059e7a1e14e0fc"];
const middleware_uri = "https://notifierrest.herokuapp.com";
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    ChainFactoryConfigs.TestNet = () => ({
        elrondParams: {
            node_uri: consts_1.TestNetRpcUri.ELROND,
            minter_address: "erd1qqqqqqqqqqqqqpgq3cpmdjk5mwnvqqe7tswcwhdufsddjd4vk4as8qtp05",
            esdt_swap_address: "erd1qqqqqqqqqqqqqpgqsu5cn3h380l7cem86zfs6k904wnsa9hak4as942duy",
            esdt: "XPNET-acb2d0",
            esdt_nft: "XPNFT-1a124f",
            esdt_swap: "WEGLD-fdf787",
            validators: [
                "erd1akrlykhmjl8ykhfukhykzdvcnyay5d0kvdazc82wwt7cvn83arzsgg7w9c",
                "erd1dt2mttgf2xpdy9jlxlrd0fcr3nf4sly2tpmam0djq7jj65axvkyqv6hu20",
                "erd1hd3afqqhunypqdz292qledsxwtjlnf9t60mftf4xq5tuyutnqntqg5dng4",
                "erd14qgeqvr2lfnv7m3nzrmpzdzr5tecns50s82qndk2s84qhw3fg6vsfcaffa",
                "erd16gztcqtjzr20ytrwm2wefylydfxhgv7a96kwppa5z3840x4rvavqeazy0v",
                "erd19tydrsuwcpcnwku5p90xk3n82gxhmvz54s8fsvz6yhc4ugq67f4qaayrex",
                "erd1575jxqnmt9q495xtmre0gmxpc9gjzrcx9ypw7gls5xg59k0m73ksgp0xfu",
            ],
            nonce: 2,
        },
        tronParams: {
            provider: new tronweb_1.default({ fullHost: consts_1.TestNetRpcUri.TRON }),
            middleware_uri,
            erc1155_addr: "41b9bd4547c91cb23ba546bcdc958d4807e2179c7c",
            minter_addr: "41cecf8ffbed6433c1cae2fe196925109aebc726f2",
            erc721_addr: "41226a324faa855cf0e4774c682c9d772b72dd811e",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.TRON,
        },
        avalancheParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.AVALANCHE),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.AVALANCHE,
        },
        polygonParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.POLYGON),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.POLYGON,
        },
        fantomParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.FANTOM),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.FANTOM,
        },
        bscParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.BSC),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.BSC,
        },
        celoParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.CELO),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.CELO,
        },
        harmonyParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.HARMONY),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.HARMONY,
        },
        ropstenParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.ROPSTEN),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.ETHEREUM,
        },
        xDaiParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.XDAI),
            minter_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc1155_addr: "0x80653c90614155633252d32698164DBbBC421782",
            erc721_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.XDAI,
        },
        algorandParams: {
            algodApiKey: "e5b7d342b8a742be5e213540669b611bfd67465b754e7353eca8fd19b1efcffd",
            algodUri: "https://algorand-node.xp.network/",
            algoIndexer: "https://algoexplorerapi.io/idx2",
            nonce: consts_1.Chain.ALGORAND,
            sendNftAppId: 458971166,
            algodPort: 443,
        },
        uniqueParams: {
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.UNIQUE),
            nonce: consts_1.Chain.UNIQUE,
            erc1155_addr: "0x9cdda01E00A5A425143F952ee894ff99B5F7999F",
            erc721_addr: "0xeBCDdF17898bFFE81BCb3182833ba44f4dB25525",
            minter_addr: "0x8CEe805FE5FA49e81266fcbC27F37D85062c1707",
            validators: EVM_TESTNET_VALIDATORS,
            middleware_uri,
        },
        tezosParams: {
            bridgeAddress: "KT1MRYxBimYh1PUt3LBhEAmvr7YMK2L7kqCL",
            middlewareUri: middleware_uri,
            Tezos: new taquito_1.TezosToolkit(consts_1.TestNetRpcUri.TEZOS),
            xpnftAddress: "KT1F7THd96y39MYKkTXmLyWkDZQ3H6QgubLh",
            validators: [
                "tz1e4QByQTYQyj98cBiM42hejkMWB2Pg6iXg",
                "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
            ],
        },
        velasParams: {
            middleware_uri,
            erc1155_addr: "0x9a287810bA8F0564DaDd9F2Ea9B7B2459497416B",
            erc721_addr: "0x80653c90614155633252d32698164DBbBC421782",
            minter_addr: "0x3F51015C76D7A64514E9B86D500bBFD44F95bdE9",
            validators: EVM_TESTNET_VALIDATORS,
            nonce: consts_1.Chain.VELAS,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.TestNetRpcUri.VELAS),
        },
    });
    ChainFactoryConfigs.MainNet = () => ({
        elrondParams: {
            node_uri: consts_1.MainNetRpcUri.ELROND,
            minter_address: "erd1qqqqqqqqqqqqqpgq98ufyktqukxqw79f7n22sr3u6n05u7d7p7tqmzhv32",
            esdt_swap_address: "erd1qqqqqqqqqqqqqpgqgc9vfqcdqw0ucu602elf0lt4tysfmxpep7tqhrrr9x",
            esdt: "XPNET-738176",
            esdt_nft: "XPNFT-676422",
            esdt_swap: "WEGLD-071de0",
            validators: [
                "erd1lwyjz0adjd3vqpcjqs5rntw6sxzf9pvqussadygy2u76mz9ap7tquc0z5s",
                "erd1tzc9qltpntlgnpetrz58llqsg93dnxety54umln0kuq2k6dajf6qk796wh",
                "erd14aw3kvmepsffajkywp6autxxf7zy77uvnhy9e93wwz4qjkd88muquys007",
                "erd1nj85l5qx2gn2euj4hnjzq464euwzh8fe6txkf046nttne7y3cl4qmndgya",
                "erd1fl3mpjnrev7x5dz4un0hpzhvny4dlv4d2zt38yhqe37u9ulzx2aqeqr8sr",
                "erd16kufez3g0tmxhyra2ysgpkqckurqe80ulxet8dfffm0t28tnavpstr0s93",
                "erd1wua3q7zja2g08gyta4pkd4eax2r03c3edsz72dp90m3z69rk8yuqqnrg63",
            ],
            nonce: consts_1.Chain.ELROND,
        },
        tronParams: {
            provider: new tronweb_1.default({ fullHost: consts_1.MainNetRpcUri.TRON }),
            middleware_uri,
            erc1155_addr: "TSg3nSjuSuVf5vEk6f2WwM9Ph8bEaNNz9B",
            minter_addr: "TMx1nCzbK7tbBinLh29CewahpbR1k64c8E",
            erc721_addr: "TRON",
            nonce: consts_1.Chain.TRON,
            validators: EVM_VALIDATORS,
        },
        avalancheParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.AVALANCHE),
            minter_addr: "0x5B916EFb0e7bc0d8DdBf2d6A9A7850FdAb1984C4",
            erc1155_addr: "0xe12B16FFBf7D79eb72016102F3e3Ae6fe03fCA56",
            erc721_addr: "0xe12B16FFBf7D79eb72016102F3e3Ae6fe03fCA56",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.AVALANCHE,
        },
        polygonParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.POLYGON),
            minter_addr: "0x2f072879411503580B8974A221bf76638C50a82a",
            erc1155_addr: "0xc69ECD37122A9b5FD7e62bC229d478BB83063C9d",
            erc721_addr: "0xc69ECD37122A9b5FD7e62bC229d478BB83063C9d",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.POLYGON,
        },
        fantomParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.FANTOM),
            minter_addr: "0x5B916EFb0e7bc0d8DdBf2d6A9A7850FdAb1984C4",
            erc1155_addr: "0xe12B16FFBf7D79eb72016102F3e3Ae6fe03fCA56",
            erc721_addr: "0xe12B16FFBf7D79eb72016102F3e3Ae6fe03fCA56",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.FANTOM,
        },
        bscParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.BSC),
            minter_addr: "0xF8679A16858cB7d21b3aF6b2AA1d6818876D3741",
            erc1155_addr: "0xa1B8947Ff4C1fD992561F629cfE67aEb90DfcBd5",
            erc721_addr: "0xa1B8947Ff4C1fD992561F629cfE67aEb90DfcBd5",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.BSC,
        },
        celoParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.CELO),
            minter_addr: "string",
            erc1155_addr: "string",
            erc721_addr: "string",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.CELO,
        },
        harmonyParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.HARMONY),
            minter_addr: "string",
            erc1155_addr: "string",
            erc721_addr: "string",
            validators: [],
            nonce: consts_1.Chain.HARMONY,
        },
        ropstenParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.ETHEREUM),
            minter_addr: "0x8B2957DbDC69E158aFceB9822A2ff9F2dd5BcD65",
            erc1155_addr: "0x09F4e56187541f2bC660B0810cA509D2f8c65c96",
            erc721_addr: "0x09F4e56187541f2bC660B0810cA509D2f8c65c96",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.ETHEREUM,
        },
        xDaiParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.XDAI),
            minter_addr: "0x14fb9d669d4ddf712f1c56Ba7C54FF82D9be6377",
            erc1155_addr: "0x8B2957DbDC69E158aFceB9822A2ff9F2dd5BcD65",
            erc721_addr: "0x8B2957DbDC69E158aFceB9822A2ff9F2dd5BcD65",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.XDAI,
        },
        algorandParams: {
            algodApiKey: "e5b7d342b8a742be5e213540669b611bfd67465b754e7353eca8fd19b1efcffd",
            algodUri: "https://algorand-node.xp.network/",
            nonce: consts_1.Chain.ALGORAND,
            sendNftAppId: 458971166,
            algodPort: 443,
        },
        fuseParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.FUSE),
            minter_addr: "0xb4A252B3b24AF2cA83fcfdd6c7Fac04Ff9d45A7D",
            erc1155_addr: "0xAcE819D882CEEF314191DaD13D2Bf3731Df80988",
            erc721_addr: "0xE773Be36b35e7B58a9b23007057b5e2D4f6686a1",
            validators: EVM_VALIDATORS,
            nonce: consts_1.Chain.FUSE,
        },
        tezosParams: {
            bridgeAddress: "KT1Lrn7Zymy29CAAxsf5SGAULo9ecSHZTczY",
            middlewareUri: middleware_uri,
            Tezos: new taquito_1.TezosToolkit(consts_1.MainNetRpcUri.TEZOS),
            xpnftAddress: "KT1EhmjL3Mau41gn8jCBvnwfMiy3eunfHHBc",
            validators: [
                "tz1bxXSUcu1PqceWBw1zwc4zMRQuSLpbQ5VX",
                "tz1VBF2LXnnnqKqKmTQqdESGx91kVLKyZMv4",
                "tz1hMBJzUouzXYRk3mpdVi2QHY2gP594Kk2G",
            ]
        },
        velasParams: {
            middleware_uri,
            provider: new ethers_1.ethers.providers.JsonRpcProvider(consts_1.MainNetRpcUri.VELAS),
            minter_addr: "0x2f156D07376476f799166964bb62598882744ce5",
            erc1155_addr: "0xb83448C460197E2F591eAA3FC6Be2c4fF88d9e9C",
            erc721_addr: "0xFC2b3dB912fcD8891483eD79BA31b8E5707676C9",
            nonce: consts_1.Chain.VELAS,
            validators: EVM_VALIDATORS,
        },
    });
})(ChainFactoryConfigs = exports.ChainFactoryConfigs || (exports.ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvZmFjdG9yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLFlBQVk7QUFDWixzREFBOEI7QUFDOUIsc0NBQWdFO0FBQ2hFLG1DQUFnQztBQUNoQyw4Q0FBZ0Q7QUFFaEQsTUFBTSxjQUFjLEdBQUc7SUFDckIsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMsZ0RBQWdEO0lBQ2hELGdEQUFnRDtJQUNoRCxnREFBZ0Q7SUFDaEQsK0NBQStDO0NBQ2hELENBQUM7QUFFRixNQUFNLHNCQUFzQixHQUFHLENBQUMsNENBQTRDLENBQUMsQ0FBQztBQUU5RSxNQUFNLGNBQWMsR0FBRyxvQ0FBb0MsQ0FBQztBQUU1RCxJQUFpQixtQkFBbUIsQ0EyUm5DO0FBM1JELFdBQWlCLG1CQUFtQjtJQUNyQiwyQkFBTyxHQUErQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELFlBQVksRUFBRTtZQUNaLFFBQVEsRUFBRSxzQkFBYSxDQUFDLE1BQU07WUFDOUIsY0FBYyxFQUNaLGdFQUFnRTtZQUNsRSxpQkFBaUIsRUFDZixnRUFBZ0U7WUFDbEUsSUFBSSxFQUFFLGNBQWM7WUFDcEIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsU0FBUyxFQUFFLGNBQWM7WUFDekIsVUFBVSxFQUFFO2dCQUNWLGdFQUFnRTtnQkFDaEUsZ0VBQWdFO2dCQUNoRSxnRUFBZ0U7Z0JBQ2hFLGdFQUFnRTtnQkFDaEUsZ0VBQWdFO2dCQUNoRSxnRUFBZ0U7Z0JBQ2hFLGdFQUFnRTthQUNqRTtZQUNELEtBQUssRUFBRSxDQUFDO1NBQ1Q7UUFDRCxVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkQsY0FBYztZQUNkLFlBQVksRUFBRSw0Q0FBNEM7WUFDMUQsV0FB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