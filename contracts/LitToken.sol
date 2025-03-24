//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";


/// @title Lit Protocol Token
///
/// @dev This is the contract for the Lit Protocol DAO token, capped at 1bn tokens.
contract LitToken is ERC20, Ownable, ERC20Capped, ERC20Permit {

    constructor() ERC20("Lit Key", "LITKEY") Ownable(msg.sender) ERC20Capped(1000000000 * (10**uint256(18))) ERC20Permit("Lit Key") {
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
