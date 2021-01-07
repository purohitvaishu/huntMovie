import mongoose from 'mongoose';

const { Schema } = mongoose;

const movieLanguage = new Schema({
  movie_id: {
    type: Number,
  },
  iso_639_1: {
    type: String,
  },
});

export default mongoose.model('movies_languages', movieLanguage);
