const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        capital: {
            type: String,
            required: false
        },
        leader: {
            type: String,
            required: false
        },
        flag: {
            type: String,
            required: false
        },
        landmarks: [String],
        parent: {
            type: String,
            required: false
        }
    }
)

const Region = model('Region', regionSchema);
module.exports = Region;