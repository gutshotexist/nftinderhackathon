const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const runApp = async () => {
  await Moralis.start({
    apiKey: "m0Le40cAXOtdE2N6Tb6fo8WzXCiF5e0qNhb9NXvayz9w2wFOAZl51rbzuNQ5K01A",
  });

  const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.nft.getContractNFTs({
    chain: "0x38",
    format: "decimal",
    limit: 1,
    address: "0xdea59b1a1d0072b4a801ab2c46e28df05272cd3a",
  });

  const metadataArray = response.result.map((nft) => {
    const ipfsUrl = nft.metadata.image.replace(
      "ipfs://",
      "https://ipfs.io/ipfs/"
    );
    return {
      name: nft.metadata.name,
      description: nft.metadata.description,
      image: ipfsUrl,
      creator: nft.metadata.Creator,
      tokenId: nft.tokenId,
    };
  });

  console.log(metadataArray);
};

runApp();
