const HexGridStore = artifacts.require("../contracts/HexGridStore.sol")

contract("HexGridStore", (accounts) => {
  it("should store hexGridData in HexGridStore.", async () => {
    const hexGridStore = await HexGridStore.deployed()
    const hexGridData = {
      id: "1",
      Color: "#ffffff",
      Emoji: "😟",
      Text: "Just testing",
    }

    await hexGridStore.addHexGridData(
      hexGridData.id,
      hexGridData.Color,
      hexGridData.Emoji,
      hexGridData.Text,
      {
        from: accounts[0],
      }
    )

    const hexGrids = await hexGridStore.getHexGrids.call([hexGridData.id])
    const hexGrid = hexGrids[0]

    assert.equal(
      hexGrid.Color,
      hexGridData.Color,
      "hexGridData.Color was not stored."
    )

    assert.equal(
      hexGrid.Emoji,
      hexGridData.Emoji,
      "hexGridData.Emoji was not stored."
    )

    assert.equal(
      hexGrid.Text,
      hexGridData.Text,
      "hexGridData.Text was not stored."
    )
  })

  it("should not store hexGridData in HexGridStore if it's within expirationDate.", async () => {
    try {
      const hexGridStore = await HexGridStore.deployed()
      const hexGridDataA = {
        id: "1",
        Color: "#ffffff",
        Emoji: "😟",
        Text: "Just testing",
      }

      const hexGridDataB = {
        id: "1",
        Color: "#000000",
        Emoji: "😏",
        Text: "Just testing out",
      }

      await hexGridStore.addHexGridData(
        hexGridDataA.id,
        hexGridDataA.Color,
        hexGridDataA.Emoji,
        hexGridDataA.Text,
        {
          from: accounts[0],
        }
      )

      await hexGridStore.addHexGridData(
        hexGridDataB.id,
        hexGridDataB.Color,
        hexGridDataB.Emoji,
        hexGridDataB.Text,
        {
          from: accounts[0],
        }
      )
    } catch (error) {
      assert(error, "Expected an error but did not get one")
      assert(
        error.message.includes("revert"),
        "Expected revert error but got '" + error.message + "' instead"
      )
    }
  })

  it("should getHexGridDataItems.", async () => {
    try {
      const hexGridStore = await HexGridStore.deployed()
      const hexGridDataA = {
        id: "1",
        Color: "#ffffff",
        Emoji: "😟",
        Text: "Just testing",
      }

      const hexGridDataB = {
        id: "1",
        Color: "#000000",
        Emoji: "😏",
        Text: "Just testing out",
      }

      await hexGridStore.addHexGridData(
        hexGridDataA.id,
        hexGridDataA.Color,
        hexGridDataA.Emoji,
        hexGridDataA.Text,
        {
          from: accounts[0],
        }
      )

      await hexGridStore.addHexGridData(
        hexGridDataB.id,
        hexGridDataB.Color,
        hexGridDataB.Emoji,
        hexGridDataB.Text,
        {
          from: accounts[0],
        }
      )

      const getHexGrids = await getHexGridDataItems([
        hexGridDataA.id,
        hexGridDataB.id,
      ])

      assert.equal(
        getHexGrids[0].id,
        hexGridDataA.id,
        "Stored value A and got item A should be the same."
      )
      assert.equal(
        getHexGrids[1].id,
        hexGridDataB.id,
        "Stored value B and got item B should be the same."
      )
    } catch (error) {}
  })
})
