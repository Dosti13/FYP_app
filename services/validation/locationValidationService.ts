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

  // CRITICAL: Polygon points are [LONGITUDE, LATITUDE] format
  private readonly PAKISTAN_POLYGON: [number, number][] = [
    [74.58293619663763,31.07923824461552],
[74.61664928540695,31.486962324405532],
[74.63977065790685,31.570721850921487],
[74.50104242290736,31.728182816619118],
[74.56462619728212,31.747846671644073],
[74.62820997165689,31.880468421036888],
[74.79583992228129,31.963873218377945],
[74.99815193165557,32.05210167730369],
[75.25826737227962,32.10108077390133],
[75.39121526415414,32.23808251588423],
[75.18890325477987,32.428562500755405],
[75.05595536290535,32.50171720185722],
[74.85364335353108,32.47246245264806],
[74.63399031478188,32.745136376980795],
[73.64555164041045,33.12838582347419],
[73.5761875229107,33.875481859183104],
[73.4023978977291,34.14999232035762],
[73.86154386834872,34.378877878580205],
[74.02518870223535,34.81501132007957],
[77.36968208348641,35.0366179498986],
[75.71954924509848,37.20241068518945],
[71.80048375392714,36.70792721641068],
[70.3566175203377,33.845893695633414],
[69.53155110114373,32.115741488136905]
,[64.99368579557694,29.45816720057914],
[62.105953328398044,29.278408990187916],
[63.756086166785984,26.729110829441495],
[61.28088690920407,25.245884552551804],
[68.25946604244965,23.649370702658516],
[69.32477781910555,24.217367279584106],
[70.52018507128855,24.37602349980226],
[70.64432232358818,24.22651477608052],
[70.91438294264049,24.2572956118361],
[70.96839506645095,24.34344229651942],
[71.11017689145339,24.423383213590686],
[71.00215264383247,24.441823933688543],
[71.10151367411203,24.689754504528842],
[70.67068619019827,25.44658614700115],
[70.6600988051292,25.70443590052949],
[70.411295256006,25.671042290294217],
[70.0939859088559,25.90130551959443],
[70.1415632199787,26.461168602926158]
,[69.57481249050835,26.735668392722612],
[69.51442028783653,26.767294697212396],
[69.60953241974036,27.20519852387814],
[70.08509307925956,27.66245085240872],
[70.37042947497109,28.03387853401961],
[70.77465603556242,27.73262882361965],
[71.71785134360883,27.8938666443751],
[72.51045244280749,28.870108407477417], 
 [73.2237934320863,29.45150476946417],
[73.39816567391,29.960944362345746],
[73.94700839099127,30.12529193162742],
[73.92883902511566,30.376414906070615],
[74.58293619663763,31.07923824461552]]


  private isPointInPolygon(
    latitude: number,
    longitude: number,
    polygon: [number, number][]
  ): boolean {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      // polygon[i][0] = longitude (X), polygon[i][1] = latitude (Y)
      const xi = polygon[i][0]; // longitude
      const yi = polygon[i][1]; // latitude
      const xj = polygon[j][0]; // longitude
      const yj = polygon[j][1]; // latitude
      
      // Check if point crosses polygon edge
      const intersect = ((yi > latitude) !== (yj > latitude)) &&
        (longitude < (xj - xi) * (latitude - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  }

  /**
   * FIXED: Validate coordinates are within Pakistan
   */
  isWithinPakistan(latitude: number, longitude: number): boolean {
    // First check rectangular bounds for quick rejection
    const inBounds = (
      latitude >= this.PAKISTAN_BOUNDS.south &&
      latitude <= this.PAKISTAN_BOUNDS.north &&
      longitude >= this.PAKISTAN_BOUNDS.west &&
      longitude <= this.PAKISTAN_BOUNDS.east
    );
    
    if (!inBounds) {
      console.log('❌ Outside rectangular bounds');
      return false;
    }
    
    // Then check if inside actual Pakistan border polygon
    const inPolygon = this.isPointInPolygon(latitude, longitude, this.PAKISTAN_POLYGON);
    
    if (!inPolygon) {
      console.log('❌ Outside Pakistan polygon (neighboring country)');
    } else {
      console.log('✅ Inside Pakistan');
    }
    
    return inPolygon;
  }
  // Validate location data completeness
  validateLocationData(latitude: number, longitude: number, 
  
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check coordinates
    if (latitude && longitude) {
      if (!this.isWithinPakistan(latitude, longitude)) {
        warnings.push('Location appears to be outside Pakistan');
      }
    }

    // Check province/city combination
  

    return { isValid: errors.length === 0, errors, warnings };
  }

  
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
  }
export const locationValidationService = new LocationValidationService();