import { useContext } from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card(props) {

  const currentUser = useContext(CurrentUserContext);

  //отображение кнопки удаления
  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `element__delete ${isOwn ? 'element__delete_visible' : 'element__delete_hidden'}`
  ); 
  
  //отображение лайка юзера
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__like ${isLiked ? 'element__like_active' : ''}`;

  //открытие попапа с к картинкой
  function handleClick() {
    props.onCardClick(props.card)
  }
  //поставить лайк
  function handleLikeClick() {
    props.onCardLike(props.card)
  }

  //удалить
  function handleDeleteClick() {
    props.onCardDelete(props.card)
  }

  return (
    <article className="element">
      <div className="element__photo" style={{ backgroundImage: `url(${props.card.link})` }} onClick={handleClick}/>
      <div className="element__caption">
        <h2 className="element__heading">{props.heading}</h2>
        <div className="element__like-container">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="element__like-count">{props.likes}</p>
        </div>
      </div>
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
    </article>
  )
}

export default Card;