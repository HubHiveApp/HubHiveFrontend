export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}