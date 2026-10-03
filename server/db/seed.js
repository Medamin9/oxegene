import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.message.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!ChangeMe', 10);
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@oxegene.coffee',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user');

  // Create categories — based on the real Oxygène Café menu
  const categories = [
    {
      name: 'Oxygène Café',
      slug: 'oxygene-cafe',
      description: 'Nos cafés chauds classiques préparés avec soin pour un moment de détente.',
      icon: 'local_cafe',
      order: 1,
    },
    {
      name: 'Oxygène Iced Coffee',
      slug: 'iced-coffee',
      description: 'Cafés glacés rafraîchissants aux saveurs variées pour se désaltérer.',
      icon: 'ac_unit',
      order: 2,
    },
    {
      name: 'Oxygène Gaufres',
      slug: 'gaufres',
      description: 'Gaufres croustillantes garnies de saveurs gourmandes irrésistibles.',
      icon: 'bakery_dining',
      order: 3,
    },
    {
      name: 'Crêpes',
      slug: 'crepes',
      description: 'Crêpes fines et généreuses aux garnitures chocolatées et créatives.',
      icon: 'lunch_dining',
      order: 4,
    },
    {
      name: 'Oxygène Gâteaux',
      slug: 'gateaux',
      description: 'Pâtisseries maison et gâteaux faits avec amour pour accompagner votre café.',
      icon: 'cake',
      order: 5,
    },
    {
      name: 'Toasts',
      slug: 'toasts',
      description: 'Toasts chauds et savoureux pour les petites faims du matin ou du soir.',
      icon: 'lunch_dining',
      order: 6,
    },
    {
      name: 'Eaux & Jus',
      slug: 'eaux-et-jus',
      description: 'Boissons fraîches, eaux minérales et jus naturels pour se désaltérer.',
      icon: 'local_drink',
      order: 7,
    },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    createdCategories[cat.slug] = await prisma.category.create({ data: cat });
  }
  console.log('✅ Created categories');

  // Images are uploaded via the admin panel — no placeholder URLs at seed time
  const products = [
    // ── Oxygène Café ────────────────────────────────────────────────────────────
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Espresso',          slug: 'espresso',           description: 'Un shot d\'espresso intense et corsé, l\'essence pure du café.',                                          price: 2.0,  imageUrl: '', order: 1 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Direct',       slug: 'cafe-direct',        description: 'Café filtre droit en tasse, doux et aromatique.',                                                       price: 2.0,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Allongé',      slug: 'cafe-allonge',       description: 'Espresso allongé à l\'eau chaude pour une saveur plus douce.',                                          price: 2.5,  imageUrl: '', order: 3 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Crème',        slug: 'cafe-creme',         description: 'Espresso onctueux couronné d\'une mousse de lait veloutée.',                                            price: 3.0,  imageUrl: '', order: 4 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Cappuccino',        slug: 'cappuccino',         description: 'Équilibre parfait entre espresso, lait chaud et mousse généreuse.',                                     price: 3.5,  imageUrl: '', order: 5, isBestSeller: true },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Capucin',      slug: 'cafe-capucin',       description: 'Cappuccino saupoudré de cacao pour une touche gourmande.',                                              price: 3.5,  imageUrl: '', order: 6 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café au Lait',      slug: 'cafe-au-lait',       description: 'Café doux mélangé à du lait chaud pour une boisson réconfortante.',                                    price: 3.0,  imageUrl: '', order: 7 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Américain',    slug: 'cafe-americain',     description: 'Grand café allongé à l\'américaine, léger et facile à boire.',                                         price: 3.0,  imageUrl: '', order: 8 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Macchiato',    slug: 'cafe-macchiato',     description: 'Espresso avec une légère touche de lait en mousse.',                                                    price: 3.0,  imageUrl: '', order: 9 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Double Espresso',   slug: 'double-espresso',    description: 'Double dose d\'espresso pour les amateurs de café intense.',                                            price: 3.5,  imageUrl: '', order: 10 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Pistache',     slug: 'cafe-pistache',      description: 'Espresso crémeux agrémenté d\'un sirop de pistache artisanal.',                                        price: 4.5,  imageUrl: '', order: 11, isSpecialty: true },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Vanille',      slug: 'cafe-vanille',       description: 'Douceur vanillée infusée dans un espresso mousseux.',                                                   price: 4.0,  imageUrl: '', order: 12 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Noisette',     slug: 'cafe-noisette',      description: 'Espresso avec un nuage de lait pour une saveur noisettée.',                                            price: 3.5,  imageUrl: '', order: 13 },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Caramel',      slug: 'cafe-caramel',       description: 'Café chaud nappé de caramel fondant et de crème fouettée.',                                            price: 4.5,  imageUrl: '', order: 14, isBestSeller: true },
    { categoryId: createdCategories['oxygene-cafe'].id, name: 'Café Chocolat',     slug: 'cafe-chocolat',      description: 'Mocha gourmand au chocolat noir et espresso intense.',                                                  price: 4.5,  imageUrl: '', order: 15 },

    // ── Oxygène Iced Coffee ─────────────────────────────────────────────────────
    { categoryId: createdCategories['iced-coffee'].id, name: 'Iced Coffee Classique', slug: 'iced-coffee-classique', description: 'Café glacé classique, simple et rafraîchissant.',                           price: 4.0,  imageUrl: '', order: 1, isBestSeller: true },
    { categoryId: createdCategories['iced-coffee'].id, name: 'Iced Coffee Vanille',   slug: 'iced-coffee-vanille',   description: 'Café glacé aromatisé à la vanille douce.',                                 price: 4.5,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['iced-coffee'].id, name: 'Iced Coffee Caramel',   slug: 'iced-coffee-caramel',   description: 'Café glacé nappé d\'un sirop de caramel généreux.',                        price: 4.5,  imageUrl: '', order: 3 },
    { categoryId: createdCategories['iced-coffee'].id, name: 'Iced Coffee Noisette',  slug: 'iced-coffee-noisette',  description: 'Café glacé avec un sirop de noisette gourmand.',                          price: 4.5,  imageUrl: '', order: 4 },
    { categoryId: createdCategories['iced-coffee'].id, name: 'Iced Coffee Chocolat',  slug: 'iced-coffee-chocolat',  description: 'Café glacé au chocolat pour les amateurs de douceur.',                    price: 4.5,  imageUrl: '', order: 5, isSpecialty: true },

    // ── Gaufres ─────────────────────────────────────────────────────────────────
    { categoryId: createdCategories['gaufres'].id, name: 'Gaufre Pistache',         slug: 'gaufre-pistache',         description: 'Gaufre croustillante garnie de crème de pistache et pistaches concassées.', price: 7.5,  imageUrl: '', order: 1, isSpecialty: true },
    { categoryId: createdCategories['gaufres'].id, name: 'Gaufre Chocolat Blanc',   slug: 'gaufre-chocolat-blanc',   description: 'Gaufre moelleuse nappée de chocolat blanc fondant.',                        price: 6.5,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['gaufres'].id, name: 'Gaufre Noisette',         slug: 'gaufre-noisette',         description: 'Gaufre dorée avec une généreuse pâte à tartiner noisette.',                 price: 6.5,  imageUrl: '', order: 3, isBestSeller: true },
    { categoryId: createdCategories['gaufres'].id, name: 'Gaufre Chocolat',         slug: 'gaufre-chocolat',         description: 'Gaufre classique garnie de chocolat noir fondu.',                           price: 6.0,  imageUrl: '', order: 4 },

    // ── Crêpes ──────────────────────────────────────────────────────────────────
    { categoryId: createdCategories['crepes'].id, name: 'Crêpe Pistache',           slug: 'crepe-pistache',           description: 'Fine crêpe garnie de crème de pistache et fruits secs.',                  price: 7.0,  imageUrl: '', order: 1, isSpecialty: true },
    { categoryId: createdCategories['crepes'].id, name: 'Crêpe Chocolat Blanc',     slug: 'crepe-chocolat-blanc',     description: 'Crêpe légère nappée de chocolat blanc onctueux.',                          price: 6.5,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['crepes'].id, name: 'Crêpe Chocolat Noisette',  slug: 'crepe-chocolat-noisette',  description: 'Crêpe gourmande avec pâte chocolat-noisette façon Nutella.',               price: 6.5,  imageUrl: '', order: 3, isBestSeller: true },
    { categoryId: createdCategories['crepes'].id, name: 'Crêpe Cocktail',           slug: 'crepe-cocktail',           description: 'Crêpe aux multiples garnitures pour une expérience sucrée unique.',        price: 7.5,  imageUrl: '', order: 4 },

    // ── Gâteaux ─────────────────────────────────────────────────────────────────
    { categoryId: createdCategories['gateaux'].id, name: 'Brownie Chocolat',               slug: 'brownie-chocolat',             description: 'Brownie fondant au chocolat noir intense, cœur coulant garanti.',          price: 5.0,  imageUrl: '', order: 1, isBestSeller: true },
    { categoryId: createdCategories['gateaux'].id, name: 'Brownie Vanille',                slug: 'brownie-vanille',              description: 'Brownie blondie à la vanille avec pépites de chocolat blanc.',               price: 5.0,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['gateaux'].id, name: 'Brownie Café',                   slug: 'brownie-cafe',                 description: 'Brownie intensément parfumé au café et cœur fondant.',                       price: 5.5,  imageUrl: '', order: 3 },
    { categoryId: createdCategories['gateaux'].id, name: 'Croissant',                      slug: 'croissant',                    description: 'Croissant pur beurre, feuilleté et doré à la perfection.',                   price: 3.5,  imageUrl: '', order: 4 },
    { categoryId: createdCategories['gateaux'].id, name: 'Gâteau Noisette',                slug: 'gateau-noisette',              description: 'Gâteau moelleux à la noisette recouvert de ganache crémeuse.',               price: 6.0,  imageUrl: '', order: 5 },
    { categoryId: createdCategories['gateaux'].id, name: 'Gâteau Chocolat',                slug: 'gateau-chocolat',              description: 'Gâteau au chocolat fondant, le classique indétrônable.',                     price: 6.0,  imageUrl: '', order: 6 },
    { categoryId: createdCategories['gateaux'].id, name: 'Gâteau Carré Chocolat & Beurre', slug: 'gateau-carre-chocolat-beurre', description: 'Carré de gâteau ultra-riche au chocolat et beurre artisanal.',               price: 6.5,  imageUrl: '', order: 7, isSpecialty: true },
    { categoryId: createdCategories['gateaux'].id, name: 'Mille-Feuille',                  slug: 'mille-feuille',                description: 'Classique français : pâte feuilletée croustillante et crème pâtissière.',   price: 7.0,  imageUrl: '', order: 8, isBestSeller: true },

    // ── Toasts ──────────────────────────────────────────────────────────────────
    { categoryId: createdCategories['toasts'].id, name: 'Toast Fromage',  slug: 'toast-fromage',  description: 'Toast grillé fondant au fromage fondu, simple et savoureux.',           price: 5.0,  imageUrl: '', order: 1, isBestSeller: true },
    { categoryId: createdCategories['toasts'].id, name: 'Toast Thon',     slug: 'toast-thon',     description: 'Toast chaud garni de thon, de mayonnaise et légumes croquants.',         price: 6.0,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['toasts'].id, name: 'Toast Cocktail', slug: 'toast-cocktail', description: 'Toast garni d\'une sélection de charcuteries et fromages variés.',       price: 6.5,  imageUrl: '', order: 3 },

    // ── Eaux & Jus ──────────────────────────────────────────────────────────────
    { categoryId: createdCategories['eaux-et-jus'].id, name: 'Eau Grande',    slug: 'eau-grande',    description: 'Bouteille d\'eau minérale grande (1.5L).',                             price: 2.0,  imageUrl: '', order: 1 },
    { categoryId: createdCategories['eaux-et-jus'].id, name: 'Eau Petite',    slug: 'eau-petite',    description: 'Bouteille d\'eau minérale petite (0.5L).',                             price: 1.0,  imageUrl: '', order: 2 },
    { categoryId: createdCategories['eaux-et-jus'].id, name: 'Jus de Kiwi',   slug: 'jus-de-kiwi',   description: 'Jus de kiwi frais pressé, riche en vitamine C.',                      price: 4.5,  imageUrl: '', order: 3 },
    { categoryId: createdCategories['eaux-et-jus'].id, name: 'Jus de Fraise', slug: 'jus-de-fraise', description: 'Jus de fraises fraîches, sucré naturellement et vitaminé.',            price: 4.5,  imageUrl: '', order: 4, isBestSeller: true },
    { categoryId: createdCategories['eaux-et-jus'].id, name: 'Jus de Citron', slug: 'jus-de-citron', description: 'Citronnade fraîche pressée, légèrement sucrée et désaltérante.',      price: 3.5,  imageUrl: '', order: 5 },
    { categoryId: createdCategories['eaux-et-jus'].id, name: 'Jus Cocktail',  slug: 'jus-cocktail',  description: 'Mélange de jus de fruits frais de saison pour une boisson vitaminée.', price: 5.0,  imageUrl: '', order: 6, isSpecialty: true },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Created products');

  // Create site content — Oxygène Café, Menzel Bouzaien
  await prisma.siteContent.create({
    data: {
      key: 'hero',
      section: 'hero',
      content: {
        title: 'Un bon café…',
        subtitle: 'une bonne humeur !',
        description: 'Bienvenue à l\'Oxygène Café, votre espace de détente à Menzel Bouzaien. Savourez nos cafés chauds, glacés, gaufres et pâtisseries dans une ambiance chaleureuse.',
        currentLot: 'Wi-Fi Gratuit • Réseau : OXYGÈNE',
        averageExtraction: 'Ouvert le Dimanche',
      },
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'about',
      section: 'about',
      content: {
        title: 'À propos d\'Oxygène Café',
        description: 'Votre café de quartier à Menzel Bouzaien, en face d\'Ooredoo, à côté du restaurant Naji.',
        tagline: 'Un bon café, une bonne humeur !',
      },
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'contact',
      section: 'contact',
      content: {
        address: 'En face d\'Ooredoo\nÀ côté du restaurant Naji\nMenzel Bouzaien, Tunisie',
        phone: '',
        email: '',
        hours: 'Lundi – Samedi : 07:30 – 23:00\nDimanche : Ouvert',
        twilightRituals: 'Pop-corn en coupe — spécialement pour les matchs de foot !',
      },
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'footer',
      section: 'footer',
      content: {
        description: 'Votre café de quartier à Menzel Bouzaien. Cafés, gaufres, crêpes, pâtisseries et bien plus.',
        copyright: '© 2026 Oxygène Café. Tous droits réservés.',
        tagline: 'Un bon café, une bonne humeur !',
        socialDescription: 'Suivez-nous pour nos offres et actualités.',
      },
    },
  });

  console.log('✅ Created site content');

  // Create settings
  await prisma.settings.create({
    data: {
      key: 'shop',
      value: {
        name: 'Oxygène Café',
        currency: 'TND',
        acceptingOrders: true,
        openingHours: '07:30 - 23:00',
        wifi: 'Réseau : OXYGÈNE • Code : Oxygene@2026',
        location: 'Menzel Bouzaien, en face d\'Ooredoo',
      },
      description: 'Configuration principale du café',
    },
  });

  await prisma.settings.create({
    data: {
      key: 'seo',
      value: {
        title: 'Oxygène Café — Un bon café, une bonne humeur !',
        description: 'Café à Menzel Bouzaien. Cafés chauds, iced coffee, gaufres, crêpes, gâteaux, toasts et jus.',
        keywords: 'café, menzel bouzaien, iced coffee, gaufres, crêpes, pâtisseries, toasts, jus',
      },
      description: 'Configuration SEO',
    },
  });

  console.log('✅ Created settings');

  // Create sample testimonials
  await prisma.testimonial.create({
    data: {
      name: 'Sana M.',
      role: 'Cliente fidèle',
      content: 'Le meilleur café de Menzel Bouzaien ! Les gaufres à la pistache sont à tomber. Ambiance chaleureuse et service au top.',
      rating: 5,
      visible: true,
      order: 1,
    },
  });

  await prisma.testimonial.create({
    data: {
      name: 'Youssef B.',
      role: 'Fan de football',
      content: 'Je viens regarder les matchs ici avec les pop-corns en coupe. Iced coffee caramel + match de foot = combo parfait !',
      rating: 5,
      visible: true,
      order: 2,
    },
  });

  await prisma.testimonial.create({
    data: {
      name: 'Rania K.',
      role: 'Étudiante',
      content: 'Wi-Fi gratuit, café délicieux et croissants tout frais. L\'endroit idéal pour travailler ou se retrouver entre amis.',
      rating: 5,
      visible: true,
      order: 3,
    },
  });

  console.log('✅ Created testimonials');

  console.log('🎉 Database seeded successfully!');
  console.log(`\n📧 Admin login: ${admin.email}`);
  console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'Admin123!ChangeMe'}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
