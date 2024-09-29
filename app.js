let express = require("express");
let sendEmail = require('./email.js');
let mongoose=require("mongoose");
let app = express();
const Category=require('./models/data.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');  // sasta juggad
const User = require('./models/user.js'); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
let port = 3030;
app.use(express.json());


let mongoDB_url="mongodb://localhost:27017/alert";
let atlas_url=process.env.ATLAS_URL;
async function main(){
    await mongoose.connect(mongoDB_url);
};

main() 
.then(()=>{console.log("database connected ")})
.catch((err)=>console.log(err));
  

// local stratergy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        // No password is required for Google OAuth
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});



app.use(session({
    secret: 'yourSecretKey',  
    resave: false,           
    saveUninitialized: false, 
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/yourDatabase',
        mongooseConnection: mongoose.connection,            
        ttl: 14 * 24 * 60 * 60, 
        autoRemove: 'native',    
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000, 
        secure: false,  
        httpOnly: true  
}));

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());  // This handles persistent login sessions




// core logic 
async function addAlertIfNotExists(newAlert, categoryName) {
  try {
      // Step 1: Check if the alert already exists in the category
      const category = await Category.findOne({
          categoryName: categoryName,
          alerts: { $elemMatch: { alertTitle: newAlert.alertTitle } }  // Check if alert with the same title exists
      });

      if (category) {
          console.log('Alert already exists, skipping storage.');
          return; 
      }

      // Step 2: Send email to users who selected this category
      const users = await User.find({category : categoryName }); 
      console.log(users);
      console.log("helloooooooo");
      if (users.length > 0) {
          const emailList = users.map(user => user.email);
           console.log(emailList);
           
          // Configure the email transport
          try {
            await sendEmail(newAlert, emailList); 
            console.log("email send ");
        } catch (err) {
            console.log("Error occurred in sending email:", err); 
        }
      }
      

      // Step 3: Store the new alert in the database
      const updatedCategory = await Category.findOneAndUpdate(
          { categoryName: categoryName }, 
          { $push: { alerts: newAlert } },
          { new: true, upsert: true, useFindAndModify: false } 
      );
    

      console.log('Alert stored successfully:', updatedCategory);
    
  } catch (error) {
      console.error('Error:', error);
  }
}


app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }else{
    console.log(req.user);
    const newAlert = {
      alertTitle: 'Critical Weatherhhh divvv  vAlert',
      date: new Date(),
      link: 'http://example.com/weather',
      description: 'Severe weather expected. Take necessary precautions.'
    };
    
    addAlertIfNotExists(newAlert, 'News');
    res.send('Welcome to your dashboard!');
  }
});

//  login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));


// Google OAuth route
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route after Google authentication
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));


// new alert route   (ispe POST request bhej ke data add karlo db me and mail bhi chala jayega )
app.post("/alert",()=>{
  let {newAlert}= req.body;
  if(newAlert) {
    let catagory=newAlert.catagory;
    addAlertIfNotExists(newAlert,catagory);
  }
  
})
app.listen(port, () => {
    console.log("server is live");
});


app.get("/",(req,res)=>{

    res.send("helloo ji kaise ho ");
})
// app.post("/email", (req, res) => {
//     let { userEmail, subject, text } = req.body;

//     sendEmail(userEmail, subject, text)
//         .then(() => {
//             res.send("MAIL SENT");
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send("Error sending email");
//         });
// });
