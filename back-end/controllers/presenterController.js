const Presenter = require('../models/presenterModel');
const factory = require('./handlerFactory');

exports.getAllPresenters = factory.getAll(Presenter);
exports.getPresenter = factory.getOne(Presenter);
exports.createPresenter = factory.createOne(Presenter);
exports.updatePresenter = factory.updateOne(Presenter);
exports.deletePresenter = factory.deleteOne(Presenter);
