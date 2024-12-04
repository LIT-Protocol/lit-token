//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.28;

import { HypERC20 } from "@hyperlane-xyz/core/contracts/token/HypERC20.sol";

/// @title Lit Protocol Token
///
/// @dev This is the contract for the Lit Protocol DAO token.
contract LitToken is HypERC20 {
    constructor(
        uint8 __decimals,
        address _mailbox
    ) HypERC20(__decimals, _mailbox) {}
}
