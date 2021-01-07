import mongoose from 'mongoose';

const { Schema } = mongoose;

const watchList = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  watchlist_movie_id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default mongoose.model('watchList', watchList);
