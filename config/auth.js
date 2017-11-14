module.exports = {
    
        'facebookAuth': {
            'clientID': '1995258940754978', // your App ID
            'clientSecret': 'e2416cc847455197d89b57ae6dd94685', // your App Secret
            'callbackURL': 'http://localhost:8080/auth/facebook/callback',
            'profileFields': ["email", "displayName", "name", "photos"]
        },
        'evernoteAuth': {
            'consumerKey': 'hagil317', // your App ID
            'consumerSecret': '0e571fed46b8f75b', // your App Secret
            'callbackURL': 'http://localhost:8080/auth/evernote/callback',
            'profileFields': ["email", "displayName", "name", "photos"]
        }
    };