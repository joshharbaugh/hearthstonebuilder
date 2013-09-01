exports = module.exports = function(app, mongoose) {

    var CardSchema = new mongoose.Schema({
        _id: String,
        last_modified: Date,
        name: String,
        id: Number,
        resource_uri: String,
        description: String,
        class: String,
        type: String,
        cost: Number,
        attack: Number,
        health: Number,
        quality: String
    });

    app.db.model('Card', CardSchema);

}