// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RPGSwordGame is ERC721 {
    uint256 public totalSwordsMinted;
    uint256 public constant MAX_SWORDS = 500;
    uint256 public constant PRICE = 5 ether;
    mapping(address => bool) public hasMintedSword;

    constructor() ERC721("RPGSwords", "RPGS") {}

    function mintSword() public payable {
        require(totalSwordsMinted < MAX_SWORDS, "All swords have been minted");
        require(msg.value == PRICE, "Incorrect amount of ETH sent");
        require(!hasMintedSword[msg.sender], "User has already minted a sword");

        uint256 swordId = totalSwordsMinted + 1;
        _mint(msg.sender, swordId);
        totalSwordsMinted++;
        hasMintedSword[msg.sender] = true;
    }
}