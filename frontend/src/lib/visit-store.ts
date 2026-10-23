export type VisitCounts = {
  today: number;
  month: number;
  total: number;
  day: string;
  monthKey: string;
};

export function calendarDay(now: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Dar_es_Salaam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function calendarMonth(now: Date = new Date()) {
  return calendarDay(now).slice(0, 7);
}

export function emptyVisits(now: Date = new Date()): VisitCounts {
  return { today: 0, month: 0, total: 0, day: calendarDay(now), monthKey: calendarMonth(now) };
}

export function applyUniqueVisit(data: VisitCounts, now: Date = new Date()): VisitCounts {
  const day = calendarDay(now);
  const monthKey = calendarMonth(now);
  const today = data.day === day ? data.today : 0;
  const month = data.monthKey === monthKey ? data.month : 0;
  return {
    today: today + 1,
    month: month + 1,
    total: (Number.isFinite(data.total) ? data.total : 0) + 1,
    day,
    monthKey,
  };
}

export function readVisitsForDisplay(data: VisitCounts, now: Date = new Date()): VisitCounts {
  const day = calendarDay(now);
  const monthKey = calendarMonth(now);
  return {
    today: data.day === day ? data.today : 0,
    month: data.monthKey === monthKey ? data.month : 0,
    total: Number.isFinite(data.total) ? data.total : 0,
    day,
    monthKey,
  };
}
