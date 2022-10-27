export const HEDERA_TOKEN_SERVICE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "serialNumber",
        type: "uint256",
      },
    ],
    name: "approveNFT",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "associateToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "associateTokens",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
      {
        internalType: "int64[]",
        name: "serialNumbers",
        type: "int64[]",
      },
    ],
    name: "burnToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "uint64",
        name: "newTotalSupply",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "bool",
            name: "tokenSupplyType",
            type: "bool",
          },
          {
            internalType: "int64",
            name: "maxSupply",
            type: "int64",
          },
          {
            internalType: "bool",
            name: "freezeDefault",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "keyType",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "inheritAccountKey",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "contractId",
                    type: "address",
                  },
                  {
                    internalType: "bytes",
                    name: "ed25519",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "ECDSA_secp256k1",
                    type: "bytes",
                  },
                  {
                    internalType: "address",
                    name: "delegatableContractId",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.KeyValue",
                name: "key",
                type: "tuple",
              },
            ],
            internalType: "struct IHederaTokenService.TokenKey[]",
            name: "tokenKeys",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "second",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "autoRenewAccount",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "autoRenewPeriod",
                type: "uint32",
              },
            ],
            internalType: "struct IHederaTokenService.Expiry",
            name: "expiry",
            type: "tuple",
          },
        ],
        internalType: "struct IHederaTokenService.HederaToken",
        name: "token",
        type: "tuple",
      },
      {
        internalType: "uint64",
        name: "initialTotalSupply",
        type: "uint64",
      },
      {
        internalType: "uint32",
        name: "decimals",
        type: "uint32",
      },
    ],
    name: "createFungibleToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "bool",
            name: "tokenSupplyType",
            type: "bool",
          },
          {
            internalType: "int64",
            name: "maxSupply",
            type: "int64",
          },
          {
            internalType: "bool",
            name: "freezeDefault",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "keyType",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "inheritAccountKey",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "contractId",
                    type: "address",
                  },
                  {
                    internalType: "bytes",
                    name: "ed25519",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "ECDSA_secp256k1",
                    type: "bytes",
                  },
                  {
                    internalType: "address",
                    name: "delegatableContractId",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.KeyValue",
                name: "key",
                type: "tuple",
              },
            ],
            internalType: "struct IHederaTokenService.TokenKey[]",
            name: "tokenKeys",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "second",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "autoRenewAccount",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "autoRenewPeriod",
                type: "uint32",
              },
            ],
            internalType: "struct IHederaTokenService.Expiry",
            name: "expiry",
            type: "tuple",
          },
        ],
        internalType: "struct IHederaTokenService.HederaToken",
        name: "token",
        type: "tuple",
      },
      {
        internalType: "uint64",
        name: "initialTotalSupply",
        type: "uint64",
      },
      {
        internalType: "uint32",
        name: "decimals",
        type: "uint32",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "amount",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "tokenId",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useHbarsForPayment",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "useCurrentTokenForPayment",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.FixedFee[]",
        name: "fixedFees",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "numerator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "denominator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minimumAmount",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maximumAmount",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "netOfTransfers",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.FractionalFee[]",
        name: "fractionalFees",
        type: "tuple[]",
      },
    ],
    name: "createFungibleTokenWithCustomFees",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "bool",
            name: "tokenSupplyType",
            type: "bool",
          },
          {
            internalType: "int64",
            name: "maxSupply",
            type: "int64",
          },
          {
            internalType: "bool",
            name: "freezeDefault",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "keyType",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "inheritAccountKey",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "contractId",
                    type: "address",
                  },
                  {
                    internalType: "bytes",
                    name: "ed25519",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "ECDSA_secp256k1",
                    type: "bytes",
                  },
                  {
                    internalType: "address",
                    name: "delegatableContractId",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.KeyValue",
                name: "key",
                type: "tuple",
              },
            ],
            internalType: "struct IHederaTokenService.TokenKey[]",
            name: "tokenKeys",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "second",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "autoRenewAccount",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "autoRenewPeriod",
                type: "uint32",
              },
            ],
            internalType: "struct IHederaTokenService.Expiry",
            name: "expiry",
            type: "tuple",
          },
        ],
        internalType: "struct IHederaTokenService.HederaToken",
        name: "token",
        type: "tuple",
      },
    ],
    name: "createNonFungibleToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "bool",
            name: "tokenSupplyType",
            type: "bool",
          },
          {
            internalType: "int64",
            name: "maxSupply",
            type: "int64",
          },
          {
            internalType: "bool",
            name: "freezeDefault",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "keyType",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "inheritAccountKey",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "contractId",
                    type: "address",
                  },
                  {
                    internalType: "bytes",
                    name: "ed25519",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "ECDSA_secp256k1",
                    type: "bytes",
                  },
                  {
                    internalType: "address",
                    name: "delegatableContractId",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.KeyValue",
                name: "key",
                type: "tuple",
              },
            ],
            internalType: "struct IHederaTokenService.TokenKey[]",
            name: "tokenKeys",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "second",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "autoRenewAccount",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "autoRenewPeriod",
                type: "uint32",
              },
            ],
            internalType: "struct IHederaTokenService.Expiry",
            name: "expiry",
            type: "tuple",
          },
        ],
        internalType: "struct IHederaTokenService.HederaToken",
        name: "token",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "amount",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "tokenId",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useHbarsForPayment",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "useCurrentTokenForPayment",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.FixedFee[]",
        name: "fixedFees",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "numerator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "denominator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "amount",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "tokenId",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useHbarsForPayment",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.RoyaltyFee[]",
        name: "royaltyFees",
        type: "tuple[]",
      },
    ],
    name: "createNonFungibleTokenWithCustomFees",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            components: [
              {
                internalType: "address",
                name: "accountID",
                type: "address",
              },
              {
                internalType: "int64",
                name: "amount",
                type: "int64",
              },
            ],
            internalType: "struct IHederaTokenService.AccountAmount[]",
            name: "transfers",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "senderAccountID",
                type: "address",
              },
              {
                internalType: "address",
                name: "receiverAccountID",
                type: "address",
              },
              {
                internalType: "int64",
                name: "serialNumber",
                type: "int64",
              },
            ],
            internalType: "struct IHederaTokenService.NftTransfer[]",
            name: "nftTransfers",
            type: "tuple[]",
          },
        ],
        internalType: "struct IHederaTokenService.TokenTransferList[]",
        name: "tokenTransfers",
        type: "tuple[]",
      },
    ],
    name: "cryptoTransfer",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "deleteToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "dissociateToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "dissociateTokens",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "freezeToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "serialNumber",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "address",
        name: "approved",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getFungibleTokenInfo",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "symbol",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "treasury",
                    type: "address",
                  },
                  {
                    internalType: "string",
                    name: "memo",
                    type: "string",
                  },
                  {
                    internalType: "bool",
                    name: "tokenSupplyType",
                    type: "bool",
                  },
                  {
                    internalType: "int64",
                    name: "maxSupply",
                    type: "int64",
                  },
                  {
                    internalType: "bool",
                    name: "freezeDefault",
                    type: "bool",
                  },
                  {
                    components: [
                      {
                        internalType: "uint256",
                        name: "keyType",
                        type: "uint256",
                      },
                      {
                        components: [
                          {
                            internalType: "bool",
                            name: "inheritAccountKey",
                            type: "bool",
                          },
                          {
                            internalType: "address",
                            name: "contractId",
                            type: "address",
                          },
                          {
                            internalType: "bytes",
                            name: "ed25519",
                            type: "bytes",
                          },
                          {
                            internalType: "bytes",
                            name: "ECDSA_secp256k1",
                            type: "bytes",
                          },
                          {
                            internalType: "address",
                            name: "delegatableContractId",
                            type: "address",
                          },
                        ],
                        internalType: "struct IHederaTokenService.KeyValue",
                        name: "key",
                        type: "tuple",
                      },
                    ],
                    internalType: "struct IHederaTokenService.TokenKey[]",
                    name: "tokenKeys",
                    type: "tuple[]",
                  },
                  {
                    components: [
                      {
                        internalType: "uint32",
                        name: "second",
                        type: "uint32",
                      },
                      {
                        internalType: "address",
                        name: "autoRenewAccount",
                        type: "address",
                      },
                      {
                        internalType: "uint32",
                        name: "autoRenewPeriod",
                        type: "uint32",
                      },
                    ],
                    internalType: "struct IHederaTokenService.Expiry",
                    name: "expiry",
                    type: "tuple",
                  },
                ],
                internalType: "struct IHederaTokenService.HederaToken",
                name: "hedera",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "amount",
                    type: "uint32",
                  },
                  {
                    internalType: "address",
                    name: "tokenId",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "useHbarsForPayment",
                    type: "bool",
                  },
                  {
                    internalType: "bool",
                    name: "useCurrentTokenForPayment",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "feeCollector",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.FixedFee[]",
                name: "fixedFees",
                type: "tuple[]",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "numerator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "denominator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "minimumAmount",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "maximumAmount",
                    type: "uint32",
                  },
                  {
                    internalType: "bool",
                    name: "netOfTransfers",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "feeCollector",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.FractionalFee[]",
                name: "fractionalFees",
                type: "tuple[]",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "numerator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "denominator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "amount",
                    type: "uint32",
                  },
                  {
                    internalType: "address",
                    name: "tokenId",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "useHbarsForPayment",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "feeCollector",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.RoyaltyFee[]",
                name: "royaltyFees",
                type: "tuple[]",
              },
              {
                internalType: "bool",
                name: "defaultKycStatus",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "deleted",
                type: "bool",
              },
              {
                internalType: "string",
                name: "ledgerId",
                type: "string",
              },
              {
                internalType: "bool",
                name: "pauseStatus",
                type: "bool",
              },
              {
                internalType: "uint64",
                name: "totalSupply",
                type: "uint64",
              },
            ],
            internalType: "struct IHederaTokenService.TokenInfo",
            name: "tokenInfo",
            type: "tuple",
          },
          {
            internalType: "uint32",
            name: "decimals",
            type: "uint32",
          },
        ],
        internalType: "struct IHederaTokenService.FungibleTokenInfo",
        name: "fungibleTokenInfo",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "int64",
        name: "serialNumber",
        type: "int64",
      },
    ],
    name: "getNonFungibleTokenInfo",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "symbol",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "treasury",
                    type: "address",
                  },
                  {
                    internalType: "string",
                    name: "memo",
                    type: "string",
                  },
                  {
                    internalType: "bool",
                    name: "tokenSupplyType",
                    type: "bool",
                  },
                  {
                    internalType: "int64",
                    name: "maxSupply",
                    type: "int64",
                  },
                  {
                    internalType: "bool",
                    name: "freezeDefault",
                    type: "bool",
                  },
                  {
                    components: [
                      {
                        internalType: "uint256",
                        name: "keyType",
                        type: "uint256",
                      },
                      {
                        components: [
                          {
                            internalType: "bool",
                            name: "inheritAccountKey",
                            type: "bool",
                          },
                          {
                            internalType: "address",
                            name: "contractId",
                            type: "address",
                          },
                          {
                            internalType: "bytes",
                            name: "ed25519",
                            type: "bytes",
                          },
                          {
                            internalType: "bytes",
                            name: "ECDSA_secp256k1",
                            type: "bytes",
                          },
                          {
                            internalType: "address",
                            name: "delegatableContractId",
                            type: "address",
                          },
                        ],
                        internalType: "struct IHederaTokenService.KeyValue",
                        name: "key",
                        type: "tuple",
                      },
                    ],
                    internalType: "struct IHederaTokenService.TokenKey[]",
                    name: "tokenKeys",
                    type: "tuple[]",
                  },
                  {
                    components: [
                      {
                        internalType: "uint32",
                        name: "second",
                        type: "uint32",
                      },
                      {
                        internalType: "address",
                        name: "autoRenewAccount",
                        type: "address",
                      },
                      {
                        internalType: "uint32",
                        name: "autoRenewPeriod",
                        type: "uint32",
                      },
                    ],
                    internalType: "struct IHederaTokenService.Expiry",
                    name: "expiry",
                    type: "tuple",
                  },
                ],
                internalType: "struct IHederaTokenService.HederaToken",
                name: "hedera",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "amount",
                    type: "uint32",
                  },
                  {
                    internalType: "address",
                    name: "tokenId",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "useHbarsForPayment",
                    type: "bool",
                  },
                  {
                    internalType: "bool",
                    name: "useCurrentTokenForPayment",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "feeCollector",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.FixedFee[]",
                name: "fixedFees",
                type: "tuple[]",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "numerator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "denominator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "minimumAmount",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "maximumAmount",
                    type: "uint32",
                  },
                  {
                    internalType: "bool",
                    name: "netOfTransfers",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "feeCollector",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.FractionalFee[]",
                name: "fractionalFees",
                type: "tuple[]",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "numerator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "denominator",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "amount",
                    type: "uint32",
                  },
                  {
                    internalType: "address",
                    name: "tokenId",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "useHbarsForPayment",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "feeCollector",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.RoyaltyFee[]",
                name: "royaltyFees",
                type: "tuple[]",
              },
              {
                internalType: "bool",
                name: "defaultKycStatus",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "deleted",
                type: "bool",
              },
              {
                internalType: "string",
                name: "ledgerId",
                type: "string",
              },
              {
                internalType: "bool",
                name: "pauseStatus",
                type: "bool",
              },
              {
                internalType: "uint64",
                name: "totalSupply",
                type: "uint64",
              },
            ],
            internalType: "struct IHederaTokenService.TokenInfo",
            name: "tokenInfo",
            type: "tuple",
          },
          {
            internalType: "int64",
            name: "serialNumber",
            type: "int64",
          },
          {
            internalType: "address",
            name: "ownerId",
            type: "address",
          },
          {
            internalType: "int64",
            name: "creationTime",
            type: "int64",
          },
          {
            internalType: "bytes",
            name: "metadata",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "spenderId",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.NonFungibleTokenInfo",
        name: "nonFungibleTokenInfo",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenCustomFees",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "amount",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "tokenId",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useHbarsForPayment",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "useCurrentTokenForPayment",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.FixedFee[]",
        name: "fixedFees",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "numerator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "denominator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minimumAmount",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maximumAmount",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "netOfTransfers",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.FractionalFee[]",
        name: "fractionalFees",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "numerator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "denominator",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "amount",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "tokenId",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useHbarsForPayment",
            type: "bool",
          },
          {
            internalType: "address",
            name: "feeCollector",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.RoyaltyFee[]",
        name: "royaltyFees",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenDefaultFreezeStatus",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "bool",
        name: "defaultFreezeStatus",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenDefaultKycStatus",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "bool",
        name: "defaultKycStatus",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenExpiryInfo",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "second",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "autoRenewAccount",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "autoRenewPeriod",
            type: "uint32",
          },
        ],
        internalType: "struct IHederaTokenService.Expiry",
        name: "expiry",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenInfo",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "symbol",
                type: "string",
              },
              {
                internalType: "address",
                name: "treasury",
                type: "address",
              },
              {
                internalType: "string",
                name: "memo",
                type: "string",
              },
              {
                internalType: "bool",
                name: "tokenSupplyType",
                type: "bool",
              },
              {
                internalType: "int64",
                name: "maxSupply",
                type: "int64",
              },
              {
                internalType: "bool",
                name: "freezeDefault",
                type: "bool",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "keyType",
                    type: "uint256",
                  },
                  {
                    components: [
                      {
                        internalType: "bool",
                        name: "inheritAccountKey",
                        type: "bool",
                      },
                      {
                        internalType: "address",
                        name: "contractId",
                        type: "address",
                      },
                      {
                        internalType: "bytes",
                        name: "ed25519",
                        type: "bytes",
                      },
                      {
                        internalType: "bytes",
                        name: "ECDSA_secp256k1",
                        type: "bytes",
                      },
                      {
                        internalType: "address",
                        name: "delegatableContractId",
                        type: "address",
                      },
                    ],
                    internalType: "struct IHederaTokenService.KeyValue",
                    name: "key",
                    type: "tuple",
                  },
                ],
                internalType: "struct IHederaTokenService.TokenKey[]",
                name: "tokenKeys",
                type: "tuple[]",
              },
              {
                components: [
                  {
                    internalType: "uint32",
                    name: "second",
                    type: "uint32",
                  },
                  {
                    internalType: "address",
                    name: "autoRenewAccount",
                    type: "address",
                  },
                  {
                    internalType: "uint32",
                    name: "autoRenewPeriod",
                    type: "uint32",
                  },
                ],
                internalType: "struct IHederaTokenService.Expiry",
                name: "expiry",
                type: "tuple",
              },
            ],
            internalType: "struct IHederaTokenService.HederaToken",
            name: "hedera",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "amount",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "tokenId",
                type: "address",
              },
              {
                internalType: "bool",
                name: "useHbarsForPayment",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "useCurrentTokenForPayment",
                type: "bool",
              },
              {
                internalType: "address",
                name: "feeCollector",
                type: "address",
              },
            ],
            internalType: "struct IHederaTokenService.FixedFee[]",
            name: "fixedFees",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "numerator",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "denominator",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "minimumAmount",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "maximumAmount",
                type: "uint32",
              },
              {
                internalType: "bool",
                name: "netOfTransfers",
                type: "bool",
              },
              {
                internalType: "address",
                name: "feeCollector",
                type: "address",
              },
            ],
            internalType: "struct IHederaTokenService.FractionalFee[]",
            name: "fractionalFees",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "numerator",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "denominator",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "amount",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "tokenId",
                type: "address",
              },
              {
                internalType: "bool",
                name: "useHbarsForPayment",
                type: "bool",
              },
              {
                internalType: "address",
                name: "feeCollector",
                type: "address",
              },
            ],
            internalType: "struct IHederaTokenService.RoyaltyFee[]",
            name: "royaltyFees",
            type: "tuple[]",
          },
          {
            internalType: "bool",
            name: "defaultKycStatus",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "deleted",
            type: "bool",
          },
          {
            internalType: "string",
            name: "ledgerId",
            type: "string",
          },
          {
            internalType: "bool",
            name: "pauseStatus",
            type: "bool",
          },
          {
            internalType: "uint64",
            name: "totalSupply",
            type: "uint64",
          },
        ],
        internalType: "struct IHederaTokenService.TokenInfo",
        name: "tokenInfo",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "keyType",
        type: "uint256",
      },
    ],
    name: "getTokenKey",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "inheritAccountKey",
            type: "bool",
          },
          {
            internalType: "address",
            name: "contractId",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "ed25519",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "ECDSA_secp256k1",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "delegatableContractId",
            type: "address",
          },
        ],
        internalType: "struct IHederaTokenService.KeyValue",
        name: "key",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenType",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "int32",
        name: "tokenType",
        type: "int32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantTokenKyc",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isFrozen",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "bool",
        name: "frozen",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isKyc",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "bool",
        name: "kycGranted",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "isToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "bool",
        name: "isToken",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
      {
        internalType: "bytes[]",
        name: "metadata",
        type: "bytes[]",
      },
    ],
    name: "mintToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
      {
        internalType: "uint64",
        name: "newTotalSupply",
        type: "uint64",
      },
      {
        internalType: "int64[]",
        name: "serialNumbers",
        type: "int64[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "pauseToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeTokenKyc",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "serialNumber",
        type: "uint256",
      },
    ],
    name: "transferFromNFT",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "int64",
        name: "serialNumber",
        type: "int64",
      },
    ],
    name: "transferNFT",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "sender",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "receiver",
        type: "address[]",
      },
      {
        internalType: "int64[]",
        name: "serialNumber",
        type: "int64[]",
      },
    ],
    name: "transferNFTs",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "int64",
        name: "amount",
        type: "int64",
      },
    ],
    name: "transferToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "accountId",
        type: "address[]",
      },
      {
        internalType: "int64[]",
        name: "amount",
        type: "int64[]",
      },
    ],
    name: "transferTokens",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "unfreezeToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "unpauseToken",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "second",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "autoRenewAccount",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "autoRenewPeriod",
            type: "uint32",
          },
        ],
        internalType: "struct IHederaTokenService.Expiry",
        name: "expiryInfo",
        type: "tuple",
      },
    ],
    name: "updateTokenExpiryInfo",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address",
          },
          {
            internalType: "string",
            name: "memo",
            type: "string",
          },
          {
            internalType: "bool",
            name: "tokenSupplyType",
            type: "bool",
          },
          {
            internalType: "int64",
            name: "maxSupply",
            type: "int64",
          },
          {
            internalType: "bool",
            name: "freezeDefault",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "keyType",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bool",
                    name: "inheritAccountKey",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "contractId",
                    type: "address",
                  },
                  {
                    internalType: "bytes",
                    name: "ed25519",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "ECDSA_secp256k1",
                    type: "bytes",
                  },
                  {
                    internalType: "address",
                    name: "delegatableContractId",
                    type: "address",
                  },
                ],
                internalType: "struct IHederaTokenService.KeyValue",
                name: "key",
                type: "tuple",
              },
            ],
            internalType: "struct IHederaTokenService.TokenKey[]",
            name: "tokenKeys",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "second",
                type: "uint32",
              },
              {
                internalType: "address",
                name: "autoRenewAccount",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "autoRenewPeriod",
                type: "uint32",
              },
            ],
            internalType: "struct IHederaTokenService.Expiry",
            name: "expiry",
            type: "tuple",
          },
        ],
        internalType: "struct IHederaTokenService.HederaToken",
        name: "tokenInfo",
        type: "tuple",
      },
    ],
    name: "updateTokenInfo",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "keyType",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "inheritAccountKey",
                type: "bool",
              },
              {
                internalType: "address",
                name: "contractId",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "ed25519",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "ECDSA_secp256k1",
                type: "bytes",
              },
              {
                internalType: "address",
                name: "delegatableContractId",
                type: "address",
              },
            ],
            internalType: "struct IHederaTokenService.KeyValue",
            name: "key",
            type: "tuple",
          },
        ],
        internalType: "struct IHederaTokenService.TokenKey[]",
        name: "keys",
        type: "tuple[]",
      },
    ],
    name: "updateTokenKeys",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "amount",
        type: "uint32",
      },
    ],
    name: "wipeTokenAccount",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "int64[]",
        name: "serialNumbers",
        type: "int64[]",
      },
    ],
    name: "wipeTokenAccountNFT",
    outputs: [
      {
        internalType: "int64",
        name: "responseCode",
        type: "int64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
