import { readFile } from "fs";
import path from "path";
import util from "util";
import to from "await-to-js";

import EventTokens from "../models/tokens";
import clientCredentials from "../utils/clientCredentials";

const calenderCallback = async (req, res, next) => {
  const read = util.promisify(readFile);
  const credentialsPath = path.join(__dirname, "..", "credentials.json");

  const [err, content] = await to(read(credentialsPath));

  if (err) {
    next(err);
  }
  const oAuth2Client = clientCredentials(JSON.parse(content));

  oAuth2Client.getToken(req.query.code, async (error, token) => {
    if (error) {
      next(error);
    }

    const tokens = new EventTokens({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      scope: token.scope,
      token_type: token.token_type,
      expiry_date: token.expiry_date,
      id: req.user._id
    });
    const [tokenError] = await to(tokens.save());

    if (tokenError) {
      next(tokenError);
    }

    res.redirect(process.env.calendarRedirectUrl);
  });
};
export default calenderCallback;
