export const artists = [
  {
    id: "twice",
    name: "TWICE",
    tier: "A-tier / Major",
    readiness: "Strong",
    topMarket: "Los Angeles, CA",
    genre: "K-pop",
    followers: "22.4M",
    popularity: 86,
    engagement: 91,
    spotifyImageUrl: "https://i.scdn.co/image/ab6761610000e5ebca4f4290276bbefb5b83d2af",
    spotifyArtistData: {
      images: [
        { url: "https://i.scdn.co/image/ab6761610000e5ebca4f4290276bbefb5b83d2af", height: 640, width: 640 }
      ]
    },
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    summary: "Global touring act with strong streaming velocity, high social engagement, and reliable anchor-market pull."
  },
  {
    id: "sza",
    name: "SZA",
    tier: "A-tier / Major",
    readiness: "Strong",
    topMarket: "New York, NY",
    genre: "R&B",
    followers: "18.9M",
    popularity: 89,
    engagement: 88,
    spotifyImageUrl: "https://i.scdn.co/image/ab6761610000e5ebe5b34e2337f9bb31d7a16c84",
    spotifyArtistData: {
      images: [
        { url: "https://i.scdn.co/image/ab6761610000e5ebe5b34e2337f9bb31d7a16c84", height: 640, width: 640 }
      ]
    },
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    summary: "Mass-market artist with deep urban demand and strong premium venue fit."
  },
  {
    id: "omar",
    name: "Omar Apollo",
    tier: "B-tier / Mid-to-high",
    readiness: "Ready",
    topMarket: "Chicago, IL",
    genre: "Alt pop",
    followers: "3.2M",
    popularity: 71,
    engagement: 76,
    spotifyImageUrl: "",
    spotifyArtistData: { images: [] },
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    summary: "Growth artist with strong regional upside and flexible theater-to-amphitheater routing."
  }
];

export const cities = [
  { id: "los-angeles", city: "Los Angeles, CA", category: "Anchor Market", opportunity: 94, trends: 95, estimatedFans: 72000, lat: 34.0522, lon: -118.2437, capacity: "18,000-24,000", dates: "2-3", anchor: true, saturation: "High", why: "Core market with strong demand, venue fit, and national routing value." },
  { id: "new-york", city: "New York, NY", category: "Anchor Market", opportunity: 92, trends: 94, estimatedFans: 68000, lat: 40.7128, lon: -74.006, capacity: "18,000-22,000", dates: "2", anchor: true, saturation: "High", why: "Required Northeast anchor with broad media, fan, and venue coverage." },
  { id: "chicago", city: "Chicago, IL", category: "Anchor Market", opportunity: 87, trends: 91, estimatedFans: 43000, lat: 41.8781, lon: -87.6298, capacity: "12,000-18,000", dates: "1-2", anchor: true, saturation: "Moderate", why: "Midwest hub covering Chicago, Milwaukee, Indianapolis, Detroit, and St. Louis." },
  { id: "charlotte", city: "Charlotte, NC", category: "Underserved Opportunity", opportunity: 89, trends: 84, estimatedFans: 22000, lat: 35.2271, lon: -80.8431, capacity: "5,000-8,500", dates: "1", anchor: false, saturation: "Low", why: "High opportunity with low recent saturation, useful for Southeast expansion." },
  { id: "austin", city: "Austin, TX", category: "Expansion Market", opportunity: 82, trends: 88, estimatedFans: 28000, lat: 30.2672, lon: -97.7431, capacity: "6,500-10,000", dates: "1", anchor: false, saturation: "Moderate", why: "Strong social and search demand with flexible Texas routing potential." },
  { id: "atlanta", city: "Atlanta, GA", category: "Expansion Market", opportunity: 85, trends: 92, estimatedFans: 36000, lat: 33.749, lon: -84.388, capacity: "8,500-14,000", dates: "1-2", anchor: false, saturation: "Moderate", why: "Southeast demand hub with strong social momentum and multiple venue tiers." },
  { id: "seattle", city: "Seattle, WA", category: "Emerging Market", opportunity: 78, trends: 85, estimatedFans: 18000, lat: 47.6062, lon: -122.3321, capacity: "5,000-7,500", dates: "1", anchor: false, saturation: "Low", why: "Strong Pacific Northwest signal with conservative test capacity." },
  { id: "phoenix", city: "Phoenix, AZ", category: "Monitor", opportunity: 73, trends: 80, estimatedFans: 15000, lat: 33.4484, lon: -112.074, capacity: "4,000-6,500", dates: "1", anchor: false, saturation: "Low", why: "Useful routing option if Southwest demand strengthens." },
  { id: "dallas", city: "Dallas, TX", category: "Expansion Market", opportunity: 81, trends: 86, estimatedFans: 30000, lat: 32.7767, lon: -96.797, capacity: "8,000-13,000", dates: "1", anchor: false, saturation: "Moderate", why: "Texas demand hub with strong routing value across Dallas, Fort Worth, and Oklahoma markets." },
  { id: "houston", city: "Houston, TX", category: "Expansion Market", opportunity: 80, trends: 84, estimatedFans: 27000, lat: 29.7604, lon: -95.3698, capacity: "7,000-12,000", dates: "1", anchor: false, saturation: "Moderate", why: "Large metro with flexible arena and amphitheater options for scaled demand testing." },
  { id: "san-francisco", city: "San Francisco, CA", category: "Anchor Market", opportunity: 83, trends: 87, estimatedFans: 31000, lat: 37.7749, lon: -122.4194, capacity: "8,500-14,000", dates: "1", anchor: false, saturation: "Moderate", why: "Bay Area signal captures San Francisco, Oakland, and Silicon Valley demand." },
  { id: "newark", city: "Newark, NJ", category: "Anchor Market", opportunity: 84, trends: 88, estimatedFans: 34000, lat: 40.7357, lon: -74.1724, capacity: "12,000-18,000", dates: "1-2", anchor: true, saturation: "Moderate", why: "New York metro alternate with major arena fit and Northeast coverage." }
];

