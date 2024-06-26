import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

// my API key
// D8Kfm2KtjFHVEpqvPmTVgaNLvY8TFEhrIBi8h71wjcTfFIdlmSKFlYJcEGATK8dr
export const runMoralis = async () => {
  await Moralis.start({
    apiKey: "D8Kfm2KtjFHVEpqvPmTVgaNLvY8TFEhrIBi8h71wjcTfFIdlmSKFlYJcEGATK8dr",
  });
};

export const getNapaNFTOfUser = async (currentAccount: string) => {
  //   const address = "0xd4e4078ca3495DE5B1d4dB434BEbc5a986197782";

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: "0xaa36a7",
    format: "decimal",
    tokenAddresses: ["0xE7D1532f5B616c26C0CD8952b2a54D8DCbfa9932"],
    mediaItems: false,
    address: `${currentAccount}`,
  });

  // console.log(response.raw);
  // console.log(response.toJSON().result, "all NFTs");
  return response.toJSON().result;
};
