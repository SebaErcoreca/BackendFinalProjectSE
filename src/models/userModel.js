import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const userModel = mongoose.model(collection, schema);

export default userModel; 