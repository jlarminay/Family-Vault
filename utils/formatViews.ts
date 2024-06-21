export default function (views: number, type: 'lg' | 'sm' = 'lg'): string {
  // view is large, don't format
  if (type === 'lg') {
    // format with commas
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  // view is small, format
  if (type === 'sm') {
    // format with K, M, B
    if (views < 1000) {
      return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (views < 1000000) {
      return (views / 1000).toFixed(0) + 'k';
    }
    if (views < 1000000000) {
      return (views / 1000000).toFixed(0) + 'm';
    }
    return (views / 1000000000).toFixed(0) + 'b';
  }

  return '';
}
