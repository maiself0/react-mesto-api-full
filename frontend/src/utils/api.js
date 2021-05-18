const onError = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject("ОшибкаFehler");
};

class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  //профиль
  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers
    }).then(onError);
  }

  //карточки
  getCardList() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers
    }).then(onError);
  }

  //профиль + карточки
  getUserInfoAndInitialCards() {
    return Promise.all([api.getUserInfo(), api.getCardList()])
  }


  //добавить данные профиля на сервер
  setUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(onError);
  }
  //добавление новой карточки
  addCard(place) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(place),
    }).then(onError);
  }

  removeCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(onError);
  }

  addLike(id) {
    return fetch(`${this._url}/cards/${id}/likes/`, {
      method: "PUT",
      headers: this._headers,
    }).then(onError);
  }

  removeLike(id) {
    return fetch(`${this._url}/cards/${id}/likes/`, {
      method: "DELETE",
      headers: this._headers,
    }).then(onError);
  }

  changeLikeCardStatus(id, isLiked) {
    return isLiked ? this.addLike(id) : this.removeLike(id)
  }

  setUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(onError);
  }
}
const jwt = localStorage.getItem("jwt");

const api = new Api({
  url: "https://api.bukhgolts.nomoredomains.icu",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${jwt}`
  }
}) 

export default api;