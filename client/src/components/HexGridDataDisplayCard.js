import React from "react"
import PropTypes from "prop-types"

function HexGridDataDisplayCard(props) {
  return (
    <div className="card">
      <div
        className="card-header text-center p-0"
        style={{ backgroundColor: props.color }}
      >
        {props.emoji}
      </div>
      <div className="card-body" style={{ borderColor: props.color }}>
        <p className="card-text">{props.text}</p>
        <div className="card_action-container text-end">
          <button
            type="button"
            class="btn btn-light me-2"
            onClick={props.onEdit}
            disabled={props.isEditDisabled}
          >
            Edit
          </button>
          <button type="button" class="btn btn-light" onClick={props.onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

HexGridDataDisplayCard.defaultProps = {
  emoji: "",
  color: "",
  text: "",
  isEditDisabled: false,
  onEdit: () => {},
  onClose: () => {},
}

HexGridDataDisplayCard.propTypes = {
  emoji: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  isEditDisabled: PropTypes.bool,
  onEdit: PropTypes.func,
  onClose: PropTypes.func,
}

export default HexGridDataDisplayCard
