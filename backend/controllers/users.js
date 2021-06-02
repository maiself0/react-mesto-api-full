const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const AuthorizationError = require('../errors/auth-err');
const ConflictingRequestError = require('../errors/conflicting-request');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

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
        next(new ValidationError('Переданы некорректные данные _id пользователя.'));
      } else {
        next(err);
      }
    })
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные _id пользователя.'));
      } else {
        next(err);
      }
    })
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
            next(new ConflictingRequestError('Данный email уже есть в базе.'));
          }
          if (err.name === 'ValidationError') {
            next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
          } else {
            next(err);
          }
        })
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
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные _id профиля.'));
      } else {
        next(err);
      }
    })
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
        next(new ValidationError('Переданы некорректные данные при обновлении аватара пользователя.'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные _id профиля.'));
      } else {
        next(err);
      }
    })
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
      const token = jwt.sign({ _id: user._id }, NODE_ENV !== 'production' ? 'secret' : JWT_SECRET, { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      next(new AuthorizationError(err.message));
    })
};