export const plans = [
  { id: "anchor", name: "North America Anchor Route", artist: "TWICE", status: "Draft", stops: 6, capacity: "18K avg", cities: ["Los Angeles", "New York", "Chicago", "Dallas", "Atlanta", "Seattle"] },
  { id: "underserved", name: "Underserved Market Test", artist: "Omar Apollo", status: "Ready for review", stops: 8, capacity: "6.5K avg", cities: ["Charlotte", "Austin", "St. Louis", "Raleigh", "Columbus", "Phoenix"] },
  { id: "west", name: "West Coast Demand Sweep", artist: "SZA", status: "Saved", stops: 4, capacity: "22K avg", cities: ["Los Angeles", "Oakland", "San Diego", "Seattle"] }
];

export const venues = [
  { id: "kia-forum", venue: "Kia Forum", city: "Los Angeles", state: "CA", capacity: 17505, type: "Arena", fit: 94 },
  { id: "bmo-stadium", venue: "BMO Stadium", city: "Los Angeles", state: "CA", capacity: 22000, type: "Stadium", fit: 88 },
  { id: "hollywood-bowl", venue: "Hollywood Bowl", city: "Los Angeles", state: "CA", capacity: 17500, type: "Amphitheater", fit: 90 },
  { id: "msg", venue: "Madison Square Garden", city: "New York", state: "NY", capacity: 19812, type: "Arena", fit: 96 },
  { id: "radio-city", venue: "Radio City Music Hall", city: "New York", state: "NY", capacity: 5960, type: "Theater", fit: 72 },
  { id: "barclays", venue: "Barclays Center", city: "Brooklyn", state: "NY", capacity: 17732, type: "Arena", fit: 90 },
  { id: "united-center", venue: "United Center", city: "Chicago", state: "IL", capacity: 20917, type: "Arena", fit: 91 },
  { id: "wintrust", venue: "Wintrust Arena", city: "Chicago", state: "IL", capacity: 10387, type: "Arena", fit: 82 },
  { id: "aragon", venue: "Byline Bank Aragon Ballroom", city: "Chicago", state: "IL", capacity: 5000, type: "Ballroom", fit: 70 },
  { id: "spectrum-center", venue: "Spectrum Center", city: "Charlotte", state: "NC", capacity: 19077, type: "Arena", fit: 74 },
  { id: "skyla", venue: "Skyla Credit Union Amphitheatre", city: "Charlotte", state: "NC", capacity: 5000, type: "Amphitheater", fit: 89 },
  { id: "oven-auditorium", venue: "Ovens Auditorium", city: "Charlotte", state: "NC", capacity: 2455, type: "Theater", fit: 68 },
  { id: "moody-center", venue: "Moody Center", city: "Austin", state: "TX", capacity: 15000, type: "Arena", fit: 86 },
  { id: "acl-live", venue: "ACL Live", city: "Austin", state: "TX", capacity: 2750, type: "Theater", fit: 65 },
  { id: "state-farm-arena", venue: "State Farm Arena", city: "Atlanta", state: "GA", capacity: 21000, type: "Arena", fit: 88 },
  { id: "coca-cola-roxy", venue: "Coca-Cola Roxy", city: "Atlanta", state: "GA", capacity: 3600, type: "Theater", fit: 70 },
  { id: "climate-pledge", venue: "Climate Pledge Arena", city: "Seattle", state: "WA", capacity: 18100, type: "Arena", fit: 78 },
  { id: "paramount-seattle", venue: "Paramount Theatre", city: "Seattle", state: "WA", capacity: 2807, type: "Theater", fit: 66 },
  { id: "arizona-financial", venue: "Arizona Financial Theatre", city: "Phoenix", state: "AZ", capacity: 5000, type: "Theater", fit: 83 },
  { id: "footprint-center", venue: "Footprint Center", city: "Phoenix", state: "AZ", capacity: 17071, type: "Arena", fit: 76 }
  ,{ id: "american-airlines-center", venue: "American Airlines Center", city: "Dallas", state: "TX", capacity: 20000, type: "Arena", fit: 88 },
  { id: "toyota-music-factory", venue: "The Pavilion at Toyota Music Factory", city: "Dallas", state: "TX", capacity: 8000, type: "Amphitheater", fit: 82 },
  { id: "toyota-center", venue: "Toyota Center", city: "Houston", state: "TX", capacity: 19000, type: "Arena", fit: 86 },
  { id: "713-music-hall", venue: "713 Music Hall", city: "Houston", state: "TX", capacity: 5000, type: "Theater", fit: 75 },
  { id: "chase-center", venue: "Chase Center", city: "San Francisco", state: "CA", capacity: 18064, type: "Arena", fit: 88 },
  { id: "bill-graham", venue: "Bill Graham Civic Auditorium", city: "San Francisco", state: "CA", capacity: 8500, type: "Auditorium", fit: 82 },
  { id: "prudential-center", venue: "Prudential Center", city: "Newark", state: "NJ", capacity: 19500, type: "Arena", fit: 90 },
  { id: "njpac", venue: "New Jersey Performing Arts Center", city: "Newark", state: "NJ", capacity: 2800, type: "Theater", fit: 66 }
];
