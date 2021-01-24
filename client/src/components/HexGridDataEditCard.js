import React, { useState } from "react"
import PropTypes from "prop-types"
import { CirclePicker } from "react-color"

function HexGridDataEditCard(props) {
  const [hexGridData, setHexGridData] = useState({
    color: "#000000",
  })

  return (
    <div className="card">
      <div
        className="card-header text-center p-0"
        style={{ backgroundColor: hexGridData.color, fontSize: "2rem" }}
      >
        😆
      </div>
      <div className="card-body" style={{ borderColor: hexGridData.color }}>
        <div class="mb-3">
          <label htmlFor="hexGridDataTextArea" class="form-label">
            message
          </label>
          <textarea
            class="form-control"
            id="hexGridDataTextArea"
            rows="3"
          ></textarea>
        </div>
        <CirclePicker
          width="100%"
          onChange={({ hex: color }) => {
            console.log("on color change ", color)
            setHexGridData((prev) => ({
              ...prev,
              color,
            }))
          }}
        />
        <div className="card_action-container text-end">
          <button
            type="button"
            class="btn btn-light me-2"
            onClick={props.onCreate}
            disabled={props.isCreateDisabled}
          >
            Create
          </button>
          <button type="button" class="btn btn-light" onClick={props.onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

HexGridDataEditCard.propTypes = {
  isCreateDisabled: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
}

export default HexGridDataEditCard
