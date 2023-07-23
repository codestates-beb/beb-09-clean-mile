// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

contract Greeting {
    string private _greet;

    function greet() public view returns (string memory) {
        return _greet;
    }

    function setGreet(string memory _new_greet) public {
        _greet = _new_greet;
    }
}
