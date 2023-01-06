import express from 'express';
import { addProduct, changePasswordView, dashboard, deleteUser, getAllUsers,changePassword } from '../controllers/admin';
import { deleteReward, grantReward, grantRewardView, viewAllProduct, viewAllRewards } from '../controllers/reward';
import authMiddlewareA from '../middleware/authMiddlewareA';

const router = express.Router();


router.get('/changepassword', authMiddlewareA, changePasswordView)
router.post('/changepassword', authMiddlewareA, changePassword)
router.get('/get-users', authMiddlewareA, getAllUsers)
router.post('/delete-user', authMiddlewareA, deleteUser)
router.get('/grant-reward', authMiddlewareA, grantRewardView)
router.post('/grant-reward', authMiddlewareA, grantReward)
router.post('/delete-reward', authMiddlewareA, deleteReward)
router.get('/view-reward', authMiddlewareA, viewAllRewards)
router.get('/dashboard', authMiddlewareA, dashboard)
router.get('/add-product', authMiddlewareA, addProduct)
router.post('/add-product/:id', authMiddlewareA, addProduct)
router.get('/view-product/:id', authMiddlewareA, viewAllProduct)

router.get('/logout', authMiddlewareA, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin')
    })
})



export default router;