import { google } from 'googleapis';
import to from 'await-to-js';

const deleteEvent = async (auth, eventData) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });

    const params = {
      calendarId: 'primary',
      eventId: eventData.event_id,
    };

    const [err] = await to(calendar.events.delete(params));
    if (err) {
      throw err.response.status;
    }
    return;
  } catch (err) {
    throw err;
  }
};

export default deleteEvent;
