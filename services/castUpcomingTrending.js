import unirest from "unirest";

const cast = id => new Promise((resolve) => {
  const req = unirest.get(`${process.env.castBaseUrl}${id.toString()}/credits`);
  req.query({
    api_key: process.env.tmdb_key,
  });
  req.end(async (result) => {
    if (result.error) {
      throw new Error(result.error);
    }

      const data = result.body.cast;
      resolve(data);
    });
  });

export default cast;
