import React from "react"
import PropTypes from "prop-types"

function HexGridDataDisplayCard(props) {
  const hexGridDataIsEmpty =
    props.hexGridData &&
    props.hexGridData.color === "" &&
    props.hexGridData.text === "" &&
    props.hexGridData.emoji === ""
  return (
    <div className="card" hidden={props.hidden}>
      <div
        className="card-header text-center"
        style={{
          backgroundColor:
            props.hexGridData && props.hexGridData.color
              ? props.hexGridData.color
              : "",
          fontSize: "2rem",
        }}
      >
        {props.hexGridData && props.hexGridData.emoji && (
          <img src={props.hexGridData.emoji}></img>
        )}
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
        {!hexGridDataIsEmpty && (
          <p className="card-text">
            {props.hexGridData && props.hexGridData.text}
          </p>
        )}
        <div className="card_action-container text-end">
          <button
            type="button"
            className="btn btn-light me-2"
            onClick={props.onEdit}
            disabled={props.isEditDisabled}
          >
            {hexGridDataIsEmpty ? "Create" : "Edit"}
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
  hidden: PropTypes.bool,
}

export default HexGridDataDisplayCard
