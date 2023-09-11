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
