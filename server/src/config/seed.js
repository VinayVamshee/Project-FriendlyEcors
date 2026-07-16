const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const GalleryItem = require('../models/GalleryItem');
const Review = require('../models/Review');
const Settings = require('../models/Settings');

const categories = [
  { name: 'Flower Walls', slug: 'flower-walls', coverImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800' },
  { name: 'LED Decor', slug: 'led-decor', coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800' },
  { name: 'Welcome Boards', slug: 'welcome-boards', coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Balloon Decor', slug: 'balloon-decor', coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wedding Decor', slug: 'wedding-decor', coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },
  { name: 'Table Decor', slug: 'table-decor', coverImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800' },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/friendlyecors';
    console.log(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    // Clear existing data
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await GalleryItem.deleteMany({});
    await Review.deleteMany({});
    await Settings.deleteMany({});

    console.log('Existing database collections cleared.');

    // Seed Admin
    const admin = await Admin.create({
      username: 'FriendlyEcors',
      password: 'FriendlyEcors',
    });
    console.log(`Default Admin created: ${admin.username} / FriendlyEcors`);

    // Seed Settings
    const settings = await Settings.create({
      phone: '+1 (214) 555-0199',
      whatsapp: '12145550199',
      instagram: 'friendlyecors',
      facebook: 'friendlyecors',
      address: 'Dallas, TX',
      hours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed',
    });
    console.log('Default Settings created.');

    // Seed Categories
    const seededCategories = await Category.insertMany(categories);
    console.log(`${seededCategories.length} Categories seeded.`);

    const catMap = {};
    seededCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    // Seed Products
    const products = [
      {
        title: 'Classic Rose & Hydrangea Flower Wall',
        description: 'A premium, ultra-dense flower wall featuring real-touch white roses, cream hydrangeas, and soft eucalyptus accents. Perfect for wedding backdrops, baby showers, and luxury photo booths.',
        price: 250,
        duration: 'Daily',
        images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800'],
        category: catMap['flower-walls'],
        dimensions: '8ft x 8ft',
        included: ['Premium Flower Wall panels', 'Heavy-duty steel stand', 'Setup & teardown service'],
        featured: true,
      },
      {
        title: 'Warm White LED Backdrop Arch',
        description: 'An elegant brass round arch decorated with high-quality warm white fairy lights and delicate pampas grass. Adds a romantic glow to any evening celebration.',
        price: 180,
        duration: 'Daily',
        images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'],
        category: catMap['led-decor'],
        dimensions: '7.5ft Diameter',
        included: ['Brass metal hoop arch', 'Warm white LED curtain lights', 'Subtle floral weights'],
        featured: true,
      },
      {
        title: 'Aesthetic Oak Welcome Easel',
        description: 'Handcrafted solid oak easel to display your welcome sign. Sleek design, adjustable height, perfect for highlighting seating charts or greeting boards.',
        price: 45,
        duration: 'Daily',
        images: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800'],
        category: catMap['welcome-boards'],
        dimensions: '60" Height x 24" Width',
        included: ['Solid oak wood easel', 'Polished brass hardware hooks'],
        featured: false,
      },
      {
        title: 'Organic Pastel Balloon Garland',
        description: 'Custom-designed balloon arch garland featuring a blend of pastel peach, cream, and blush pink balloons. Includes gold chrome accents for a sophisticated touch.',
        price: 150,
        duration: 'Daily',
        images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800'],
        category: catMap['balloon-decor'],
        dimensions: '10ft length',
        included: ['Premium biodegradable balloons', 'Custom styling service', 'Rigging and mount accessories'],
        featured: true,
      },
      {
        title: 'Elegant Gold Candelabra Centerpieces',
        description: 'Set of 6 gold plated 5-arm candelabras. Perfect for grand banquet setups, adding height and vintage luxury styling to your event tables.',
        price: 120,
        duration: 'Daily',
        images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800'],
        category: catMap['table-decor'],
        dimensions: '32" Height',
        included: ['6 gold metal candelabras', 'LED flickerless candles (real wax effect)'],
        featured: false,
      },
      {
        title: 'Luxe Velvet Ceremony Backdrop',
        description: 'Drape setting with deep emerald green plush velvet curtains on a geometric gold arch. Ideal for high-end corporate stages or moody chic wedding ceremonies.',
        price: 200,
        duration: 'Daily',
        images: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'],
        category: catMap['wedding-decor'],
        dimensions: '8ft Height x 10ft Width',
        included: ['Emerald velvet fabric panels', 'Gold metal frame', 'Drape rods and weights'],
        featured: true,
      },
    ];

    await Product.insertMany(products);
    console.log('Mock Products seeded.');

    // Seed Gallery
    const galleryItems = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        eventName: 'Sarah & Michael Wedding',
        location: 'The Ritz-Carlton, Dallas',
        category: catMap['wedding-decor'],
        date: new Date('2026-05-12'),
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
        eventName: 'Aria Baby Shower',
        location: 'Plano Country Club, TX',
        category: catMap['flower-walls'],
        date: new Date('2026-06-20'),
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
        eventName: 'Enchanted Garden Birthday',
        location: 'Private Mansion, Frisco',
        category: catMap['balloon-decor'],
        date: new Date('2026-07-02'),
      },
    ];
    await GalleryItem.insertMany(galleryItems);
    console.log('Mock Gallery items seeded.');

    // Seed Reviews
    const reviews = [
      {
        author: 'Jessica Miller',
        rating: 5,
        comment: 'FriendlyEcors provided the flower wall for my wedding. It was absolutely gorgeous, and the setup was seamless. Highly recommend their manual booking service, they were so communicative on WhatsApp!',
        status: 'approved',
        isFeatured: true,
      },
      {
        author: 'David Chen',
        rating: 5,
        comment: 'Rented the LED hoop arch and gold candelabras for a corporate gala. Top notch luxury quality and very fair pricing. Will book again next year.',
        status: 'approved',
        isFeatured: true,
      },
      {
        author: 'Sophia Martinez',
        rating: 4,
        comment: 'The balloon garland was stunning. Very easy booking process directly over the phone.',
        status: 'approved',
        isFeatured: false,
      },
    ];
    await Review.insertMany(reviews);
    console.log('Mock Reviews seeded.');

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
