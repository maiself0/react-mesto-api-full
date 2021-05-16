import React from 'react';


function ImagePopup(props) {
  const hash = React.useRef('[img.link, img.name]');

  React.useEffect(() => {
    hash.current = [props.card.link, props.card.name]
  })

 

  return (
    <div className={`popup popup_type_view-image ${props.card ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_image">
      
        <button
          type="button"
          className="popup__button-close popup__button-close_image"
          onClick={props.onClose}
        ></button>

        <img className="popup__image" 
          src={props.card.link ? props.card.link : hash.current[0]}
          alt={`${props.card.name ? props.card.name : hash.current[1]} (фото)`}/>

        <p className="popup__caption">{props.card.name ? props.card.name : hash.current[1]}</p>
      </div>
    </div>
  );
}

export default ImagePopup;