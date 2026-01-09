import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    encryptedKey: {
        type: String, // NDK encrypted with UMK
        default: null
    },
    contentIv: {
        type: String, // IV for content
        default: null
    },
    titleIv: {
        type: String, // IV for title
        default: null
    },
    keyIv: {
        type: String, // IV for encryptedKey
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.models.Notes || mongoose.model('Notes', NotesSchema);