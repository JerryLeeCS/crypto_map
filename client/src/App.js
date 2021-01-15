import { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"
import ReadString from "./ReadString.js"
import SetString from "./SetString.js"

function App(props) {
  const [loading, setLoading] = useState(true)
  const [drizzleState, setDrizzleState] = useState(null)

  useEffect(() => {
    const { drizzle } = props

    const unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState()

      if (drizzleState.drizzleStatus.initialized) {
        setDrizzleState(drizzleState)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) {
    return "Loading Drizzle..."
  }

  return (
    <div className="App">
      <header className="App-header">
        Drizzle is ready
        <ReadString drizzle={props.drizzle} drizzleState={drizzleState} />
        <SetString drizzle={props.drizzle} drizzleState={drizzleState} />
      </header>
    </div>
  )
}

export default App
