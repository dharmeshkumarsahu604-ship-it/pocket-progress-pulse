/**
 * Google Maps integration utilities
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Generate a Google Maps URL for displaying a location
 */
export const getMapUrl = (coords: Coordinates, name?: string): string => {
  const { latitude, longitude } = coords;
  const query = name ? encodeURIComponent(name) : `${latitude},${longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

/**
 * Generate a Google Maps directions URL
 */
export const getDirectionsUrl = (coords: Coordinates): string => {
  const { latitude, longitude } = coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
};

/**
 * Generate a static map image URL (using Google Maps Static API)
 * Note: This requires a Google Maps API key in production
 */
export const getStaticMapUrl = (
  coords: Coordinates,
  zoom: number = 14,
  size: { width: number; height: number } = { width: 600, height: 300 }
): string => {
  const { latitude, longitude } = coords;
  // For production, add your API key: &key=YOUR_API_KEY
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${size.width}x${size.height}&markers=color:red%7C${latitude},${longitude}`;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (
  coords1: Coordinates,
  coords2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coords2.latitude - coords1.latitude);
  const dLon = toRadians(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coords1.latitude)) *
      Math.cos(toRadians(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Get user's current location
 */
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
