import mongoose from 'mongoose';

const { Schema } = mongoose;

const Languages = new Schema({
  iso_639_1: {
    type: String,
    required: true,
    unique: true,
  },
  english_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('languages', Languages);
