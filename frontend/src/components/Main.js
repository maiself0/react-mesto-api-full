import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Card from "./Card.js";


function Main(props) {
  const currentUser = useContext(CurrentUserContext);


  return (
    <main className="main">
      <section className="profile">
        <div className="profile__description">
          <div
            className="profile__avatar"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
            onClick={props.onEditAvatar}
          />

          <div className="profile__info">
            <div className="profile__name">
              <h1 className="profile__heading">{currentUser.name}</h1>
              <button
                type="button"
                className="profile__button-edit"
                onClick={props.onEditProfile}
              ></button>
            </div>

            <p className="profile__subheading">{currentUser.about}</p>
          </div>
        </div>

        <button
          type="button"
          className="profile__button-add"
          onClick={props.onAddPlace}
        ></button>
      </section>

      <section className="elements">
        {props.cards.map((card) => (

            <Card
              key={card._id}
              card={card}
              heading={card.name}
              likes={card.likes.length}
              url={card.link}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />

        ))}
      </section>
    </main>
  );
}

export default Main;
