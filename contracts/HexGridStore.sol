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
        uint epochDay = 86400;
        if (hexGridDataItems[hexGridId].expirationDate != 0) {
            
            HexGridData memory prevHexGridDataItem = hexGridDataItems[hexGridId];
            if ((now - prevHexGridDataItem.expirationDate) <= epochDay) {
                revert();
            }
        }

        HexGridData memory hexGridDataItem = HexGridData(color, text, emoji, now + epochDay);
        hexGridDataItems[hexGridId] = hexGridDataItem;
    }
}