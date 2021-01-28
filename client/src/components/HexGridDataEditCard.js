import React, { useState } from "react"
import PropTypes from "prop-types"
import { CirclePicker } from "react-color"
import EmojiPicker from "emoji-picker-react"

function HexGridDataEditCard(props) {
  const [hexGridData, setHexGridData] = useState({
    color: "#000000",
    emoji: "🌎",
  })

  function onColorChange({ hex: color }) {
    setHexGridData((prev) => ({
      ...prev,
      color,
    }))
  }

  function onEmojiClick(event, { emoji }) {
    setHexGridData((prev) => ({
      ...prev,
      emoji,
    }))
  }

  return (
    <div className="card">
      <div
        className="card-header text-center p-0"
        style={{ backgroundColor: hexGridData.color, fontSize: "2rem" }}
      >
        {hexGridData.emoji}
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
            onChange={(event) => {
              setHexGridData((prev) => ({
                ...prev,
                text: event.target.value,
              }))
            }}
          ></textarea>
        </div>
        <p>
          <a
            class="btn btn-dark"
            style={{
              width: "100%",
            }}
            data-bs-toggle="collapse"
            href="#colorPickerDropdown"
            role="button"
            aria-expanded="false"
            aria-controls="colorPickerDropdown"
          >
            Pick a color
          </a>
        </p>
        <div class="row">
          <div class="collapse multi-collapse mb-2" id="colorPickerDropdown">
            <div class="card card-body">
              <CirclePicker width="100%" onChange={onColorChange} />
            </div>
          </div>
        </div>

        <p>
          <a
            class="btn btn-dark"
            style={{
              width: "100%",
            }}
            data-bs-toggle="collapse"
            href="#emojiPickerDropdown"
            role="button"
            aria-expanded="false"
            aria-controls="emojiPickerDropdown"
          >
            Pick an emoji
          </a>
        </p>
        <div class="row">
          <div class="collapse multi-collapse" id="emojiPickerDropdown">
            <div class="card card-body">
              <EmojiPicker
                pickerStyle={{ width: "100%" }}
                onEmojiClick={onEmojiClick}
              />
            </div>
          </div>
        </div>

        <div className="card_action-container text-end mt-4">
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
