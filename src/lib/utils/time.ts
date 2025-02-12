// Time format: HH:MM:SS
type TimeString = string;

interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

// Convert time string to seconds
export function timeToSeconds(time: TimeString): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Convert seconds to time string
export function secondsToTime(totalSeconds: number): TimeString {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(num => num.toString().padStart(2, '0'))
    .join(':');
}

// Parse time string into parts
export function parseTime(time: TimeString): TimeParts {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return { hours, minutes, seconds };
}

// Format time parts into string
export function formatTime({ hours, minutes, seconds }: TimeParts): TimeString {
  return [hours, minutes, seconds]
    .map(num => num.toString().padStart(2, '0'))
    .join(':');
}

// Add two times together
export function addTimes(time1: TimeString, time2: TimeString): TimeString {
  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);
  return secondsToTime(seconds1 + seconds2);
}

// Calculate end time based on start time and duration
export function calculateEndTime(startTime: TimeString, duration: TimeString): TimeString {
  return addTimes(startTime, duration);
}

// Validate time string format
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Compare two times
export function compareTimes(time1: TimeString, time2: TimeString): number {
  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);
  return seconds1 - seconds2;
}

// Format duration for display
export function formatDuration(duration: TimeString): string {
  const { hours, minutes, seconds } = parseTime(duration);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Calculate time difference between two times
export function getTimeDifference(time1: TimeString, time2: TimeString): TimeString {
  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);
  return secondsToTime(Math.abs(seconds2 - seconds1));
}