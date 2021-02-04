pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

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

    function getHexGridDataItems(string[] memory hexGridIds) public view returns(HexGridData[] memory){
        uint len = hexGridIds.length;
        HexGridData[] memory dataItems = new HexGridData[](len);

        for (uint i = 0; i < len; i++) {
            string memory hexGridId = hexGridIds[i];
            dataItems[i] = hexGridDataItems[hexGridId];
        }

        return dataItems;
    }
}