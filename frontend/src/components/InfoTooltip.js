import v from "../images/UnionV.png";
import x from "../images/UnionX.png";

export default function InfoTooltip(props) {
  function handleClose() {
    props.onMessage("");
  }

  return (
    <>
      <div className="register-info">
        <div className="register-info__popup">
          <button
            type="button"
            className="popup__button-close"
            onClick={handleClose}
          ></button>
          <div
            className="register-info__pic"
            style={
              props.message === "Вы успешно зарегистрировались!"
                ? { backgroundImage: `url(${v})` }
                : { backgroundImage: `url(${x})` }
            }
          />
          <p className="register-info__text">{props.message}</p>
        </div>
      </div>
    </>
  );
}
