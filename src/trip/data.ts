// Local data for "A long weekend in San Francisco". Neighborhoods, sights and practical
// details are real; stay names, prices and people are invented for the demo.

export const TRIP = {
  title: 'A long weekend in San Francisco',
  start: '2026-11-13',
  end: '2026-11-15',
  nights: 2,
}

export const SECTIONS = [
  { value: 'plan', label: 'Plan', depth: 2 },
  { value: 'stays', label: 'Stays', depth: 2 },
  { value: 'itinerary', label: 'Itinerary', depth: 2 },
  { value: 'budget', label: 'Budget', depth: 2 },
  { value: 'packing', label: 'Packing', depth: 2 },
  { value: 'preferences', label: 'Preferences', depth: 2 },
]

// Everyone who could come. Its length is the travellers maximum (5).
export const COMPANIONS = [
  { initials: 'MO', name: 'Mo Okafor' },
  { initials: 'JK', name: 'Jun Kim' },
  { initials: 'AL', name: 'Ana López' },
  { initials: 'RD', name: 'Rui Dias' },
  { initials: 'SP', name: 'Sam Patel' },
]

export type StayType = 'hotel' | 'guesthouse' | 'apartment'
export type Amenity = 'wifi' | 'kitchen' | 'parking' | 'breakfast'

export const AMENITIES: { value: Amenity; label: string }[] = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'parking', label: 'Free parking' },
  { value: 'breakfast', label: 'Breakfast included' },
]

export type Stay = {
  id: string
  name: string
  neighborhood: string
  type: StayType
  pricePerNight: number
  rating: number
  reviews: number
  amenities: Amenity[]
  freeCancellation: boolean
}

export const STAYS: Stay[] = [
  { id: 'linden-loft', name: 'Linden Street Loft', neighborhood: 'Hayes Valley', type: 'apartment', pricePerNight: 312, rating: 4.8, reviews: 214, amenities: ['wifi', 'kitchen'], freeCancellation: true },
  { id: 'the-valencia', name: 'The Valencia', neighborhood: 'Mission District', type: 'hotel', pricePerNight: 248, rating: 4.5, reviews: 1032, amenities: ['wifi', 'breakfast'], freeCancellation: true },
  { id: 'telegraph-hill', name: 'Telegraph Hill Guesthouse', neighborhood: 'North Beach', type: 'guesthouse', pricePerNight: 185, rating: 4.7, reviews: 388, amenities: ['wifi', 'breakfast'], freeCancellation: false },
  { id: 'huntington-park', name: 'Huntington Park House', neighborhood: 'Nob Hill', type: 'hotel', pricePerNight: 455, rating: 4.9, reviews: 671, amenities: ['wifi', 'parking', 'breakfast'], freeCancellation: true },
  { id: 'marina-green', name: 'Marina Green Flat', neighborhood: 'The Marina', type: 'apartment', pricePerNight: 289, rating: 4.4, reviews: 97, amenities: ['wifi', 'kitchen', 'parking'], freeCancellation: false },
  { id: 'dolores-garden', name: 'Dolores Garden Rooms', neighborhood: 'Mission District', type: 'guesthouse', pricePerNight: 164, rating: 4.6, reviews: 455, amenities: ['wifi', 'kitchen'], freeCancellation: true },
]

export type Stop = {
  id: string
  time: string
  title: string
  place: string
  tip: string
  timedEntry?: boolean
}

