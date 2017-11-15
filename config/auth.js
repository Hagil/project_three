module.exports = {
    
        'facebookAuth': {
            'clientID': '1995258940754978', // your App ID
            'clientSecret': 'e2416cc847455197d89b57ae6dd94685', // your App Secret
            'callbackURL': 'http://localhost:8080/auth/facebook/callback',
            'profileFields': ["email", "displayName", "name", "photos"]
        },

        'twitterAuth': {
            'consumerKey': 'VnVRhgAQs7kyR4nHKIYYXgoWy',
            'consumerSecret': 'zE7nJcRYzYRL2pB1OGfK2risFNC0NIGe1mWxGymFOEXdQYBcnI',
            'callbackURL': 'http://127.0.0.1:8080/auth/twitter/callback'
        },
    
        'googleAuth': {
            'clientID': '818065252648-niktdkf2aekmhk83k4g13u2eb7k08ao3.apps.googleusercontent.com',
            'clientSecret': 'qrLL93eYMF3kY6GKZdZ9RtgP',
            'callbackURL': 'http://127.0.0.1:8080/auth/google/callback'
        },
        'instagramAuth': {
            'clientID': 'aeafd2d926854933a711830180652d52',
            'clientSecret': 'af6e6bd35bfc4660808600b8d1a802e6',
            'callbackURL': 'http://127.0.0.1:8080/auth/instagram/callback'
        }
    };