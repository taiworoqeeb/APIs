const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A movie must have a name'],
      unique: true
    },
    rating: {
      type: Number,
      default: 4.5},
    price: {
      type: Number,
      required: [true, 'A movie must have a price']
    },
    description: {
      type: String,
      required: [true, 'There must be a movie description'],
      trim: true
    },
    durations: {
      type: Number,
      required: [true, "A movie must have a duration"]
    },
    Genre: {
      type: String,
      required: true
    },
    imageCover: {
      type: String,
      required: [true, 'A movie must have a cover Image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    releaseDate: [Date]
  });
  const Movie = mongoose.model('Movie', movieSchema);

  module.exports = Movie;