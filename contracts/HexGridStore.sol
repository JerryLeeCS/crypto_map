pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

library SharedStructs {
    struct HexGrid {
        string Color;
        string Text;
        string Emoji;
    }    
}

contract HexGrid {
    string public Color;
    string public Text;
    string public Emoji;

    constructor (string memory color, string memory text, string memory emoji) public {
        Color = color;
        Text = text;
        Emoji = emoji;
    }

    function getColor() public view returns(string memory) {
        return Color;
    }

    function getText() public view returns (string memory) {
        return Text;
    }

    function getEmoji() public view returns (string memory) {
        return Emoji;
    }

    function getData() public view returns (SharedStructs.HexGrid memory) {
        return SharedStructs.HexGrid(Color, Text, Emoji);
    }
}

contract HexGridStore {
    struct HexGridData {
        HexGrid HexGridAddress;
        uint256 expirationDate;
    }

    mapping (string => HexGridData) public hexGridDataItems;

    function addHexGridData(string memory hexGridId, string memory color, string memory emoji, string memory text) public{
        if (hexGridDataItems[hexGridId].expirationDate != 0) {
            HexGridData memory prevHexGridDataItem = hexGridDataItems[hexGridId];
            require(now > prevHexGridDataItem.expirationDate);
        }

        HexGrid hexGridAddress = new HexGrid(color, text, emoji);
        hexGridDataItems[hexGridId] = HexGridData(hexGridAddress, now + 1 days);
    }

    function getHexGrids(string[] memory hexGridIds) public view returns(SharedStructs.HexGrid[] memory){
        uint len = hexGridIds.length;
        HexGrid[] memory hexGridAddresses = new HexGrid[](len);
        SharedStructs.HexGrid[] memory hexGrids = new SharedStructs.HexGrid[](len); 

        for (uint i = 0; i < len; i++) {
            string memory hexGridId = hexGridIds[i];
            hexGridAddresses[i] = hexGridDataItems[hexGridId].HexGridAddress;
        }

        for (uint i = 0; i < len; i++) {
            HexGrid iHexGrid = HexGrid(hexGridAddresses[i]);
            hexGrids[i] = iHexGrid.getData();
        }

        return hexGrids;
    }
}