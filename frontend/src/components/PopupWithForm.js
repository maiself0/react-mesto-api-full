import React from "react";

function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__button-close"
          onClick={props.onClose}
        ></button>

        <form
          className={`popup__form popup__form_type_${props.name}`}
          name={`${props.name}`}
          noValidate
          onSubmit={props.onSubmit}
        >
          <h2 className="popup__heading">{`${props.title}`}</h2>

          {props.children}

          <button className="popup__button-submit">
            {`${props.buttonLabel}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
