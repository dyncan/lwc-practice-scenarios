/**
 * Calculates distance between two points on Earth given by their latitude and longitude coordinates.
 *
 * @param {Object} start Object with `latitude` and `longitude` properties representing the starting point.
 * @param {Object} end Object with `latitude` and `longitude` properties representing the ending point.
 * @param {Number} decimals (optional) Number of decimal places in the output. Defaults to 2.
 * @returns {Number} Distance between two points in kilometers with specified number of decimal places.
 */
export function calculateDistance(start, end, decimals = 2) {
  const EARTHRADIUS = 6371; // km

  const lat1 = toRadians(parseFloat(start.latitude));
  const lat2 = toRadians(parseFloat(end.latitude));
  const lon1 = parseFloat(start.longitude);
  const lon2 = parseFloat(end.longitude);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = EARTHRADIUS * c;

  return Number(d.toFixed(decimals));
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
