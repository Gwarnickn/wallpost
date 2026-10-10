import type { Post } from "../types/post";

const pad = (value: number) => String(value).padStart(2, "0");

const toIcsDate = (date: Date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
  `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/**
 * Generates and downloads an .ics file for the given post.
 *
 * NOTE: This is an intentionally isolated placeholder so the download can later
 * be swapped for a Capacitor calendar plugin.
 */
export const exportToCalendar = (post: Post): void => {
  const start = new Date(post.startDate);
  const end = new Date(post.endDate);

  const dtStart = toIcsDate(Number.isNaN(start.getTime()) ? new Date() : start);
  const dtEnd = toIcsDate(
    Number.isNaN(end.getTime()) ? new Date(Date.now() + 60 * 60 * 1000) : end,
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wallpost//feed//EN",
    "BEGIN:VEVENT",
    `UID:${post.id}@wallpost`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(post.title)}`,
    `LOCATION:${escapeIcsText(`${post.lat},${post.lng}`)}`,
    `DESCRIPTION:${escapeIcsText(post.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${post.title || "event"}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
