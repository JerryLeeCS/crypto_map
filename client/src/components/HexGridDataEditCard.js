import React, { useState } from "react"
import PropTypes from "prop-types"
import { CirclePicker } from "react-color"
import EmojiPicker from "emoji-picker-react"
const defaultHexGridData = {
  Color: "#000000",
  Text: "",
  Emoji:
    "https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/1f60a.png",
}

function HexGridDataEditCard(props) {
  const [hexGridData, setHexGridData] = useState(defaultHexGridData)

  function onMessageChange(event) {
    setHexGridData((prev) => ({
      ...prev,
      Text: event.target.value,
    }))
  }

  function onColorChange({ hex: Color }) {
    setHexGridData((prev) => ({
      ...prev,
      Color,
    }))
  }

  function onEmojiClick(event) {
    const Emoji =
      event.target.type === "button"
        ? event.target.firstChild.currentSrc
        : event.target.currentSrc
    setHexGridData((prev) => ({
      ...prev,
      Emoji,
    }))
  }

  return (
    <div
      className="card"
      hidden={props.hidden}
      style={{
        overflow: "auto",
        maxHeight: "calc(100vh - calc(10vh + 1rem + 36px))",
      }}
    >
      <div
        className="card-header text-center"
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: hexGridData.Color,
          fontSize: "2rem",
        }}
      >
        <img src={hexGridData.Emoji}></img>
      </div>
      <div className="card-body" style={{ borderColor: hexGridData.Color }}>
        <div className="mb-3">
          <label htmlFor="hexGridDataTextArea" className="form-label">
            message
          </label>
          <textarea
            className="form-control"
            id="hexGridDataTextArea"
            rows="3"
            onChange={onMessageChange}
            value={hexGridData.Text}
            maxLength={props.textLengthLimit}
            required
          ></textarea>
          <small className="form-text text-muted">
            {hexGridData.Text ? hexGridData.Text.length : 0}/
            {props.textLengthLimit}
          </small>
        </div>

        <div className="accordion" id="colorEmojiAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="colorPickerHeader">
              <button
                className="btn btn-dark"
                style={{
                  width: "100%",
                }}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#colorPickerCollapse"
                aria-expanded="true"
                aria-controls="colorPickerCollapse"
              >
                Pick a color
              </button>
            </h2>
            <div
              id="colorPickerCollapse"
              className="accordion-collapse collapse show"
              aria-labelledby="colorPickerHeader"
              data-bs-parent="#colorEmojiAccordion"
            >
              <div className="accordion-body">
                <CirclePicker width="100%" onChange={onColorChange} />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="emojiPickerHeader">
              <button
                className="btn btn-dark"
                style={{
                  width: "100%",
                }}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#emojiPickerCollapse"
                aria-expanded="false"
                aria-controls="emojiPickerCollapse"
              >
                Pick an emoji
              </button>
            </h2>
            <div
              id="emojiPickerCollapse"
              className="accordion-collapse collapse"
              aria-labelledby="emojiPickerHeader"
              data-bs-parent="#colorEmojiAccordion"
            >
              <EmojiPicker
                pickerStyle={{ width: "100%" }}
                onEmojiClick={onEmojiClick}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="collapse multi-collapse" id="emojiPickerDropdown">
            <div className="card card-body p-0"></div>
          </div>
        </div>

        <div className="card_action-container text-end mt-4">
          <button
            type="button"
            className="btn btn-light me-2"
            onClick={() => {
              props.onCreate(hexGridData)
              setHexGridData(defaultHexGridData)
            }}
            disabled={props.isCreateDisabled}
          >
            Create
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={props.onCancel}
          >
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
  hidden: PropTypes.bool,
  textLengthLimit: PropTypes.number,
}

export default HexGridDataEditCard
