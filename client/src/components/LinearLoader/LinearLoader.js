import React from "react"
import PropTypes from "prop-types"
function LinearLoader(props) {
  return (
    <div className="linear-loader">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
        hidden={props.hidden}
        style={{ width: "100%", height: "1rem" }}
      ></div>
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
