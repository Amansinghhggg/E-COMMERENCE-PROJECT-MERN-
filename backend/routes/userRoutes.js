import express from 'express';
const router = express.Router();
import { createUser ,loginUser ,logoutUser ,
    getAllUsers,
    getCurrentUserProfile,updateUserProfile , deleteUserProfile, deleteOneUser, makeUserAdmin}
 from '../contorllers/userController.js';
import { userAuthorization, adminAuthorization } from "../middlewares/Authorization.js";
router.route('/').post(createUser)
                .get(userAuthorization, adminAuthorization, getAllUsers)
                .delete(userAuthorization, adminAuthorization, deleteUserProfile);

router.route('/auth').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/profile').get(userAuthorization,getCurrentUserProfile)
                        .put(userAuthorization,updateUserProfile)
                        .delete(userAuthorization,deleteUserProfile)

router.route('/:id').delete(userAuthorization, adminAuthorization, deleteOneUser)
.put(userAuthorization, adminAuthorization, makeUserAdmin);

export default router;