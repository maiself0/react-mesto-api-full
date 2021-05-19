import { useEffect, useState } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
//PopupWithForm для попапа удаления
import ImagePopup from "./ImagePopup";
import Register from "./Register.js";
import Login from "./Login.js";
import Api from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup.js";
import ProtectedRoute from "./ProtectedRoute.js";
import * as auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null ?? false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [jwt, setJwt] = useState('')
  const history = useHistory();



  const api = new Api({
    url: "https://api.bukhgolts.nomoredomains.icu",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`
    }
  })

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then((userInfo) => {
          setCurrentUser(userInfo);
        })
        .catch((err) => console.log(err))
  
      api
        .getCardList()
        .then((cards) => {
          setCards(cards);
        })
        .catch((err) => console.log(err))
      }
      setJwt(localStorage.getItem("jwt"))
  }, [isLoggedIn, jwt]);

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(false);
  }
  
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  //поставить лайк карточке
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  //удалениe карточки
  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(link) {
    api
      .setUserAvatar(link)
      .then(
        setCurrentUser({
          name: currentUser.name,
          about: currentUser.about,
          avatar: link.avatar,
        })
      )
      .then(closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(place) {
    api
      .addCard(place)
      .then((newCard) => setCards([newCard, ...cards]))
      .then(closeAllPopups())
      .catch((err) => console.log(err));
  }


  const [isAuthChecking, setIsAuthChecking] = useState(true)


  function handleLogin(password, email) {
    auth
      .authorize(password, email)
      .then((data) => {
          history.push("/");
          setIsLoggedIn(true);
          setUserEmail(email);
          setJwt(data.token);
          })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит, действующий он или нет
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      // здесь будем проверять токен
      if (jwt) {
        setIsAuthChecking(true);
        // проверим токен
        auth.getContent(jwt).then((res) => {
          if (res) {
            setUserEmail(res.email);
            history.push("/");
            // авторизуем пользователя
            setIsLoggedIn(true);
          }
        }).catch((err) => console.log(err))
        .finally(() => setIsAuthChecking(false));
      } else {
        setIsAuthChecking(false)
      }
    }
  }, [history, isLoggedIn]);

  function signOut() {
    localStorage.removeItem("jwt");
    history.push("/sign-in");
    setUserEmail("");
    setIsLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header userEmail={userEmail} onSignOut={signOut} />
        <Switch>
          <ProtectedRoute
            isChecking={isAuthChecking}
            isLoggedIn={isLoggedIn}
            path="/"
            exact
          >

            <Main
              isLoggedIn={isLoggedIn}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onEditProfile={handleEditProfileClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />

            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </ProtectedRoute>

          <Route path="/sign-up">
            <Register />
          </Route>

          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>

          <Route path="*">
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
