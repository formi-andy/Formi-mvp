export function formatTime(milliseconds: number) {
  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;

  const hours = Math.floor(milliseconds / oneHour);
  milliseconds %= oneHour;
  const minutes = Math.floor(milliseconds / oneMinute);
  milliseconds %= oneMinute;
  const seconds = Math.floor(milliseconds / oneSecond);

  const timeComponents = [
    hours > 0 ? `${hours}h` : "",
    minutes > 0 ? `${minutes}m` : "",
    seconds > 0 ? `${seconds}s` : "",
  ].filter((component) => component);

  if (timeComponents.length === 0) {
    return "N/A";
  }

  return timeComponents.join(" ");
}
