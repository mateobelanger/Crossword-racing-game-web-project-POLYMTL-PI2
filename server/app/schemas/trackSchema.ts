const MONGOOSE: any = require('mongoose');

let trackSchema = MONGOOSE.Schema({
    name: String,
    description: String,
    timesPlayed: Number,
    bestTimes:[[String, Number]],
    waypoints:[[Number, Number, Number]]
});

let Track = MONGOOSE.model("Track", trackSchema);

module.exports = Track;