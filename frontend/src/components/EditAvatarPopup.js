import { useRef } from "react";
import PopupWithForm from "./PopupWithForm.js";

function EditAvatarPopup(props) {
  const avatarUrlRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();

    props.onUpdateAvatar({
      /* Значение инпута, полученное с помощью рефа */
      avatar: avatarUrlRef.current.value
    });

    event.target.reset();
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      buttonLabel="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        type="url"
        name="src"
        className="popup__input popup__input_text_src"
        id="avatar-url"
        ref={avatarUrlRef}
        required
      />
      <span className="avatar-url-error error"></span>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;