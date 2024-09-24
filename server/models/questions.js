// Question Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tag = require('./tags');
const Answer = require('./answers'); 

const questionSchema = new Schema({
  title: String,
  summary: String,
  text: String,
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  asked_by: String,
  ask_date_time: Date,
  views: Number,
  votes: { type: Number, default: 0 } // Default votes to 0
}, { minimize: false });

questionSchema.pre('save', function(next) {
  if (!this.answers) {
    this.answers = [];
  }
  next();
});

questionSchema.pre('save', function(next) {
  if (!this.tags) {
    this.tags = [];
  }
  next();
});

questionSchema.index({ title: 'text', summary: 'text', text: 'text' });

module.exports = mongoose.model('Question', questionSchema);
