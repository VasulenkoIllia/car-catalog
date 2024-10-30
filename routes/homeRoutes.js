const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Car = require('../models/Car');
const {getParentCategories} = require("../handlers/handlers");

async function getCarsRecursively(categoryId) {
  let cars = await Car.find({ category: categoryId });
  const subCategories = await Category.find({ parentCategory: categoryId });

  for (let subCategory of subCategories) {
    const subCategoryCars = await getCarsRecursively(subCategory._id);
    cars = cars.concat(subCategoryCars);
  }

  return cars;
}


async function getSubCategoriesWithCars(categoryId) {
  const categories = await Category.find({ parentCategory: categoryId });

  for (let category of categories) {
    category.cars = await Car.find({ category: category._id });
    category.subCategories = await getSubCategoriesWithCars(category._id);
  }

  return categories;
}


async function buildCarFullPath(car) {
  const category = await Category.findById(car.category);
  const parents = await getParentCategories(category);
  return parents.map(cat => `category-${cat.slug}`).join('/') + `/category-${category.slug}/car-${car.slug}`;
}


router.get('/', async (req, res) => {
  try {

    const categories = await Category.find({ parentCategory: null });
    for (let category of categories) {

      category.cars = await getCarsRecursively(category._id);
      category.subCategories = await getSubCategoriesWithCars(category._id);


      for (let car of category.cars) {
        car.fullPath = await buildCarFullPath(car);
      }

      for (let subCategory of category.subCategories) {
        for (let car of subCategory.cars) {
          car.fullPath = await buildCarFullPath(car);
        }
      }
    }

    res.render('home', {
      title: 'Каталог',
      categories,
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).send('Помилка сервера');
  }
});

module.exports = router;
