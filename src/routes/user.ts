import  express  from 'express'
import  { dashboard, profile, profileView }  from '../controllers/user'
import  { viewAllUserRewards, viewProduct }  from "../controllers/reward"
import  { changePassword, changePasswordView }  from "../controllers/auth"

const router = express.Router();

router.get('/', dashboard)
router.get('/profile', profileView)
router.post('/profile', profile)
router.get('/rewards', viewAllUserRewards)
router.get('/rewards/:id', viewProduct)
router.get('/changepassword', changePasswordView)
router.post('/changepassword', changePassword)



export default router;