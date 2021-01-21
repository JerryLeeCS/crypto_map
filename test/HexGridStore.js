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

    const storedData = await hexGridStore.hexGridDataItems.call(hexGridDataA.id)

    assert.notEqual(
      storedData[0].color,
      hexGridDataB.color,
      "hexGridDataB were able to update color dispite expirationDate."
    )
    assert.notEqual(
      storedData[0].emoji,
      hexGridDataB.emoji,
      "hexGridDataB were able to update emoji dispite expirationDate."
    )
    assert.notEqual(
      storedData[0].text,
      hexGridDataB.text,
      "hexGridDataB were able to update text dispite expirationDate."
    )
  })
})
