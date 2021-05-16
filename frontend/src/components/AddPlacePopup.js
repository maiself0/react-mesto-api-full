import { useRef } from "react";
import PopupWithForm from "./PopupWithForm.js";

function AddPlacePopup(props) {
  const placeNameRef = useRef();
  const placeUrlRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();

    props.onAddPlace({
      /* Значение инпута, полученное с помощью рефа */
      name: placeNameRef.current.value,
      link: placeUrlRef.current.value,
    });
    
    event.target.reset();
  }

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      buttonLabel="Создать"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Название"
        name="place"
        className="popup__input popup__input_text_heading"
        id="place-name"
        minLength="2"
        maxLength="30"
        ref={placeNameRef}
        required
      />
      <span className="place-name-error error"></span>
      <input
        type="url"
        placeholder="Ссылка на картинку"
        name="src"
        className="popup__input popup__input_text_src"
        id="place-url"
        ref={placeUrlRef}
        required
      />
      <span className="place-url-error error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
