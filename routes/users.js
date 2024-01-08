// var express = require('express');
const express = require('express');
var router = express.Router();

const axios = require('axios');
const app = express();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '1020602620632-oph927qriokf4v9i9vogq3r5sh18beim.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_LOGIN_REDIRECT_URI = 'http://localhost:3000/login/redirect';
const GOOGLE_SIGNUP_REDIRECT_URI = 'http://localhost:3000/signup/redirect';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

/*
app.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'    
    res.redirect(url);
});

app.get('/signup', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${GOOGLE_SIGNUP_REDIRECT_URI}`
    url += '&response_type=code'
    url += '&scope=email profile'    
    res.redirect(url);
});


app.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('ok');
});

app.get('/signup/redirect', async (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);

    const resp = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
        grant_type: 'authorization_code',
    });

    const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${resp.data.access_token}`,
        },
    });
    res.json(resp2.data);
});

// app.listen(3000, () => {
//     console.log('server is running at 3000');
// });

*/


// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
//     callbackURL: 'https://www.example.com/oauth2/redirect/google',
//     scope: [ 'profile' ],
//     state: true
//   },
// }))


module.exports = router;
