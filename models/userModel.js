import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    root: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/sierragaming/image/upload/v1648911144/Pngtree_graphic_default_avatar_5938131_colh3a.png'
    }
}, {
    timestamps: true
})

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)
export default Dataset