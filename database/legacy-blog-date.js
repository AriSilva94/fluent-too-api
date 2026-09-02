'use strict';

const MONTHS = {
  janeiro: 1, janvier: 1, january: 1,
  fevereiro: 2, fevrier: 2, february: 2,
  marco: 3, mars: 3, march: 3,
  abril: 4, avril: 4, april: 4,
  maio: 5, mai: 5, may: 5,
  junho: 6, juin: 6, june: 6,
  julho: 7, juillet: 7, july: 7,
  agosto: 8, aout: 8, august: 8,
  setembro: 9, septembre: 9, september: 9,
  outubro: 10, octobre: 10, october: 10,
  novembro: 11, novembre: 11, november: 11,
  dezembro: 12, decembre: 12, december: 12,
};

function stripAccents(value) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function parseLegacyBlogDate(value) {
  if (typeof value !== 'string') return null;

  const text = value.trim();
  if (!text) return null;

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const normalized = stripAccents(text.toLowerCase());
  const year = normalized.match(/\b(\d{4})\b/);
  const day = normalized.match(/\b(\d{1,2})\b/);
  const month = Object.keys(MONTHS).find((name) => normalized.includes(name));

  if (!year || !day || !month) return null;

  const dayNumber = Number(day[1]);
  if (dayNumber < 1 || dayNumber > 31) return null;

  return `${year[1]}-${pad(MONTHS[month])}-${pad(dayNumber)}`;
}

module.exports = { parseLegacyBlogDate };