export const ITINERARY: { value: string; label: string; date: string; stops: Stop[] }[] = [
  {
    value: 'fri',
    label: 'Fri 13',
    date: 'Friday 13 November',
    stops: [
      { id: 'ferry-building', time: '10:00', title: 'Ferry Building Marketplace', place: 'Embarcadero', tip: 'The farmers market runs on Tuesdays, Thursdays and Saturdays, so Friday is quieter inside.' },
      { id: 'golden-gate-park', time: '14:00', title: 'Golden Gate Park', place: 'de Young Museum and the Japanese Tea Garden', tip: 'The Japanese Tea Garden charges admission for visitors who are not San Francisco residents.' },
      { id: 'north-beach-dinner', time: '19:30', title: 'Dinner in North Beach', place: 'Columbus Avenue', tip: 'Book ahead on Friday nights; walk-in waits can pass an hour.' },
    ],
  },
  {
    value: 'sat',
    label: 'Sat 14',
    date: 'Saturday 14 November',
    stops: [
      { id: 'bridge-walk', time: '09:00', title: 'Walk the Golden Gate Bridge', place: 'From the Bridge Welcome Center', tip: 'The bridge is about 1.7 miles long. Bring a warm layer: it is often windy and foggy mid-span.' },
      { id: 'alcatraz', time: '13:30', title: 'Alcatraz ferry', place: 'Pier 33', tip: 'Arrive 30 minutes before your departure. Tickets are for a fixed time and often sell out.', timedEntry: true },
    ],
  },
  {
    value: 'sun',
    label: 'Sun 15',
    date: 'Sunday 15 November',
    stops: [
      { id: 'muir-woods', time: '08:30', title: 'Muir Woods day trip', place: 'Mill Valley, Marin County', tip: 'Parking or shuttle reservations are required before you arrive; there is no cell service on site.', timedEntry: true },
      { id: 'sausalito-ferry', time: '15:00', title: 'Ferry back from Sausalito', place: 'Sausalito Ferry Terminal', tip: 'The ferry lands at the Ferry Building, a short walk from the BART station at Embarcadero.' },
    ],
  },
]

export const CURRENCIES = [
  // Fixed, approximate rates so the demo works offline.
  { value: 'USD', label: 'US dollar (USD)', rate: 1 },
  { value: 'EUR', label: 'Euro (EUR)', rate: 0.92 },
  { value: 'GBP', label: 'Pound sterling (GBP)', rate: 0.79 },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['value']

export const BUDGET = [
  // Two nights at the saved Linden Street Loft ($312 a night).
  { id: 'stays', label: 'Stays', planned: 624, spent: 624 },
  { id: 'food', label: 'Food', planned: 420, spent: 318.4 },
  { id: 'transport', label: 'Transport', planned: 180, spent: 96.25 },
  { id: 'activities', label: 'Activities', planned: 240, spent: 171 },
]

export const PACKING: { id: string; label: string; items: { id: string; label: string; packed: boolean }[] }[] = [
  {
    id: 'clothes',
    label: 'Clothes',
    items: [
      { id: 'layers', label: 'Warm layers for the fog', packed: true },
      { id: 'shoes', label: 'Walking shoes', packed: true },
      { id: 'scarf', label: 'Light scarf', packed: true },
      { id: 'rain-jacket', label: 'Rain jacket', packed: false },
      { id: 'hat', label: 'Hat', packed: false },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    items: [
      { id: 'id', label: 'Photo ID', packed: true },
      { id: 'alcatraz-tickets', label: 'Alcatraz tickets', packed: true },
      { id: 'muir-parking', label: 'Muir Woods parking reservation', packed: true },
      { id: 'insurance', label: 'Travel insurance details', packed: false },
    ],
  },
  {
    id: 'gear',
    label: 'Gear',
    items: [
      { id: 'charger', label: 'Phone charger', packed: true },
      { id: 'bottle', label: 'Reusable water bottle', packed: true },
      { id: 'day-pack', label: 'Day pack', packed: true },
      { id: 'battery', label: 'Portable battery', packed: false },
      { id: 'earplugs', label: 'Earplugs', packed: false },
    ],
  },
]

export const PACES = [
  { value: 'relaxed', label: 'Relaxed', hint: 'Two stops a day, long lunches' },
  { value: 'balanced', label: 'Balanced', hint: 'Three stops a day' },
  { value: 'packed', label: 'Packed', hint: 'Five stops, early starts' },
]

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'zh', label: '中文' },
]
