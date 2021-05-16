const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Карточки не найдены.'))
    .then((cards) => res.send(cards.map(
      (card) => ({
        _id: card._id,
        name: card.name,
        link: card.link,
        likes: card.likes,
        owner: card.owner,
        createdAt: card.createdAt,
      }),
    )))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((cardCheck) => {
      if (!(req.user._id === cardCheck.owner.toString())) {
        throw new Error('NoRights');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
        .then((card) => {
          res.send({
            _id: card._id,
            name: card.name,
            link: card.link,
            likes: card.likes,
            owner: card.owner,
            createdAt: card.createdAt,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id.');
      } else if (err.message === 'NoRights') {
        res.status(403).send({ message: 'Недостаточно прав для удаления карточки.' });
      }
      next(err);
    })
    .catch(next);
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id карточки для постановки лайка.');
      }
      next(err);
    })
    .catch(next);
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные _id карточки для снятии лайка.');
      }
      next(err);
    })
    .catch(next);
};
