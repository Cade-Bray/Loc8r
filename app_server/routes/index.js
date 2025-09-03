const express = require('express');
const router = express.Router();

/* GET home page. */
const homepageController = (req, res) => {
  res.render('index', {title: 'Express'});
};
router.get('/', homepageController);

module.exports = router;
