const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const googleSchema = new Schema(
    {
        id: {
            type : String
        },
        verified_email: {
            type : String
        },
        picture: {
            type :String,
        }
    }
);

const GoogleUser = mongoose.model('GoogleUser', googleSchema)
module.exports = GoogleUser