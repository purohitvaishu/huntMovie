/* eslint-disable strict */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const trendingSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  release_date: {
    type: Date,
    required: true,
  },
  genres: {
    type: [],
  },
  languages: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  cast: {
    type: [Object],
  },
});

export default mongoose.model('trending_movies', trendingSchema);
