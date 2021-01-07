import { google } from 'googleapis';
import to from 'await-to-js';

const createEvent = async (auth, movie) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
      summary: movie.title,
      start: {
        dateTime: movie.release_date,
        timeZone: process.env.timeZone,
      },
      end: {
        dateTime: movie.release_date,
        timeZone: process.env.timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: process.env.popupMinutes },
          { method: 'popup', minutes: process.env.emailMinutes },
        ],
      },
    };
    const [err, eventData] = await to(calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: event,
    }));
    if (err) {
      throw err;
    }
    return eventData.data.id;
  } catch (err) {
    throw err;
  }
};

export default createEvent;
