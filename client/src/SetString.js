import React, { useState } from "react"

function SetString(props) {
  const [stackId, setStackId] = useState(null)

  const setValue = (value) => {
    const { drizzle, drizzleState } = props
    const contract = drizzle.contracts.MyStringStore

    const stackId = contract.methods["set"].cacheSend(value, {
      from: drizzleState.accounts[0],
    })

    setStackId(stackId)
  }

  const getTxStatus = () => {
    const { transactions, transactionStack } = props.drizzleState
    const txHash = transactionStack[stackId]

    if (!txHash) return null

    return `Transaction status: ${
      transactions[txHash] && transactions[txHash].status
    }.`
  }

  return (
    <div>
      <input
        type="text"
        onKeyDown={(event) => {
          if (event.code === "Enter") {
            setValue(event.target.value)
          }
        }}
      />
      <div>{getTxStatus()}</div>
    </div>
  )
}

export default SetString
