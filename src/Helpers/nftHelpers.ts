import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

// my API key
// D8Kfm2KtjFHVEpqvPmTVgaNLvY8TFEhrIBi8h71wjcTfFIdlmSKFlYJcEGATK8dr
export const runMoralis = async () => {
    await Moralis.start({
        apiKey: "gxFx0RWobr82DUQZD7W2qwtsfaW63p6QtIJh7pZSvRshWexNbv58m9Dc1hai9ZLl",
    });
}

export const getNapaNFTOfUser = async (currentAccount: string) => {
    //   const address = "0xd4e4078ca3495DE5B1d4dB434BEbc5a986197782";

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
        "chain": "0x5",
        "format": "decimal",
        "tokenAddresses": [
            "0xfda8ed7BbDa351D8D013CF4cef8848438803d4ab"
        ],
        "mediaItems": false,
        "address": `${currentAccount}`
    });

    // console.log(response.raw);
    // console.log(response.toJSON().result, "all NFTs");
    return response.toJSON().result
};