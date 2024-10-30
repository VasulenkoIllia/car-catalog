const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Car = require('./models/Car');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.log(err));

const seedDB = async () => {
  await Admin.deleteMany({});
  await Category.deleteMany({});
  await Car.deleteMany({});

  const hashedPassword = await bcrypt.hash('admin', 10);

  const admin = new Admin({
    username: 'admin',
    password: hashedPassword
  });

  await admin.save();
  console.log('Admin created!');

  const sedansCategory = new Category({
    name: 'Седани',
    description: 'Комфортні автомобілі для довгих подорожей.',
    slug: 'sedans',
    image: 'https://example.com/sedans-category.jpg',
  });

  const suvsCategory = new Category({
    name: 'Позашляховики',
    description: 'Машини для подорожей по бездоріжжю.',
    slug: 'suvs',
    image: 'https://example.com/suvs-category.jpg',
  });

  await sedansCategory.save();
  await suvsCategory.save();

  const luxurySedansCategory = new Category({
    name: 'Люксові Седани',
    description: 'Розкішні автомобілі для тих, хто цінує комфорт і престиж.',
    slug: 'luxury-sedans',
    image: 'https://example.com/luxury-sedans.jpg',
    parentCategory: sedansCategory._id
  });

  const electricSedansCategory = new Category({
    name: 'Електричні Седани',
    description: 'Сучасні електромобілі з новітніми технологіями.',
    slug: 'electric-sedans',
    image: 'https://example.com/electric-sedans.jpg',
    parentCategory: sedansCategory._id
  });

  await luxurySedansCategory.save();
  await electricSedansCategory.save();

  const premiumLuxurySedansCategory = new Category({
    name: 'Преміум Люксові Седани',
    description: 'Преміальні люксові автомобілі з найкращими характеристиками.',
    slug: 'premium-luxury-sedans',
    image: 'https://example.com/premium-luxury-sedans.jpg',
    parentCategory: luxurySedansCategory._id
  });

  const hybridElectricSedansCategory = new Category({
    name: 'Гібридні Електричні Седани',
    description: 'Гібридні електромобілі для більшої ефективності.',
    slug: 'hybrid-electric-sedans',
    image: 'https://example.com/hybrid-electric-sedans.jpg',
    parentCategory: electricSedansCategory._id
  });

  await premiumLuxurySedansCategory.save();
  await hybridElectricSedansCategory.save();

  sedansCategory.subCategories = [luxurySedansCategory._id, electricSedansCategory._id];
  luxurySedansCategory.subCategories = [premiumLuxurySedansCategory._id];
  electricSedansCategory.subCategories = [hybridElectricSedansCategory._id];

  await sedansCategory.save();
  await luxurySedansCategory.save();
  await electricSedansCategory.save();

  const car1 = new Car({
    name: 'Tesla Model S',
    price: 80000,
    color: 'Білий',
    image: 'https://example.com/tesla-model-s.jpg',
    description: 'Електричний седан з футуристичним дизайном.',
    slug: 'tesla-model-s',
    category: electricSedansCategory._id
  });

  const car2 = new Car({
    name: 'BMW 7 Series',
    price: 120000,
    color: 'Синій',
    image: 'https://example.com/bmw-7-series.jpg',
    description: 'Люксовий седан з потужним двигуном і високоякісними матеріалами.',
    slug: 'bmw-7-series',
    category: premiumLuxurySedansCategory._id
  });

  await car1.save();
  await car2.save();

  electricSedansCategory.cars.push(car1._id);
  premiumLuxurySedansCategory.cars.push(car2._id);

  await electricSedansCategory.save();
  await premiumLuxurySedansCategory.save();

  console.log('Database seeded with categories and cars!');
  mongoose.connection.close();
};

seedDB();
