require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const Table = require('./models/Table');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Table.deleteMany({});

    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const owner = await User.create({
      email: 'owner@example.com',
      password: hashedPassword,
      name: 'Restaurant Owner',
      role: 'admin',
      phone: '12345678',
      isActive: true
    });

    const restaurants = await Restaurant.create([
      {
        name: 'Le Gourmet Sfaxien',
        address: 'Avenue Habib Bourguiba, Sfax 3000',
        city: 'Sfax',
        phone: '+216 74 123 456',
        email: 'gourmet.sfax@example.com',
        owner: owner._id,
        openingHours: 'Monday-Friday: 9:00 AM - 10:00 PM, Saturday-Sunday: 10:00 AM - 11:00 PM',
        status: 'Open',
        description: 'Restaurant gastronomique au cœur de Sfax, avec une cuisine tunisienne revisitée.',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
      },
      {
        name: 'Chez Fatma',
        address: 'Rue Mongi Slim, Sfax 3000',
        city: 'Sfax',
        phone: '+216 74 234 567',
        email: 'chezfatma@example.com',
        owner: owner._id,
        openingHours: 'Monday-Friday: 8:00 AM - 9:00 PM, Saturday-Sunday: 10:00 AM - 12:00 AM',
        status: 'Open',
        description: 'Cuisine traditionnelle tunisienne dans une ambiance chaleureuse.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
      },
      {
        name: 'La Table Méditerranéenne',
        address: 'Corniche, Route de la Plage, Sousse 4000',
        city: 'Sousse',
        phone: '+216 73 345 678',
        email: 'latable.sousse@example.com',
        owner: owner._id,
        openingHours: 'Monday-Sunday: 8:00 AM - 11:00 PM',
        status: 'Closed',
        description: 'Un mélange de saveurs méditerranéennes avec vue sur mer.',
        image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80'
      },
      {
        name: 'Bistro du Centre',
        address: 'Avenue de France, Tunis 1000',
        city: 'Tunis',
        phone: '+216 71 456 789',
        email: 'bistro.tunis@example.com',
        owner: owner._id,
        openingHours: 'Monday-Friday: 10:00 AM - 9:00 PM, Saturday-Sunday: 9:00 AM - 10:00 PM',
        status: 'Open',
        description: 'Bistro urbain moderne au cœur de Tunis.',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
      },
      {
        name: 'Jasmine Bio',
        address: 'Rue de l’Environnement, Mahdia 5100',
        city: 'Mahdia',
        phone: '+216 73 567 890',
        email: 'jasmine.bio@example.com',
        owner: owner._id,
        openingHours: 'Monday-Sunday: 7:00 AM - 10:00 PM',
        status: 'Open',
        description: 'Cuisine bio et healthy avec des produits locaux et de saison.',
        image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80'
      },
      {
        name: 'Green Harmony',
        address: 'Rue Ibn Khaldoun, Monastir 5000',
        city: 'Monastir',
        phone: '+216 73 678 901',
        email: 'green.harmony@example.com',
        owner: owner._id,
        openingHours: 'Monday-Sunday: 10:00 AM - 8:00 PM',
        status: 'Open',
        description: 'Restaurant végétarien innovant avec des options véganes.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
      }
    ]);

    const menuDataByRestaurant = [
      {
        restaurant: restaurants[0],
        menus: [
          {
            name: 'Petit Déjeuner Sfaxien',
            category: 'Breakfast',
            price: 11.50,
            description: 'Spécialités locales pour bien commencer la journée.',
            image: 'https://example.com/gourmet-breakfast.jpg',
            items: ['Mlawi', 'Brik à l\'œuf', 'Café turc']
          },
          {
            name: 'Menu Déjeuner Sfaxien',
            category: 'Lunch',
            price: 18.90,
            description: 'Plats typiques de la région de Sfax.',
            image: 'https://example.com/gourmet-lunch.jpg',
            items: ['Chakchouka', 'Couscous poisson', 'Salade sfaxienne']
          }
        ]
      },
      {
        restaurant: restaurants[1],
        menus: [
          {
            name: 'Brunch Traditionnel',
            category: 'Brunch',
            price: 15.00,
            description: 'Mélange de sucré et salé tunisien.',
            image: 'https://example.com/fatma-brunch.jpg',
            items: ['Kafteji', 'Pain maison', 'Jus d’orange frais']
          },
          {
            name: 'Dîner Fatma',
            category: 'Dinner',
            price: 20.00,
            description: 'Repas typiques de grand-mère tunisienne.',
            image: 'https://example.com/fatma-dinner.jpg',
            items: ['Ojja crevette', 'Couscous agneau', 'Thé à la menthe']
          }
        ]
      },
      {
        restaurant: restaurants[2],
        menus: [
          {
            name: 'Menu Mer Méditerranéenne',
            category: 'Seafood',
            price: 26.00,
            description: 'Fraîcheur de la mer dans l’assiette.',
            image: 'https://example.com/table-seafood.jpg',
            items: ['Calamars grillés', 'Risotto aux crevettes', 'Salade de poulpe']
          },
          {
            name: 'Saveurs du Sud',
            category: 'Dinner',
            price: 24.50,
            description: 'Cuisine du sud méditerranéen.',
            image: 'https://example.com/table-dinner.jpg',
            items: ['Paella', 'Tagine tunisien', 'Tiramisu maison']
          }
        ]
      },
      {
        restaurant: restaurants[3],
        menus: [
          {
            name: 'Lunch Urbain',
            category: 'Lunch',
            price: 19.00,
            description: 'Menu rapide mais raffiné.',
            image: 'https://example.com/bistro-lunch.jpg',
            items: ['Club sandwich', 'Soupe du jour', 'Café crème']
          },
          {
            name: 'Soirée Bistro',
            category: 'Dinner',
            price: 23.50,
            description: 'Repas complet dans une ambiance cosy.',
            image: 'https://example.com/bistro-dinner.jpg',
            items: ['Entrecôte', 'Gratin dauphinois', 'Crème brûlée']
          }
        ]
      },
      {
        restaurant: restaurants[4],
        menus: [
          {
            name: 'Déjeuner Bio',
            category: 'Lunch',
            price: 17.00,
            description: 'Produits sains et de saison.',
            image: 'https://example.com/jasmine-lunch.jpg',
            items: ['Soupe bio', 'Bowl quinoa', 'Eau citronnée']
          },
          {
            name: 'Dîner Healthy',
            category: 'Dinner',
            price: 19.50,
            description: 'Riche en fibres et en vitamines.',
            image: 'https://example.com/jasmine-dinner.jpg',
            items: ['Salade avocat', 'Légumes rôtis', 'Smoothie']
          }
        ]
      },
      {
        restaurant: restaurants[5],
        menus: [
          {
            name: 'Menu Vegan Fraîcheur',
            category: 'Vegan',
            price: 18.00,
            description: 'Zéro produit animal, 100% saveur.',
            image: 'https://example.com/green-vegan.jpg',
            items: ['Wrap tofu', 'Soupe carotte-gingembre', 'Jus vert']
          },
          {
            name: 'Green Dinner',
            category: 'Dinner',
            price: 21.00,
            description: 'Repas chaud végétarien équilibré.',
            image: 'https://example.com/green-dinner.jpg',
            items: ['Burger végétal', 'Légumes sautés', 'Tarte aux pommes']
          }
        ]
      }
    ];

    const allMenus = [];
    for (const { restaurant, menus } of menuDataByRestaurant) {
      for (const menu of menus) {
        allMenus.push({ ...menu, restaurant: restaurant._id });
      }
    }

    await Menu.create(allMenus);
    console.log('Menus créés.');

    const tables = await Table.create([
      { number: 1, capacity: 2, status: 'available', restaurant: restaurants[0]._id },
      { number: 2, capacity: 4, status: 'available', restaurant: restaurants[0]._id },
      { number: 3, capacity: 6, status: 'available', restaurant: restaurants[0]._id },
      { number: 4, capacity: 8, status: 'available', restaurant: restaurants[0]._id }
    ]);

    console.log('Tables créées.');
    console.log('Email: owner@example.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  }
};

seedDatabase();
