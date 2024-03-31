if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

// acquiring routes:
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground.js');
const reviewRoutes = require('./routes/reviews');
const MongoStore = require('connect-mongo');
// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://127.0.0.1:27017/NewStuff';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind( console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisisasecret!'
    }
});

store.on('error', function(e){
    console.log("SESSION STOR ERROR!!",e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res, next) => {
    // // console.log(req.query);
    res.locals.currentUser = req.user; //to hide and show to login/register/logout 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async(req,res) => {
//     const user = new User({email: 'hello@gmail.com', username:'coltSteel'} )
//     const newUser = await User.register(user, 'chick')
//     res.send(newUser);
// })

// // what we'll really do is
// // GET /register - FORM
// // POST /register - create a user

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req,res) => {
    res.render('home')
})


app.all('*', (req,res,next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong'
    res.status(statusCode).render('error', {err});
})



app.listen(3000, () => {
    console.log('Running on port 3000')
})