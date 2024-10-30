const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Category = require('../models/Category');

async function getParentCategories(category) {
  const parents = [];
  while (category && category.parentCategory) {
    category = await Category.findById(category.parentCategory);
    if (category) parents.unshift(category);
  }
  return parents;
}

router.get('/:parentCategorySlug/:childCategorySlug?/car-:carSlug', async (req, res) => {
  try {
    const car = await Car.findOne({ slug: req.params.carSlug }).populate('category');
    if (!car) return res.status(404).send('Car not found');

    const category = car.category;
    const parents = await getParentCategories(category);

    const breadcrumbs = [
      { name: 'Головна', slug: '/' },
    ];

    for (const parent of parents) {
      breadcrumbs.push({
        name: parent.name,
        slug: `/categories/category-${parent.slug}`,
      });
    }

    breadcrumbs.push({
      name: category.name,
      slug: `/categories/category-${category.slug}`,
    });

    breadcrumbs.push({
      name: car.name,
      slug: `/categories/category-${category.slug}/car-${car.slug}`,
    });

    res.render('car', {
      title: car.name,
      car,
      breadcrumbs,
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
