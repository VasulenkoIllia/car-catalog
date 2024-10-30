const express = require('express');
const passport = require('passport');
const router = express.Router();
const Car = require('../models/Car');
const Category = require('../models/Category');


router.get('/login', (req, res) => {
  res.render('admin/login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/cars',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/admin/login');
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
}

router.get('/cars', ensureAuthenticated, async (req, res) => {
  const cars = await Car.find().populate('category');
  const categories = await Category.find();

  res.render('admin/carList', { cars, categories });
});



async function getParentCategories(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) {
    return [];
  }

  if (category.parentCategory) {
    const parentCategories = await getParentCategories(category.parentCategory);
    return [...parentCategories, category];
  }

  return [category];
}


router.post('/cars/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const { name, description, price, color, category } = req.body;
    const carId = req.params.id;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).send('Car not found');

    if (car.category.toString() !== category) {
      await Category.findByIdAndUpdate(category, { $push: { cars: carId } });
    }

    await Car.findByIdAndUpdate(carId, {
      name,
      description,
      price,
      color,
      category: category
    });

    res.redirect('/admin/cars');
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).send('Server error while updating car.');
  }
});



module.exports = router;
