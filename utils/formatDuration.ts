export default function (duration: number, style: 'time' | 'string' = 'time'): string {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = duration % 60;

  let finalString = '';

  // do hours
  if (hrs > 0) {
    finalString += style === 'time' ? `${hrs.toString().padStart(2, '0')}:` : `${hrs}h `;
  }

  // do minutes
  finalString += style === 'time' ? `${mins.toString().padStart(2, '0')}:` : `${mins}m `;
  finalString += style === 'time' ? `${secs.toString().padStart(2, '0')}` : `${secs}s`;

  return finalString;
}
