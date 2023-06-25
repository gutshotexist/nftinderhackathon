// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";


contract NFTinderCollection is ERC721Enumerable, ERC721Burnable, Ownable {
    using Strings for uint256;

    uint256 public         maxSupply;
    string public          baseURI;// = "ipfs://QmbeT7zTp5nFbg4BzZJMKT1Ck71MxxXix4oBTr7GzRWKL6/"; donuts collection

    constructor(string memory _baseURI, uint _maxSupply) ERC721("NFTinder Collection", "NFTC") {
        baseURI = _baseURI;
        maxSupply = _maxSupply;   
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function changeBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }


    function safeMint(address to, uint256 tokenId) public onlyOwner {
        //require(tokenId<=maxSupply);
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //setter for maxSupply
    function setMaxSupply(uint _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
    }

}


contract NFTDProtocol {
    NFTinderCollection public                   nft;
    uint256                                     nftId = 0;
    mapping(address => mapping(string => uint)) userStats;

    //uint public constant    REWARDS_TIMEOUT = 1 seconds; //- for test
    uint public constant    REWARDS_TIMEOUT = 1 days;
    uint public constant    DAYS_TO_NFT_REWARD = 5;

    event DailyQuest (address indexed user, uint dayStreak, string message);
    event RewardNFT (address indexed user, string uri, string message);

    constructor(string memory _baseURI, uint _maxSupply) {
        nft = new NFTinderCollection(_baseURI,_maxSupply);
    }

    function acquireReward () external  {
        if (userStats[msg.sender]["dayStreak"] < DAYS_TO_NFT_REWARD) {
            require(block.timestamp - userStats[msg.sender]["lastReward"] >= REWARDS_TIMEOUT, "You can participate in the quest only once a day");
            userStats[msg.sender]["lastReward"] = block.timestamp;
            userStats[msg.sender]["dayStreak"]++;
            emit DailyQuest(msg.sender, userStats[msg.sender]["dayStreak"], " days out of 5 to receive the reward");
        } else {
            require(nftId < nft.maxSupply(), "All NFTs are minted");
            require(userStats[msg.sender]["dayStreak"] == DAYS_TO_NFT_REWARD, "You have already received the reward");
            userStats[msg.sender]["lastReward"] = block.timestamp;
            nft.safeMint(msg.sender, nftId);
            emit RewardNFT(msg.sender, nft.tokenURI(nftId), "You received a reward for activity");
            nftId++;
            userStats[msg.sender]["dayStreak"] = 0;
        }
    }

    function getDayStreak(address _user) external view returns (uint) {
        return userStats[_user]["dayStreak"];
    }

}

