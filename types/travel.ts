export interface Destination {
  id: number;
  province: string;
  place: string;
  category: "Nature" | "Beach" | "Historical" | "Culture" | "Adventure" | "Mountain";
  budget: "$50 - $100" | "$100 - $300" | "$300 - $700" | "$700+";
  recommendedDays: number;
  description: string;
  latitude: number;
  longitude: number;
}

export interface Accommodation {
  id: number;
  province: string;
  name: string;
  priceRange: string;
  latitude: number;
  longitude: number;
}

export interface Food {
  id: number;
  province: string;
  name: string;
  type: string;
  priceRange: string;
  latitude: number;
  longitude: number;
}

export interface TimelineDay {
  day: number;
  places: Destination[];
  accommodation: Accommodation;
  foods: Food[];
}
