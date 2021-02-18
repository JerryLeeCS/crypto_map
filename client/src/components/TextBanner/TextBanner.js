import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import "./TextBanner.css"

function TextBanner(props) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setHidden(false)
    const timeout = setTimeout(() => setHidden(true), 4000)
    return () => {
      clearTimeout(timeout)
    }
  }, [props.text])

  return (
    <div
      className={`status-banner p-2 m-1 text-center alert ${props.className}`}
      hidden={hidden}
    >
      {props.text}
    </div>
  )
}

TextBanner.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
}

export default TextBanner
