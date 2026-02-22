import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },

  isPublic: {
    type: Boolean,
    default: false,
  },



  images: {
    type: [String],
    default: [],
  },

  audio: {
    type: {
      url: String,
      duration: Number,
    },
    default: null,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notes ||
  mongoose.model('Notes', NotesSchema);
