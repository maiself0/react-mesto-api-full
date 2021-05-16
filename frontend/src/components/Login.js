import { useState } from "react";


export default function Login(props) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      return;
    }
    props.onLogin(userData.password, userData.email)

  }

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__top-container">
          <h2 className="login__header">Вход</h2>
          <input
            className="login__input"
            id="email"
            required
            name="email"
            type="text"
            value={userData.email}
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="login__input"
            id="password"
            required
            name="password"
            type="password"
            value={userData.password}
            placeholder="Пароль"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="login__button">
          Войти
        </button>
      </form>
    </div>
  );
}
