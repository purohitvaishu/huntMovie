import { readFile } from 'fs';
import { join } from 'path';
import util from 'util';

import tokensModel from '../models/tokens';
import clientCredentials from '../utils/clientCredentials';

const SCOPES = [process.env.SCOPES];
const read = util.promisify(readFile);

const getAccessToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: process.env.access_type,
    scope: SCOPES,
  });
  const arr = ['redirect', authUrl];
  return arr;
};

export const authorize = async (userId, credentials) => {
  const oAuth2Client = clientCredentials(credentials);

  try {
    const data = await tokensModel.findOne({ id: userId });
    if (data === null) {
      const arr = getAccessToken(oAuth2Client);
      return arr;
    }
    const token = {};
    token.access_token = data.access_token;
    token.refresh_token = data.refresh_token;
    token.scope = data.scope;
    token.token_type = data.token_type;
    token.expiry_date = data.expiry_date;

    oAuth2Client.setCredentials(token);

    const arr = ['event', oAuth2Client];
    return arr;
  } catch (err) {
    throw err;
  }
};

export const tokens = async (userId) => {
  const credentialsPath = join(__dirname, '..', process.env.credentials);
  try {
    const content = await read(credentialsPath);
    const arr = await authorize(userId, JSON.parse(content));
    return arr;
  } catch (err) {
    throw err;
  }
};
