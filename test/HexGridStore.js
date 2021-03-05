const HexGridStore = artifacts.require("../contracts/HexGridStore.sol")

contract("HexGridStore", (accounts) => {
  it("should getHexGrids with empty mapping.", async () => {
    const hexGridStore = await HexGridStore.deployed()
    const hexGrids = await hexGridStore.getHexGrids.call(["1", "2", "3"])
    assert.equal(
      hexGrids[0].Color,
      "",
      "hexGrids[0].Color shouldn't have any data."
    )

    assert.equal(
      hexGrids[1].Emoji,
      "",
      "hexGrids[1].Color shouldn't have any data."
    )

    assert.equal(
      hexGrids[2].Text,
      "",
      "hexGrids[2].Text shouldn't have any data."
    )
  })

  it("should store hexGridData in HexGridStore.", async () => {
    const hexGridStore = await HexGridStore.deployed()
    const hexGridData = {
      id: "1",
      Color: "#ffffff",
      Emoji: "😟",
      Text: "1Just testing",
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
        Text: "2Just testing",
      }

      const hexGridDataB = {
        id: "1",
        Color: "#000000",
        Emoji: "😏",
        Text: "2Just testing out",
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

  it("should getHexGrids.", async () => {
    try {
      const hexGridStore = await HexGridStore.deployed()
      const hexGridDataA = {
        id: "2",
        Color: "#ffffff",
        Emoji: "😟",
        Text: "3",
      }

      const hexGridDataB = {
        id: "3",
        Color: "#000000",
        Emoji: "😏",
        Text: "3",
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

      const hexGrids = await hexGridStore.getHexGrids.call([
        hexGridDataA.id,
        hexGridDataB.id,
      ])

      assert.equal(
        hexGrids[0].Emoji,
        hexGridDataA.Emoji,
        "Stored Emoji A and got item A should be the same."
      )
      assert.equal(
        hexGrids[1].Emoji,
        hexGridDataB.Emoji,
        "Stored Emoji B and got item B should be the same."
      )
    } catch (error) {
      console.error(error)
    }
  })
})
