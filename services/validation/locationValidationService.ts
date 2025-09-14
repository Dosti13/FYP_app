interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class LocationValidationService {
  // Pakistan bounds for validation
  private readonly PAKISTAN_BOUNDS = {
    north: 37.084,
    south: 23.635,
    east: 77.841,
    west: 60.872,
  };

  // Validate coordinates are within Pakistan
  isWithinPakistan(latitude: number, longitude: number): boolean {
    return (
      latitude >= this.PAKISTAN_BOUNDS.south &&
      latitude <= this.PAKISTAN_BOUNDS.north &&
      longitude >= this.PAKISTAN_BOUNDS.west &&
      longitude <= this.PAKISTAN_BOUNDS.east
    );
  }

  // Validate location data completeness
  validateLocationData(location: {
    province?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check coordinates
    if (location.latitude && location.longitude) {
      if (!this.isWithinPakistan(location.latitude, location.longitude)) {
        warnings.push('Location appears to be outside Pakistan');
      }
    }

    // Check province/city combination
    if (location.province && location.city) {
      if (!this.isValidProvinceCity(location.province, location.city)) {
        warnings.push('City may not belong to the selected province');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Check if city belongs to province (basic validation)
  private isValidProvinceCity(province: string, city: string): boolean {
    const validCombinations: Record<string, string[]> = {
      'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Shikarpur', 'Jacobabad'],
      'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Jhang'],
      'KPK': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu', 'Dera Ismail Khan', 'Mingora'],
      'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Hub', 'Chaman', 'Zhob'],
      'ICT': ['Islamabad'],
      'AJK': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli'],
      'GB': ['Gilgit', 'Skardu', 'Hunza', 'Ghanche'],
    };

    return validCombinations[province]?.includes(city) || false;
  }

  // Calculate distance between two points
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get major cities within radius
  getNearbyMajorCities(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Array<{ name: string; province: string; distance: number }> {
    const majorCities = [
      { name: 'Karachi', province: 'Sindh', lat: 24.8607, lng: 67.0011 },
      { name: 'Lahore', province: 'Punjab', lat: 31.5497, lng: 74.3436 },
      { name: 'Faisalabad', province: 'Punjab', lat: 31.4504, lng: 73.1350 },
      { name: 'Rawalpindi', province: 'Punjab', lat: 33.5651, lng: 73.0169 },
      { name: 'Multan', province: 'Punjab', lat: 30.1575, lng: 71.5249 },
      { name: 'Hyderabad', province: 'Sindh', lat: 25.3960, lng: 68.3578 },
      { name: 'Gujranwala', province: 'Punjab', lat: 32.1877, lng: 74.1945 },
      { name: 'Peshawar', province: 'KPK', lat: 34.0151, lng: 71.5249 },
      { name: 'Quetta', province: 'Balochistan', lat: 30.1798, lng: 66.9750 },
      { name: 'Islamabad', province: 'ICT', lat: 33.6844, lng: 73.0479 },
    ];

    return majorCities
      .map(city => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          city.lat,
          city.lng
        ) / 1000; // Convert to kilometers

        return {
          name: city.name,
          province: city.province,
          distance: Math.round(distance * 100) / 100,
        };
      })
      .filter(city => city.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
}

export const locationValidationService = new LocationValidationService();