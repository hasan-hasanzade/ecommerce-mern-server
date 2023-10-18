import ItemModel from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get products',
    });
  }
};

const validSortOptions = [
  'popular ( high to low )',
  'popular ( low to high )',
  'price ( high to low )',
  'price ( low to high )',
];

export const getFilteredItems = async (req, res) => {
  try {
    const searchTerm = req.query.q ? req.query.q.toLowerCase() : null;
    const categoryTerm = req.query.c ? req.query.c.toLowerCase() : null;
    const sort = req.query.sort;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    let query = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    if (categoryTerm && categoryTerm !== 'all') {
      query.category = { $regex: categoryTerm, $options: 'i' };
    }

    let sortField = 'price';
    let sortDirection = 1;

    if (validSortOptions.includes(sort)) {
      if (sort === 'popular ( high to low )') {
        sortField = 'rating';
        sortDirection = -1;
      } else if (sort === 'popular ( low to high )') {
        sortField = 'rating';
        sortDirection = 1;
      } else if (sort === 'price ( high to low )') {
        sortField = 'price';
        sortDirection = -1;
      } else if (sort === 'price ( low to high )') {
        sortField = 'price';
        sortDirection = 1;
      }
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const allItems = await ItemModel.find(query)
      .sort({ [sortField]: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await ItemModel.countDocuments(query);
    const pageCount = Math.ceil(totalCount / limit);

    const results = {
      items: allItems,
      totalCount,
      pageCount,
      currentPage: page,
    };

    if (page < pageCount) {
      results.next = {
        page: page + 1,
      };
    }

    if (page > 1) {
      results.prev = {
        page: page - 1,
      };
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Произошла ошибка при запросе' });
  }
};

export const getOne = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await ItemModel.findById({ _id: itemId });
    res.json(item);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get product',
    });
  }
};
