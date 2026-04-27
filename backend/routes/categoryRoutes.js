import { createCategory, getAllCategories, deleteCategory, updateCategory ,readCategory} from  "../contorllers/categoryContorller.js";
import express from 'express';
import { userAuthorization, adminAuthorization } from "../middlewares/Authorization.js";
const router = express.Router();

router.route('/').get(getAllCategories)
.post(userAuthorization, adminAuthorization, createCategory);
router.route('/:id').delete(userAuthorization, adminAuthorization, deleteCategory)
.put(userAuthorization, adminAuthorization, updateCategory)
.get(userAuthorization, readCategory);

export default router;