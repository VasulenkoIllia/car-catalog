const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');
const fs = require('fs');
const session = require('express-session');
const passport = require('./config/passportConfig');
const flash = require('connect-flash');
const adminRoutes = require('./routes/adminRoutes'); // Admin routes
const categoryRoutes = require('./routes/categoryRoutes');
const homeRoutes = require('./routes/homeRoutes');

dotenv.config();

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1.toString() === arg2.toString()) ? options.fn(this) : options.inverse(this);
});

const categoryOptionsPartial = fs.readFileSync(path.join(__dirname, 'views/partials/categoryOptions.handlebars'), 'utf8');
handlebars.registerPartial('categoryOptions', categoryOptionsPartial);

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/categories', categoryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

class A {
  constructor(name) {
  }
}

