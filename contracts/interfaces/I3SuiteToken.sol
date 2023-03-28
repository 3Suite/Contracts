//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface I3SuiteToken is IERC20 {
    function burn(uint256 _amount) external;

    function burnFrom(address _account, uint256 _amount) external;
}
