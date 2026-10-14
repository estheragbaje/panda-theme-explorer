// Local data for "A long weekend in San Francisco". Neighborhoods, sights and practical
// details are real; stay names, prices and people are invented for the demo.

// Photos from Unsplash (free licence, no Unsplash+ images). The id is the CDN path; the
// credit is shown in the page footer, as Unsplash's guidelines ask.
export type Photo = { id: string; alt: string; credit: { name: string; username: string } }

const photo = (id: string, alt: string, name: string, username: string): Photo => ({ id: `photo-${id}`, alt, credit: { name, username } })

export const TRIP = {
  title: 'A long weekend in San Francisco',
  start: '2026-11-13',
  end: '2026-11-15',
  nights: 2,
  photo: photo('1753563351975-7304490da3f3', 'Downtown San Francisco rising above a bank of morning fog', 'Zetong Li', 'zetong'),
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
  photo: Photo
}

export const STAYS: Stay[] = [
  { id: 'linden-loft', name: 'Linden Street Loft', neighborhood: 'Hayes Valley', type: 'apartment', pricePerNight: 312, rating: 4.8, reviews: 214, amenities: ['wifi', 'kitchen'], freeCancellation: true, photo: photo('1649429710616-dad56ce9a076', 'A loft living room with a green sofa and tall windows over the city', 'sophie peng', 'sophiepengjy') },
  { id: 'the-valencia', name: 'The Valencia', neighborhood: 'Mission District', type: 'hotel', pricePerNight: 248, rating: 4.5, reviews: 1032, amenities: ['wifi', 'breakfast'], freeCancellation: true, photo: photo('1675409145919-277c0fc2aa7d', 'A hotel bed with wood panelling beside a window at dusk', 'Natalia Gusakova', 'nataliaraylenegusakova') },
  { id: 'telegraph-hill', name: 'Telegraph Hill Guesthouse', neighborhood: 'North Beach', type: 'guesthouse', pricePerNight: 185, rating: 4.7, reviews: 388, amenities: ['wifi', 'breakfast'], freeCancellation: false, photo: photo('1665249934445-1de680641f50', 'A sunlit sitting room with a balcony and plants', 'Danilo Rios', 'danrop') },
  { id: 'huntington-park', name: 'Huntington Park House', neighborhood: 'Nob Hill', type: 'hotel', pricePerNight: 455, rating: 4.9, reviews: 671, amenities: ['wifi', 'parking', 'breakfast'], freeCancellation: true, photo: photo('1771775529138-a7a20ba7e032', 'A hotel room with two beds and a wide city view', 'Erik Mclean', 'introspectivedsgn') },
  { id: 'marina-green', name: 'Marina Green Flat', neighborhood: 'The Marina', type: 'apartment', pricePerNight: 289, rating: 4.4, reviews: 97, amenities: ['wifi', 'kitchen', 'parking'], freeCancellation: false, photo: photo('1650137938625-11576502aecd', 'A bright living room with a blue sofa and a wall of windows', 'Steph Wilson', 'stephwilll') },
  { id: 'dolores-garden', name: 'Dolores Garden Rooms', neighborhood: 'Mission District', type: 'guesthouse', pricePerNight: 164, rating: 4.6, reviews: 455, amenities: ['wifi', 'kitchen'], freeCancellation: true, photo: photo('1729605411476-defbdab14c54', 'A bedroom with sliding glass doors open to a garden', 'Antonio Araujo', 'antonioaaaraujo') },
]

export type Stop = {
  id: string
  time: string
  title: string
  place: string
  tip: string
  timedEntry?: boolean
  photo: Photo
}

export const ITINERARY: { value: string; label: string; date: string; stops: Stop[] }[] = [
  {
    value: 'fri',
    label: 'Fri 13',
    date: 'Friday 13 November',
    stops: [
      { id: 'ferry-building', time: '10:00', title: 'Ferry Building Marketplace', place: 'Embarcadero', tip: 'The farmers market runs on Tuesdays, Thursdays and Saturdays, so Friday is quieter inside.', photo: photo('1656717215850-08e53a4a62b7', 'The Ferry Building clock tower between palm trees', 'James A. Molnar', 'jamesamolnar') },
      { id: 'golden-gate-park', time: '14:00', title: 'Golden Gate Park', place: 'de Young Museum and the Japanese Tea Garden', tip: 'The Japanese Tea Garden charges admission for visitors who are not San Francisco residents.', photo: photo('1634600336602-23573abb80aa', 'The red pagoda in the Japanese Tea Garden', 'Jeffrey Eisen', 'jeisen') },
      { id: 'north-beach-dinner', time: '19:30', title: 'Dinner in North Beach', place: 'Columbus Avenue', tip: 'Book ahead on Friday nights; walk-in waits can pass an hour.', photo: photo('1777333033410-4548702116af', 'Pasta, salad and red wine by candlelight', 'Brelyn Bashrum', 'brelynkk') },
    ],
  },
  {
    value: 'sat',
    label: 'Sat 14',
    date: 'Saturday 14 November',
    stops: [
      { id: 'bridge-walk', time: '09:00', title: 'Walk the Golden Gate Bridge', place: 'From the Bridge Welcome Center', tip: 'The bridge is about 1.7 miles long. Bring a warm layer: it is often windy and foggy mid-span.', photo: photo('1565385643302-3af3e1891ec5', 'The Golden Gate Bridge disappearing into fog', 'Derk Wessels', 'derkwessels') },
      { id: 'alcatraz', time: '13:30', title: 'Alcatraz ferry', place: 'Pier 33', tip: 'Arrive 30 minutes before your departure. Tickets are for a fixed time and often sell out.', timedEntry: true, photo: photo('1583101732678-b9ac0a7fc035', 'Alcatraz Island and its lighthouse under low fog', 'Chris Cooper', 'newsparx') },
    ],
  },
  {
    value: 'sun',
    label: 'Sun 15',
    date: 'Sunday 15 November',
    stops: [
      { id: 'muir-woods', time: '08:30', title: 'Muir Woods day trip', place: 'Mill Valley, Marin County', tip: 'Parking or shuttle reservations are required before you arrive; there is no cell service on site.', timedEntry: true, photo: photo('1549737328-8b9f3252b927', 'Sunlight through tall redwoods and ferns', 'Billy Huynh', 'billy_huy') },
      { id: 'sausalito-ferry', time: '15:00', title: 'Ferry back from Sausalito', place: 'Sausalito Ferry Terminal', tip: 'The ferry lands at the Ferry Building, a short walk from the BART station at Embarcadero.', photo: photo('1637035288738-44bf89e098a8', 'A blue waterfront building in Sausalito with the city across the bay', 'Michael Yung', 'myungus') },
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
