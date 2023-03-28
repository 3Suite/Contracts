//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/I3SuiteToken.sol";

contract ThreeSuite is I3SuiteToken, ERC20Permit, Ownable {
    uint256 private constant INITIAL_SUPPLY = 1_000_000_000e18;

    /**
     * @dev Constructor of the contract.
     */
    constructor()
        ERC20("3Suite Token", "3Suite")
        ERC20Permit("3Suite Token")
    {
        _mint(address(this), INITIAL_SUPPLY);
    }

    /**
     * @dev Transfer tokens to chosen address.
     * @param _dest destinition of tokens
     * @param _amount amount of tokens
     */
    function transferTo(address _dest, uint256 _amount) external onlyOwner {
        _transfer(address(this), _dest, _amount);
    }

    /**
     * @dev Transfer tokens to chosen addresses.
     * @param _dest array of destinitions of tokens
     * @param _amount array of amounts of tokens
     */
    function transferToBatch(
        address[] calldata _dest,
        uint256[] calldata _amount
    ) external onlyOwner {
        require(_dest.length == _amount.length, "Parameters length mismatch");
        for (uint256 i = 0; i < _dest.length; i++) {
            _transfer(address(this), _dest[i], _amount[i]);
        }
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) external override {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) external override {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(
            currentAllowance >= amount,
            "ERC20: burn amount exceeds allowance"
        );
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }
}
