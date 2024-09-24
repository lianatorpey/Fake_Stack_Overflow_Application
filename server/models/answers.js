// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments');

const answerSchema = new Schema({
  text: String,
  ans_by: String,
  ans_date_time: Date,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  votes: { type: Number, default: 0 } // Default votes to 0
});

module.exports = mongoose.model('Answer', answerSchema);

