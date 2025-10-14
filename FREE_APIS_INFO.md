# Free APIs Used in Nearby Page

This project uses **completely free APIs** instead of Google Maps to find vegetarian restaurants. Here's how it works:

## 🗺️ **OpenStreetMap (OSM) + Overpass API**

### **What we use:**
1. **Overpass API** - Free, real-time access to OpenStreetMap data
2. **OpenStreetMap** - Free, community-driven map data
3. **Browser Geolocation API** - Free location access

### **How it works:**

#### 1. **Restaurant Discovery (Overpass API)**
```javascript
// Searches for vegetarian restaurants in OpenStreetMap data
const overpassQuery = `
  [out:json][timeout:25];
  (
    node["amenity"="restaurant"]["diet:vegetarian"="yes"](around:5000,28.6139,77.2090);
    node["amenity"="restaurant"]["diet:vegan"="yes"](around:5000,28.6139,77.2090);
    way["amenity"="restaurant"]["cuisine"~"vegetarian|vegan"](around:5000,28.6139,77.2090);
  );
  out geom;
`;
```

#### 2. **Maps & Directions (OpenStreetMap)**
- **View on Map**: `https://www.openstreetmap.org/?mlat=LAT&mlon=LNG&zoom=16`
- **Get Directions**: `https://www.openstreetmap.org/directions?from=LAT,LNG&to=LAT,LNG`

### **Data Quality:**
- ✅ **Real restaurant data** from OpenStreetMap contributors
- ✅ **Completely free** - no API keys required
- ✅ **Global coverage** - works worldwide
- ✅ **Fallback system** - uses curated mock data if no OSM data found

### **Benefits:**
- 🆓 **100% Free** - No API keys, no rate limits, no billing
- 🌍 **Global** - Works in any country with OSM data
- 🔄 **Real-time** - Always up-to-date with community contributions
- 🏪 **Accurate** - Community-verified restaurant information

### **API Endpoints:**
- **Overpass API**: `https://overpass-api.de/api/interpreter`
- **OpenStreetMap**: `https://www.openstreetmap.org/`

## 🎯 **Features Implemented:**

1. **Location-based Search**: Finds restaurants within specified radius
2. **Vegetarian Filtering**: Only shows vegetarian/vegan restaurants
3. **Distance Calculation**: Shows exact distance from user location
4. **Real Restaurant Data**: Name, address, cuisine, phone, website
5. **Interactive Maps**: Direct links to OpenStreetMap for viewing/directions
6. **Fallback System**: Mock data when no OSM data available

## 🚀 **No Setup Required:**

Unlike Google Maps API which requires:
- ❌ API key registration
- ❌ Credit card for billing
- ❌ Usage limits and costs

Our solution requires:
- ✅ Nothing! Just works out of the box
- ✅ No registration needed
- ✅ Unlimited usage

## 🔧 **Technical Implementation:**

The app automatically:
1. Gets user's location via browser geolocation
2. Queries Overpass API for nearby vegetarian restaurants
3. Processes OSM data into structured restaurant information
4. Provides OpenStreetMap links for maps and directions
5. Falls back to curated data if no OSM results found

This provides a **professional, fully-functional restaurant finder** without any API costs!