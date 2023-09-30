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

// export const getSearchedItems = async (req, res) => {
//   try {
//     const searchTerm = req.query.q.toLowerCase();
//     const items = await ItemModel.find({ title: { $regex: searchTerm, $options: 'i' } });
//     const totalCount = items.length; 
//     res.json({ items, totalCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Произошла ошибка при поиске' });
//   }
// };

// export const getCategoryItems = async (req, res) => {
//   try {
//     const categoryTerm = req.query.c.toLowerCase();
//     let query = {};

//     if (categoryTerm !== 'all') {
//       query = { category: { $regex: categoryTerm, $options: 'i' } };
//     }

//     const items = await ItemModel.find(query);
//     const totalCount = items.length; 
//     res.json({ items, totalCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Произошла ошибка при поиске' });
//   }
// };

// export const getSortedItems = async (req, res) => {
//   try {
//     const sort = req.query.sort; // Получите параметр сортировки из запроса
//     let query = {};

//     if (sort === 'price') {
//       query = { category: { $regex: sort, $options: 'i' } };
//     }

//     let sortField = 'price'; // По умолчанию сортировка по цене
//     if (sort === 'popular') {
//       sortField = 'rating'; // Если выбрано Popular, сортировка по рейтингу
//     }

//     const items = await ItemModel.find(query).sort({ [sortField]: -1 }); // Сортировка по выбранному полю
//     const totalCount = items.length; 
//     res.json({ items, totalCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Произошла ошибка при поиске' });
//   }
// };

// export const getPaginatedItems = async (req, res) => {
//   try {
//     const allItems = await ItemModel.find();

//     const page = parseInt(req.query.page);
//     const limit = parseInt(req.query.limit);

//     const startIndex = (page - 1) * limit;
//     const lastIndex = page * limit;

   

//     const results = {};
//     results.result = allItems.slice(startIndex, lastIndex);
//     results.totalItem = allItems.length;
//     results.pageCount = Math.ceil(allItems.length/limit);

//     if (lastIndex < allItems.length) {
//       results.next = {
//         page: page + 1,
//       };
//     }

//     if (startIndex > 0) {
//       results.prev = {
//         page: page - 1,
//       };
//     }

//     res.json(results);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Cannot get products',
//     });
//   }
// };

// Define the valid sort options
const validSortOptions = ['popular ( high to low )', 'popular ( low to high )', 'price ( high to low )', 'price ( low to high )'];

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
