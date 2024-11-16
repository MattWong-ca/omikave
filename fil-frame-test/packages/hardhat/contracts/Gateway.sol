// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Gateway {
    // State variables
    mapping(address => bool) private verifiedAddresses;
    uint256 public accessFee;

    // Events
    event AddressVerified(address indexed user);

    // Constructor to set the initial access fee
    constructor(uint256 _accessFee) {
        accessFee = _accessFee;
    }

    // Function to pay for access
    function payForAccess() external payable {
        require(msg.value >= accessFee, "Insufficient payment");
        require(!verifiedAddresses[msg.sender], "Address already verified");
        
        verifiedAddresses[msg.sender] = true;
        emit AddressVerified(msg.sender);
    }

    // Function to check if an address is verified
    function isVerified(address _address) external view returns (bool) {
        return verifiedAddresses[_address];
    }
}