const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// set up database connection
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true }, function(error) {
    if (error) {
        console.log('Error connecting to MongoDB database');
    } else {
        console.log('Successfully connected to MongoDB database');
    }
});

// set up schema and models
const categorySchema = new mongoose.Schema({
  name: String
});
const Category = mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});
const Product = mongoose.model('Product', productSchema);

// set up routes
app.get('/', async (req, res) => {
    try {
      const pageSize = 10;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const totalProducts = await Product.countDocuments({});
      const totalPages = Math.ceil(totalProducts / pageSize);
      const products = await Product.find({})
        .populate('category')
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
        .exec();
      res.render('index.ejs', { products, totalPages, currentPage: page });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

app.get('/new', function(req, res) {
  Category.find(function(err, categories) {
    if (err) {
      console.log(err);
    } else {
      res.render('new.ejs', { categories: categories });
    }
  });
});

app.post('/', function(req, res) {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  });
  product.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/:id/edit', function(req, res) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      console.log(err);
    } else {
      Category.find(function(err, categories) {
        if (err) {
          console.log(err);
        } else {
          res.render('edit.ejs', { product: product, categories: categories });
        }
      });
    }
  });
});

app.put('/:id', function(req, res) {
  Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  }, function(err, product) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/:id', function(req, res) {
  Product.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

// set up server
app.listen(3000, function() {
  console.log('Server started on port 3000.');
});
