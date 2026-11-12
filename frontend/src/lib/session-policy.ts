const MIN_SECONDS = 5 * 60;
const MAX_SECONDS = 30 * 24 * 60 * 60;

export const SESSION_TIMEOUT_PRESETS = [
  { id: "30m", label: "30 minutes idle", idleSeconds: 30 * 60, maxSeconds: 8 * 60 * 60 },
  { id: "1h", label: "1 hour idle", idleSeconds: 60 * 60, maxSeconds: 8 * 60 * 60 },
  { id: "4h", label: "4 hours idle", idleSeconds: 4 * 60 * 60, maxSeconds: 12 * 60 * 60 },
  { id: "workday", label: "Working day (8 hours)", idleSeconds: 8 * 60 * 60, maxSeconds: 12 * 60 * 60 },
  { id: "1d", label: "1 day", idleSeconds: 24 * 60 * 60, maxSeconds: 24 * 60 * 60 },
] as const;

export function clampSessionSeconds(value: number, min = MIN_SECONDS, max = MAX_SECONDS) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function secondsToHoursMinutes(seconds: number) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  return { hours: Math.floor(s / 3600), minutes: Math.floor((s % 3600) / 60) };
}

export function hoursMinutesToSeconds(hours: number, minutes: number) {
  const h = Number.isFinite(hours) ? Math.max(0, Math.floor(hours)) : 0;
  const m = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;
  return clampSessionSeconds(h * 3600 + m * 60);
}

export function formatDuration(seconds: number) {
  const { hours, minutes } = secondsToHoursMinutes(seconds);
  if (hours && minutes) return `${hours} h ${minutes} min`;
  if (hours) return hours === 1 ? "1 hour" : `${hours} hours`;
  if (minutes) return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  return "0 minutes";
}

export function normalizeSessionPolicy(input: {
  ssoSessionIdleTimeout?: number;
  ssoSessionMaxLifespan?: number;
  clientSessionIdleTimeout?: number;
  clientSessionMaxLifespan?: number;
  ssoSessionIdleTimeoutRememberMe?: number;
  ssoSessionMaxLifespanRememberMe?: number;
  accessTokenLifespan?: number;
  rememberMe?: boolean;
}) {
  const idle = clampSessionSeconds(Number(input.ssoSessionIdleTimeout));
  const max = Math.max(idle, clampSessionSeconds(Number(input.ssoSessionMaxLifespan), idle));
  const clientIdle = clampSessionSeconds(Number(input.clientSessionIdleTimeout || idle));
  const clientMax = Math.max(clientIdle, clampSessionSeconds(Number(input.clientSessionMaxLifespan || max), clientIdle));
  const rememberIdle = clampSessionSeconds(Number(input.ssoSessionIdleTimeoutRememberMe || idle));
  const rememberMax = Math.max(rememberIdle, clampSessionSeconds(Number(input.ssoSessionMaxLifespanRememberMe || max), rememberIdle));
  const accessToken = clampSessionSeconds(Number(input.accessTokenLifespan || 300), 60, 60 * 60);
  return {
    ssoSessionIdleTimeout: idle,
    ssoSessionMaxLifespan: max,
    clientSessionIdleTimeout: clientIdle,
    clientSessionMaxLifespan: clientMax,
    ssoSessionIdleTimeoutRememberMe: rememberIdle,
    ssoSessionMaxLifespanRememberMe: rememberMax,
    accessTokenLifespan: accessToken,
    rememberMe: Boolean(input.rememberMe),
  };
}
