

module.exports = {
    mutipleMongooseToObject: function (monggooes) {
        return mongoose.map(mongoose => mongoose.toObject());

    },
    mongooseToObject: function (monggooes) {
        return monggooes ? monggooes.toObject() : monggooes;
    }
}