const HexGridStore = artifacts.require("../contracts/HexGridStore.sol")

contract("HexGridStore", (accounts) => {
  it("should store hexGridData in HexGridStore.", async () => {
    const hexGridStore = await HexGridStore.deployed()
    const hexGridData = {
      id: "1",
      color: "#ffffff",
      emoji: "😟",
      text: "Just testing",
    }

    await hexGridStore.addHexGridData(
      hexGridData.id,
      hexGridData.color,
      hexGridData.emoji,
      hexGridData.text,
      {
        from: accounts[0],
      }
    )

    const storedData = await hexGridStore.hexGridDataItems.call(hexGridData.id)

    assert.equal(
      storedData.color,
      hexGridData.color,
      "hexGridData.color was not stored."
    )

    assert.equal(
      storedData.emoji,
      hexGridData.emoji,
      "hexGridData.emoji was not stored."
    )

    assert.equal(
      storedData.text,
      hexGridData.text,
      "hexGridData.text was not stored."
    )
  })

  it("should not store hexGridData in HexGridStore if it's within expirationDate.", async () => {
    try {
      const hexGridStore = await HexGridStore.deployed()
      const hexGridDataA = {
        id: "1",
        color: "#ffffff",
        emoji: "😟",
        text: "Just testing",
      }

      const hexGridDataB = {
        id: "1",
        color: "#000000",
        emoji: "😏",
        text: "Just testing out",
      }

      await hexGridStore.addHexGridData(
        hexGridDataA.id,
        hexGridDataA.color,
        hexGridDataA.emoji,
        hexGridDataA.text,
        {
          from: accounts[0],
        }
      )

      await hexGridStore.addHexGridData(
        hexGridDataB.id,
        hexGridDataB.color,
        hexGridDataB.emoji,
        hexGridDataB.text,
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
        color: "#ffffff",
        emoji: "😟",
        text: "Just testing",
      }

      const hexGridDataB = {
        id: "1",
        color: "#000000",
        emoji: "😏",
        text: "Just testing out",
      }

      await hexGridStore.addHexGridData(
        hexGridDataA.id,
        hexGridDataA.color,
        hexGridDataA.emoji,
        hexGridDataA.text,
        {
          from: accounts[0],
        }
      )

      await hexGridStore.addHexGridData(
        hexGridDataB.id,
        hexGridDataB.color,
        hexGridDataB.emoji,
        hexGridDataB.text,
        {
          from: accounts[0],
        }
      )

      const hexGridDataItems = await getHexGridDataItems([
        hexGridDataA.id,
        hexGridDataB.id,
      ])

      assert.equal(
        hexGridDataItems[0].id,
        hexGridDataA.id,
        "Stored value A and got item A should be the same."
      )
      assert.equal(
        hexGridDataItems[1].id,
        hexGridDataB.id,
        "Stored value B and got item B should be the same."
      )
    } catch (error) {}
  })
})
