const express = require('express');
const { handleSearch, handleReverse } = require('../controllers/searchController');
const router = express.Router();

router.get('/search', handleSearch);
router.get('/reverse', handleReverse);

module.exports = router;
