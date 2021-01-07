import { google } from "googleapis";

const clientCredentials = credentials => {
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris
  } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  );
  return oAuth2Client;
};
export default clientCredentials;
