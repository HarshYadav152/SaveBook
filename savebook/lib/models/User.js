import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5
  },
  description: {
    type: String,
    required: true,
    minlength: 5
  },
  tag: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    default: Date.now
  }
  // No user field for testing (no auth required)
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profileImage: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },

});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);