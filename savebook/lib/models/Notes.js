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

  isWhiteboard: {
    type: Boolean,
    default: false,
  },

  whiteboardData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  // Encrypted with a random share key embedded in the public share URL fragment
  shareEncryptedContent: {
    type: String,
    default: null,
  },

  // Soft delete implementation for recovery window
  isDeleted: {
    type: Boolean,
    default: false,
    index: true, // Index for efficient queries excluding soft-deleted notes
  },

  deletedAt: {
    type: Date,
    default: null,
  },
});

// Add TTL index: automatically delete soft-deleted notes after 30 days
// This removes records permanently after 30-day recovery period
NotesSchema.index(
  { deletedAt: 1 },
  {
    expireAfterSeconds: 2592000, // 30 days in seconds
    partialFilterExpression: { isDeleted: true }
  }
);

export default mongoose.models.Notes ||
  mongoose.model('Notes', NotesSchema);
