import express from 'express';
import { home, login, signinView, signup, signupView } from "../controllers/auth"
import {signinView as signinViewA ,login as loginA} from "../controllers/admin"

const router = express.Router();

router.get('/signin',signinView );
router.get('/signup',signupView );
router.post('/signin',login );
router.post('/signup',signup );
router.get('/',home );
router.get('/admin',signinViewA );
router.post('/admin',loginA );
router.get('/about',(req,res)=>{
    res.render('about',{
        pageTitle: "about"
    })
} );
router.get('/logout',(req, res) =>{
    req.session.destroy(() =>{
    res.redirect('/')
    })
    })

export default router;