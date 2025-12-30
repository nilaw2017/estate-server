import express from 'express';
import {
    deleteUser,
    getUser,
    getUsers,
    updateUser
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all users
router.get('/', verifyToken, getUsers);
// Get a single user by ID
router.get('/:id', verifyToken, getUser);
// Update a user by ID
router.put('/:id', verifyToken, updateUser);
// Delete a user by ID
router.delete('/:id', verifyToken, deleteUser);

export default router;