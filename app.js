const express = require('express'),
      app = express(),
      apikeys = require('./apikeys');

const googlekeys = apikeys.googlekeys,
      foursquarekeys = apikeys.foursquarekeys,
      yelpkeys = apikeys.yelpkeys;


//nearby business node apis
const GooglePlaces = require('node-googleplaces');
const FourSquare = require('foursquare-venues');
const Yelp = require('yelp');

//initializations for each api with Keys
const places = new GooglePlaces(googlekeys.apiKey);
const foursquare = new FourSquare(foursquarekeys.clientId,
                                  foursquarekeys.clientSecret);
const yelp = new Yelp({
                          consumer_key: yelpkeys.consumer_key,
                          consumer_secret: yelpkeys.consumer_secret,
                          token: yelpkeys.token,
                          token_secret: yelpkeys.token_secret
                      });


//google place search route
app.get('/googlesearch', ( req, res) => {
    console.log('init google place search with :', req);
    const searchTerm = req.query.term,
          searchLL = req.query.latitude + "," + req.query.longitude,
          query = {
              location: searchLL,
              radius: 1000,
              keyword: searchTerm,
              rankby: 'distance'
          };
    //search via callback method (not used though)
    places.nearbySearch(query, (err, response) => {
        console.log('search results with query: ',query);
        console.log(response.body);
    });

    //promise method ( used )
    places.nearbySearch(query).then((response) => {
        console.log('search results using promise method with query :', query);
        console.log(response.body);
        res.send(response.body);
    });
});


//foursquare place search route
app.get('/foursquaresearch', (req, res) => {
    const searchTerm = req.query.term,
        searchLL = req.query.latitude + "," + req.query.longitude,
        query = {
            ll: searchLL,
            query: searchTerm,
            limit: 50,
            radius: 1000,
            sortByDistance: 1
        };

    //search via callback method
    foursquare.exploreVenues(query, (err, response) => {
        if(err)
        {
            res.send(err);
        }

        res.send(response);
    });

});


//yelp place search route
app.get('/yelpsearch', (req, res) => {
    const searchTerm = req.query.term,
          searchLL = req.query.latitude + "," + req.query.longitude,
          query = {
              term: searchTerm,
              limit: 20,
              radius_filter: 1000,
              ll: searchLL,
              sort: 1
          };

    yelp.search(query, (err, response) => {
          if(err)
          {
              res.send(err);
          }

          res.send(response);
    });

});


//listen to port
app.listen(6969, function() {
    console.log("Node/Express server for TipMe started at port 6969");
});
