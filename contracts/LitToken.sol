//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Lit Protocol Token
///
/// @dev This is the contract for the Lit Protocol DAO token, capped at 1bn tokens.
contract LitToken is ERC20, Ownable {

    // initial supply cap of 1bn tokens
    uint256 public supplyCap = 1000000000 * (10**uint256(18));

    constructor() ERC20("Test Lit", "tLit") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) public onlyOwner {
        // ensure minting does not exceed supply cap
        require(totalSupply() + amount <= supplyCap, "Supply cap exceeded");
        _mint(to, amount);
    }
    function updateSupplyCap(uint256 newSupplyCap) public onlyOwner {
        // ensure new supply cap is greater than current supply
        require(newSupplyCap > totalSupply(), "New supply cap must be greater than current supply");
        supplyCap = newSupplyCap;
    }
}
