const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Car = require('../models/Car');
const {buildCarFullPath, getParentCategories} = require("../handlers/handlers");


async function getSubCategories(categoryId) {
  return await Category.find({ parentCategory: categoryId });
}

async function getCarsFromSubCategories(categoryId) {
  let cars = await Car.find({ category: categoryId });
  const subCategories = await getSubCategories(categoryId);

  for (let subCategory of subCategories) {
    const subCategoryCars = await getCarsFromSubCategories(subCategory._id);
    cars = cars.concat(subCategoryCars);
  }

  return cars;
}

async function getFullPath(category) {
  const parents = await getParentCategories(category);
  return [...parents, category].map(p => `category-${p.slug}`).join('/');
}

router.get('*', async (req, res) => {
  const path = req.params[0].split('/').filter(Boolean);
  let category = null;
  let breadcrumbs = [];
  let currentSlug = '';

  try {
    for (let segment of path) {
      if (segment.startsWith('category-')) {
        currentSlug = segment.replace('category-', '');
        category = await Category.findOne({ slug: currentSlug }).populate('subCategories');
        if (!category) return res.status(404).send('Категорія не знайдена');

        const fullPath = await getFullPath(category);

        breadcrumbs.push({
          name: category.name,
          slug: `category-${category.slug}`,
          fullPath: fullPath
        });
      } else if (segment.startsWith('car-')) {
        const carSlug = segment.replace('car-', '');
        const car = await Car.findOne({ slug: carSlug }).populate('category');
        if (!car) return res.status(404).send('Автомобіль не знайдено');

        const parents = await getParentCategories(car.category);

        const fullPaths = [];
        for (let cat of [...parents, car.category]) {
          fullPaths.push({
            name: cat.name,
            slug: `category-${cat.slug}`,
            fullPath: await getFullPath(cat)
          });
        }

        return res.render('car', {
          title: car.name,
          car,
          breadcrumbs: fullPaths
        });
      }
    }

    if (!category) return res.status(404).send('Категорія не знайдена');

    const subCategories = await getSubCategories(category._id);
    const cars = await getCarsFromSubCategories(category._id);

    const fullPaths = [];
    for (let cat of [...(await getParentCategories(category)), category]) {
      fullPaths.push({
        name: cat.name,
        slug: `category-${cat.slug}`,
        fullPath: await getFullPath(cat)
      });
    }
    category.fullPath = fullPaths[fullPaths.length - 1].fullPath;

    for (let car of cars) {
      car.fullPath = await buildCarFullPath(car);
    }

    return res.render('category', {
      title: category.name,
      category,
      subCategories,
      cars,
      fullPathCar: 'qweqwe',
      breadcrumbs: fullPaths
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).send('Помилка сервера');
  }
});

module.exports = router;
