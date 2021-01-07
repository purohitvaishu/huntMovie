import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  expiry_date: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('event_tokens', tokenSchema);
