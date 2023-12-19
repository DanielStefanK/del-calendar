import { createEvents, type NodeCallback } from "ics";

const createCalendarEvents = (
  events: Array<{ title: string; date: Date; durationMin: number }>,
  cb: NodeCallback,
  withAlarm = false,
) => {
  return createEvents(
    events.map((r) => ({
      title: r.title,
      start: [
        r.date.getFullYear(),
        r.date.getMonth() + 1,
        r.date.getDate(),
        r.date.getHours(),
        r.date.getMinutes(),
      ],
      duration: { minutes: r.durationMin },
      alarms: withAlarm
        ? [
            {
              action: "audio",
              description: "Reminder",
              trigger: { minutes: 15, before: true },
              repeat: 1,
              attachType: "VALUE=URI",
              attach: "Glass",
            },
          ]
        : undefined,
    })),
    cb,
  );
};

const downloadCalendarEvents = async (
  events: Array<{ title: string; date: Date; durationMin: number }>,
  filename: string,
  withAlarm = false,
) => {
  const file = await new Promise((resolve, reject) => {
    createCalendarEvents(
      events,
      (error, value) => {
        if (error) {
          reject(error);
        }

        resolve(new File([value], filename, { type: "text/calendar" }));
      },
      withAlarm,
    );
  });

  const url = URL.createObjectURL(file as File);

  // trying to assign the file URL to a window could cause cross-site
  // issues so this is a workaround using HTML5
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
};

export { createCalendarEvents, downloadCalendarEvents };
