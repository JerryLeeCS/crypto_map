import React from "react"
import PropTypes from "prop-types"

function HexGridDataDisplayCard(props) {
  return (
    <div className="card">
      <div
        className="card-header text-center p-0"
        style={{
          backgroundColor:
            props.hexGridData && props.hexGridData.color
              ? props.hexGridData.color
              : "",
          fontSize: "2rem",
        }}
      >
        {props.hexGridData && props.hexGridData.emoji}
      </div>
      <div
        className="card-body"
        style={{
          borderColor:
            props.hexGridData && props.hexGridData.color
              ? props.hexGridData.color
              : "",
        }}
      >
        <p className="card-text">
          {props.hexGridData && props.hexGridData.text}
        </p>
        <div className="card_action-container text-end">
          <button
            type="button"
            className="btn btn-light me-2"
            onClick={props.onEdit}
            disabled={props.isEditDisabled}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={props.onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

HexGridDataDisplayCard.defaultProps = {
  isEditDisabled: false,
  onEdit: () => {},
  onClose: () => {},
}

HexGridDataDisplayCard.propTypes = {
  hexGridData: PropTypes.object,
  isEditDisabled: PropTypes.bool,
  onEdit: PropTypes.func,
  onClose: PropTypes.func,
}

export default HexGridDataDisplayCard
