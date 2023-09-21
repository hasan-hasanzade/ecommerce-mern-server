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

export const getPaginatedItems = async (req, res) => {
  try {
    const allItems = await ItemModel.find();

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

   

    const results = {};
    results.result = allItems.slice(startIndex, lastIndex);
    results.totalItem = allItems.length;
    results.pageCount = Math.ceil(allItems.length/limit);

    if (lastIndex < allItems.length) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
      };
    }

    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get products',
    });
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
