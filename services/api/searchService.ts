// services/searchService.ts
import axios from 'axios';

export interface PlaceFeature {
  type: string;
  geometry: { type: string; coordinates: [number, number] };
  properties: {
    name: string;
    city?: string;
    country?: string;
    state?: string;
    [key: string]: any;
  };
}
export const PAKISTAN_BBOX = {
  minLat: 23.6345,  // Southern-most point
  minLon: 60.8727,  // Western-most point
  maxLat: 37.0841,  // Northern-most point
  maxLon: 77.8375,  // Eastern-most point
};// Fetch places from Photon API
const PAKISTAN_BBOX_STR = `${PAKISTAN_BBOX.minLon},${PAKISTAN_BBOX.minLat},${PAKISTAN_BBOX.maxLon},${PAKISTAN_BBOX.maxLat}`;
export async function searchPlaces(
  query: string,
  limit: number = 5,
): Promise<PlaceFeature[]> {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}&lang=en&bbox=${PAKISTAN_BBOX_STR}`;
    const response = await axios.get(url);
    return response.data.features as PlaceFeature[];
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}
