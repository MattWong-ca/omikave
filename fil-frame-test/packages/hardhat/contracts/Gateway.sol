// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Gateway {
    // State variables
    mapping(address => mapping(bytes32 => bool)) private permissions;
    uint256 public accessFee = 0.25 ether;

    // Function to pay for access
    function payForAccess(address user, string memory cid) external payable {
        require(msg.value >= accessFee, "Insufficient payment");
        bytes32 cidHash = keccak256(abi.encodePacked(cid));
        permissions[user][cidHash] = true;
    }

    // Revoke access to a CID for a specific address
    function revokeAccess(address user, string memory cid) public {
        bytes32 cidHash = keccak256(abi.encodePacked(cid));
        permissions[user][cidHash] = false;
    }

    // Function to check if an address is verified
    function isVerified(
        address user,
        string memory cid
    ) external view returns (bool) {
        bytes32 cidHash = keccak256(abi.encodePacked(cid));
        return permissions[user][cidHash];
    }
}
