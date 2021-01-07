import mongoose from 'mongoose';

const { Schema } = mongoose;

const UpcomingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  id: {
    type: Number,
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  genres: {
    type: [Number],
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

export default mongoose.model('upcoming_movies', UpcomingSchema);
