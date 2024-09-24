const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: String,
  commented_by: { type: String, required: true },
  comment_date_time: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Comment', commentSchema);
