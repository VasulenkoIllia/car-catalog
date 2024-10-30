const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Category = require('./models/Category');
const Car = require('./models/Car');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const saveCategory = async (categoryData, parentCategory = null) => {
  const category = new Category({
    name: categoryData.name,
    description: categoryData.description,
    slug: categoryData.slug,
    image: categoryData.image,
    parentCategory: parentCategory ? parentCategory._id : null
  });
  await category.save();

  for (const subCategoryData of categoryData.subCategories) {
    await saveCategory(subCategoryData, category);
  }
};

const importData = async (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const categoryData of data.categories) {
      await saveCategory(categoryData);
    }

    for (const carData of data.cars) {
      const category = await Category.findOne({ slug: carData.category });
      if (!category) {
        console.error(`Category not found for car: ${carData.name}`);
        continue;
      }

      const car = new Car({
        name: carData.name,
        price: carData.price,
        color: carData.color,
        image: carData.image,
        description: carData.description,
        slug: carData.slug,
        category: category._id
      });
      await car.save();
    }

    console.log('Data imported successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing data:', error);
    mongoose.connection.close();
  }
};

const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a file path for the import.');
  process.exit(1);
}

importData(filePath);
