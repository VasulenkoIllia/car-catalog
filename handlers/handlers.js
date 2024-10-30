const {model} = require("mongoose");
const Category = model('Category')

exports.buildCarFullPath =  async function buildCarFullPath(car) {
  const category = await Category.findById(car.category);
  const parents = await getParentCategories(category);


  return parents.map(cat => `category-${cat.slug}`).join('/') + `/category-${category.slug}/car-${car.slug}`;
}

async function getParentCategories(category) {
  const parents = [];
  while (category.parentCategory) {
    category = await Category.findById(category.parentCategory);
    parents.unshift(category);
  }
  return parents;
}
exports.getParentCategories = getParentCategories;
