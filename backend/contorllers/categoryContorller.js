import asyncHandler from 'express-async-handler';
import Category from '../models/category.js';

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    try{
    if (!name) {
        return res.status(400).json({ message: 'Please provide a category name' });
    }
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }
    const category = await Category.create({ name });
        res.status(201).json(category);

}catch(error)
{ return res.status(500).json({ message: 'Error creating category', error: error.message });
}
});

const getAllCategories = asyncHandler(async (req, res) => {
    try{
    const allCategories = await Category.find({});
    res.status(200).json(allCategories);
}catch(error){    return res.status(500).json({ message: 'Error fetching categories', error: error.message });
}
});
 
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try{
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
}catch(error){    return res.status(500).json({ message: 'Error deleting category', error: error.message });
}
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try{
    if (!name) {
        return res.status(400).json({ message: 'Please provide a Valid category name' });
    }
    const category = await Category.findById(id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    category.name = name;
    await category.save();
    res.status(200).json(category);
}catch(error){    return res.status(500).json({ message: 'Error updating category', error: error.message });
}
});

 const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});
export { createCategory, getAllCategories, deleteCategory, updateCategory ,readCategory};