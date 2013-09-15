exports = module.exports = function(app, mongoose) {

    var CardSchema = new mongoose.Schema({
        last_modified: Date,
        name: String,
        id: Number,
        resource_uri: String,
        description: String,
        class: String,
        classs: String,
        type: String,
        cost: Number,
        attack: Number,
        health: Number,
        quality: Number,
        image: String,
        icon: String,
        limit: Number,
        qty: Number,
        remaining: Number
    });

    app.db.model('Card', CardSchema);

    var DeckSchema = new mongoose.Schema({
        name: String,
        description: String,
        class: String,
        author: String,
        username: String,
        created: Date,
        last_modified: Date,
        rating: Number,
        length: Number,
        cards: [CardSchema]
    });

    app.db.model('Deck', DeckSchema);

}