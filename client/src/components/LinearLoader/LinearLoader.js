import React from "react"
import PropTypes from "prop-types"
import "./LinearLoader.css"

function LinearLoader(props) {
  return (
    <div className="linear-loader" hidden={props.hidden}>
      <div className="indeterminate"></div>
    </div>
  )
}

LinearLoader.defaultProps = {
  hidden: true,
}

LinearLoader.propTypes = {
  hidden: PropTypes.bool,
}

export default LinearLoader
