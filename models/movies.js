import mongoose from 'mongoose';

const { Schema } = mongoose;

const Movies = new Schema({
  title: {
    type: String,
  },
  overview: {
    type: String,
  },
  id: {
    type: Number,
    unique: true,
  },
  release_date: {
    type: Date,
  },
  poster_path: {
    type: String,
  },
});

export default mongoose.model('movies', Movies);
