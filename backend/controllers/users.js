const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const AuthorizationError = require('../errors/auth-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('Пользователи не найдены.'))
    .then((users) => res.send(users.map(
      (user) => ({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar,
      }),
    )))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id пользователя.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id пользователя.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const password = hash;
      User.create({
        name, about, avatar, email, password,
      })
        .then((user) => res.send({
          _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send({ message: 'Данный email уже есть в базе.' });
          }
          if (err.name === 'ValidationError') {
            throw new ValidationError('Переданы некорректные данные при создании пользователя.');
          }
          next(err);
        })
        .catch(next);
    });
};

// обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about }, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля.');
      } else if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id профиля.');
      }
      next(err);
    })
    .catch(next);
};

// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar }, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара пользователя.');
      } else if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id профиля.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          // аутентификация успешна
          return user;
        });
    })
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthorizationError(err.message);
    })
    .catch(next);
};
