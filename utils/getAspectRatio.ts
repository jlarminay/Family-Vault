export default function getAspectRatio(resolution: string) {
  const [width, height] = resolution.split('x').map(Number);
  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };
  const aspectRatio = `${width / gcd(width, height)}/${height / gcd(width, height)}`;
  return aspectRatio;
}
