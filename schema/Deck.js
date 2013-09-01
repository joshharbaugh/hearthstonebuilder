exports = module.exports = function(app, mongoose) {

    var DeckSchema = new mongoose.Schema({
        _id: String,
        name: String,
        id: Number,
        resource_uri: String,
        description: String,
        class: String,
        author: String,
        username: String,
        created: Date,
        rating: Number,
        cards: [{qty: Number, id: Number, name: String}]
    });

    app.db.model('Deck', DeckSchema);

}