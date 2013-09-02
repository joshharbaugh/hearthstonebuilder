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
        icon: String
    });

    app.db.model('Card', CardSchema);

}