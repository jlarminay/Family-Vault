export default function (resolution: string): string | false {
  const [width, height] = resolution.split('x').map(Number);
  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };
  const aspectRatio = `${width / gcd(width, height)}/${height / gcd(width, height)}`;

  // check if ratio is the same as the original resolution
  if (aspectRatio === resolution.replace('x', '/')) {
    return false;
  }

  return aspectRatio;
}
