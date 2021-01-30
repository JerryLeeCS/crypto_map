pragma solidity ^0.5.0;

contract HexGridStore {
    struct HexGridData {
        string color;
        string text;
        string emoji;
        uint256 expirationDate;
    }

    mapping (string => HexGridData) public hexGridDataItems;

    function addHexGridData(string memory hexGridId, string memory color, string memory emoji, string memory text) public{
        if (hexGridDataItems[hexGridId].expirationDate != 0) {
            HexGridData memory prevHexGridDataItem = hexGridDataItems[hexGridId];
            require(now > prevHexGridDataItem.expirationDate);
        }
        HexGridData memory hexGridDataItem = HexGridData(color, text, emoji, now + 1 days);
        hexGridDataItems[hexGridId] = hexGridDataItem;
    }
}