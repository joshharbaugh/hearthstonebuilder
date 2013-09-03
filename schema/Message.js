exports = module.exports = function(app, mongoose) {

    var MessageSchema = new mongoose.Schema({
        username: String,
        id: Number,
        resource_uri: String,
        message: String,
        from: String,
        subject: String,
        status: String,
        created: Date
    });

    app.db.model('Message', MessageSchema);

}