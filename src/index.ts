import flash from 'connect-flash'
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import expressSession from 'express-session'
import mongoose, { Callback, CallbackError, CallbackWithoutResult, Types } from 'mongoose'
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';
import indexRoutes from './routes/index';
import authMiddleware from './middleware/authMiddleware';

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


mongoose.connect('mongodb://localhost:27017/rewardsdb',{ useNewUrlParser: true, useUnifiedTopology: true }).
then((db)=>{
    console.log('database connected successfully')
}) 
.catch((err)=>{
    console.log(err);
})

app.use(expressSession({
    secret: 'danceingcat',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/admin', adminRoutes);
app.use('/dashboard',authMiddleware, userRoutes);
app.use(indexRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
next()
})



app.listen(3000, () => {
    console.log('listening on port 3000');
});