export default function (duration: number): string {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = duration % 60;

  let finalString = '';

  if (hrs > 0) {
    finalString += `${hrs.toString().padStart(2, '0')}:`;
  }

  finalString += `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return finalString;
}
