import React, { useEffect, useState } from "react"

function ReadString(props) {
  const [dataKey, setDataKey] = useState(null)

  useEffect(() => {
    const { drizzle } = props

    const contract = drizzle.contracts.MyStringStore
    const dataKey = contract.methods["myString"].cacheCall()
    setDataKey(dataKey)
  }, [])

  if (dataKey) {
    const { MyStringStore } = props.drizzleState.contracts
    const myString = MyStringStore.myString[dataKey]
    return <p>My stored string: {myString && myString.value}</p>
  }

  return <div>ReadString Component</div>
}

export default ReadString
