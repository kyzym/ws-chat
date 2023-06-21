const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = Schema(
  {
    body: { type: String, required: [true, 'Message is required'] },
    user: {
      id: Number,
      username: { type: String, required: [true, 'Name is required'] },
    },
  },
  { versionKey: false, timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
