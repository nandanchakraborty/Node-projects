const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema(
  {
    title: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);



module.exports = mongoose.model('Post', postSchema);