const bcrypt = require('bcryptjs');

let categories = [
  { _id: 'cat1', name: 'Flower Walls', slug: 'flower-walls', coverImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800' },
  { _id: 'cat2', name: 'LED Decor', slug: 'led-decor', coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800' },
  { _id: 'cat3', name: 'Welcome Boards', slug: 'welcome-boards', coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800' },
  { _id: 'cat4', name: 'Balloon Decor', slug: 'balloon-decor', coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800' },
  { _id: 'cat5', name: 'Wedding Decor', slug: 'wedding-decor', coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },
  { _id: 'cat6', name: 'Table Decor', slug: 'table-decor', coverImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800' },
];

let products = [
  {
    _id: 'prod1',
    title: 'Classic Rose & Hydrangea Flower Wall',
    description: 'A premium, ultra-dense flower wall featuring real-touch white roses, cream hydrangeas, and soft eucalyptus accents. Perfect for wedding backdrops, baby showers, and luxury photo booths.',
    price: 250,
    duration: 'Daily',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat1', name: 'Flower Walls', slug: 'flower-walls' },
    dimensions: '8ft x 8ft',
    included: ['Premium Flower Wall panels', 'Heavy-duty steel stand', 'Setup & teardown service'],
    featured: true,
  },
  {
    _id: 'prod2',
    title: 'Warm White LED Backdrop Arch',
    description: 'An elegant brass round arch decorated with high-quality warm white fairy lights and delicate pampas grass. Adds a romantic glow to any evening celebration.',
    price: 180,
    duration: 'Daily',
    images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat2', name: 'LED Decor', slug: 'led-decor' },
    dimensions: '7.5ft Diameter',
    included: ['Brass metal hoop arch', 'Warm white LED curtain lights', 'Subtle floral weights'],
    featured: true,
  },
  {
    _id: 'prod3',
    title: 'Aesthetic Oak Welcome Easel',
    description: 'Handcrafted solid oak easel to display your welcome sign. Sleek design, adjustable height, perfect for highlighting seating charts or greeting boards.',
    price: 45,
    duration: 'Daily',
    images: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat3', name: 'Welcome Boards', slug: 'welcome-boards' },
    dimensions: '60" Height x 24" Width',
    included: ['Solid oak wood easel', 'Polished brass hardware hooks'],
    featured: false,
  },
  {
    _id: 'prod4',
    title: 'Organic Pastel Balloon Garland',
    description: 'Custom-designed balloon arch garland featuring a blend of pastel peach, cream, and blush pink balloons. Includes gold chrome accents for a sophisticated touch.',
    price: 150,
    duration: 'Daily',
    images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat4', name: 'Balloon Decor', slug: 'balloon-decor' },
    dimensions: '10ft length',
    included: ['Premium biodegradable balloons', 'Custom styling service', 'Rigging and mount accessories'],
    featured: true,
  },
];

let galleryItems = [
  {
    _id: 'gal1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    eventName: 'Sarah & Michael Wedding',
    location: 'The Ritz-Carlton, Dallas',
    category: { _id: 'cat5', name: 'Wedding Decor', slug: 'wedding-decor' },
    date: new Date('2026-05-12'),
  },
  {
    _id: 'gal2',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    eventName: 'Aria Baby Shower',
    location: 'Plano Country Club, TX',
    category: { _id: 'cat1', name: 'Flower Walls', slug: 'flower-walls' },
    date: new Date('2026-06-20'),
  },
];

let reviews = [
  {
    _id: 'rev1',
    author: 'Jessica Miller',
    rating: 5,
    comment: 'FriendlyEcors provided the flower wall for my wedding. It was absolutely gorgeous, and the setup was seamless. Highly recommend their manual booking service, they were so communicative on WhatsApp!',
    status: 'approved',
    isFeatured: true,
    createdAt: new Date('2026-07-01'),
  },
  {
    _id: 'rev2',
    author: 'David Chen',
    rating: 5,
    comment: 'Rented the LED hoop arch and gold candelabras for a corporate gala. Top notch luxury quality and very fair pricing. Will book again next year.',
    status: 'approved',
    isFeatured: true,
    createdAt: new Date('2026-07-05'),
  },
];

let settings = {
  phone: '+1 (214) 555-0199',
  whatsapp: '12145550199',
  instagram: 'friendlyecors',
  facebook: 'friendlyecors',
  address: 'Dallas, TX',
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed',
};

let admin = {
  id: 'admin1',
  username: 'FriendlyEcors',
  passwordHash: bcrypt.hashSync('FriendlyEcors', 10),
};

module.exports = {
  categories,
  products,
  galleryItems,
  reviews,
  settings,
  admin,
};
