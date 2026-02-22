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

  attachments: {
    type: [{
      url: String,
      name: String,
      type: String,
      size: Number,
    }],
    default: [],
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notes ||
  mongoose.model('Notes', NotesSchema);
