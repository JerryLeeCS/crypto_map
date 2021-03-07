pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract HexGrid {
    string public Color;
    string public Text;
    string public Emoji;
    uint256 public CreatedDate;
    bool public exists;

    struct HexGridStruct {
        string Color;
        string Text;
        string Emoji;
        uint256 CreatedDate;
    }  

    constructor (string memory color, string memory text, string memory emoji) public {
        Color = color;
        Text = text;
        Emoji = emoji;
        CreatedDate = now;
        exists = true;
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

    function getCreatedDate() public view returns (uint256) {
        return CreatedDate;
    }

    function getData() public view returns (HexGridStruct memory) {
        return HexGridStruct(Color, Text, Emoji, CreatedDate);
    }
}

contract HexGridStore {
    struct HexGridData {
        HexGrid HexGridAddress;
        uint256 expirationDate;
        bool exists;
    }

    mapping (string => HexGridData) public hexGridDataItems;

    function addHexGridData(string memory hexGridId, string memory color, string memory emoji, string memory text) public{
        if (hexGridDataItems[hexGridId].expirationDate != 0) {
            HexGridData memory prevHexGridDataItem = hexGridDataItems[hexGridId];
            require(now > prevHexGridDataItem.expirationDate);
        }

        HexGrid hexGridAddress = new HexGrid(color, text, emoji);
        hexGridDataItems[hexGridId] = HexGridData(hexGridAddress, now + 1 days, true);
    }

    function getHexGrids(string[] memory hexGridIds) public view returns(HexGrid.HexGridStruct[] memory){
        uint len = hexGridIds.length;
        HexGrid.HexGridStruct[] memory hexGrids = new HexGrid.HexGridStruct[](len); 

        for (uint i = 0; i < len; i++) {
            string memory hexGridId = hexGridIds[i];
            if (hexGridDataItems[hexGridId].exists == true) {
                HexGrid iHexGrid = HexGrid(hexGridDataItems[hexGridId].HexGridAddress);
                if (iHexGrid.exists() == true) {
                    hexGrids[i] = iHexGrid.getData();
                }
            } 
        }
        return hexGrids;
    }
}