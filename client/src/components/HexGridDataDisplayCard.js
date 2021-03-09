import React from "react"
import PropTypes from "prop-types"

function HexGridDataDisplayCard(props) {
  const hexGridDataIsEmpty =
    props.hexGridData &&
    props.hexGridData.Color === "" &&
    props.hexGridData.Text === "" &&
    props.hexGridData.Emoji === ""

  const twentyFourHoursInMs = 24 * 60 * 60 * 1000

  const editableDate =
    props.hexGridData &&
    new Date(
      parseInt(props.hexGridData.CreatedDate) * 1000 + twentyFourHoursInMs
    )
  const nowDate = new Date()
  const isHexGridEditable = editableDate ? nowDate > editableDate : false

  return (
    <div className="card" hidden={props.hidden}>
      <div
        className="card-header text-center"
        style={{
          backgroundColor:
            props.hexGridData && props.hexGridData.Color
              ? props.hexGridData.Color
              : "",
          fontSize: "2rem",
        }}
      >
        {props.hexGridData && props.hexGridData.Emoji && (
          <img src={props.hexGridData.Emoji}></img>
        )}
      </div>
      <div
        className="card-body"
        style={{
          borderColor:
            props.hexGridData && props.hexGridData.Color
              ? props.hexGridData.Color
              : "",
        }}
      >
        {!hexGridDataIsEmpty && (
          <p className="card-text">
            {props.hexGridData && props.hexGridData.Text}
          </p>
        )}
        {!isHexGridEditable && editableDate && (
          <small className="text-muted fw-light">
            This post will be editable after {editableDate.toLocaleString()}
          </small>
        )}
        <div className="card_action-container text-end">
          {isHexGridEditable && (
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={props.onEdit}
              disabled={!isHexGridEditable}
            >
              {hexGridDataIsEmpty ? "Create" : "Edit"}
            </button>
          )}
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
  onEdit: () => {},
  onClose: () => {},
}

HexGridDataDisplayCard.propTypes = {
  hexGridData: PropTypes.object,
  onEdit: PropTypes.func,
  onClose: PropTypes.func,
  hidden: PropTypes.bool,
}

export default HexGridDataDisplayCard
