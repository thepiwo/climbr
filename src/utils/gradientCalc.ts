export type TrackPoint = {
    lat: number;
    lon: number;
    ele: number;
};

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Radius of the Earth in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const calculateGradient = (eleDiff: number, dist: number): number => {
    if (dist === 0) return 0;
    return (eleDiff / dist) * 100;
};

export const calculateMaxGradients = (
    track: TrackPoint[],
    distances: number[] = [10, 100, 500, 1000]
): Record<number, number> => {
    const maxGradients: Record<number, number> = {};
    for (const windowDistance of distances) {
        let maxGradient = 0;
        for (let i = 0; i < track.length; i++) {
            let totalDist = 0;
            let j = i + 1;
            while (j < track.length && totalDist < windowDistance) {
                const d = haversineDistance(track[j - 1].lat, track[j - 1].lon, track[j].lat, track[j].lon);
                totalDist += d;
                j++;
            }
            if (j >= track.length) break;

            const eleDiff = track[j - 1].ele - track[i].ele;
            const gradient = calculateGradient(eleDiff, totalDist);
            maxGradient = Math.max(maxGradient, Math.abs(gradient));
        }
        maxGradients[windowDistance] = parseFloat(maxGradient.toFixed(2));
    }

    return maxGradients;
};
