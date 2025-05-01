export const calculateTotalDistance = (locations) => {
    if (!locations || locations.length < 2) return 0; // No distance if fewer than 2 points

    const toRadians = (degrees) => (degrees * Math.PI) / 180; // Convert degrees to radians
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    let totalDistance = 0;

    for (let i = 1; i < locations.length; i++) {
        const prev = locations[i - 1];
        const curr = locations[i];

        const dLat = toRadians(curr.latitude - prev.latitude);
        const dLon = toRadians(curr.longitude - prev.longitude);

        const lat1 = toRadians(prev.latitude);
        const lat2 = toRadians(curr.latitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c; // Distance in kilometers

        totalDistance += distance;
    }

    return totalDistance.toFixed(2);
};