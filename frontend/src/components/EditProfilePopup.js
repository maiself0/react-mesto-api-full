import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import PopupWithForm from "./PopupWithForm.js";

function EditProfilePopup(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
      setName(currentUser.name);
      setDescription(currentUser.about);
  }, [currentUser]);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      buttonLabel="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="heading"
        className="popup__input popup__input_text_heading"
        required
        minLength="2"
        maxLength="40"
        id="profile-name"
        value={name || ""}
        onChange={handleNameChange}
      />
      <span className="profile-name-error error"></span>
      <input
        type="text"
        name="subheading"
        className="popup__input popup__input_text_subheading"
        required
        minLength="2"
        maxLength="200"
        id="profile-desc"
        value={description || ""}
        onChange={handleDescriptionChange}
      />
      <span className="profile-desc-error error"></span>
    </PopupWithForm>
  );
}
export default EditProfilePopup;
