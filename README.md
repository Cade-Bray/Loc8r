# Loc8r

This web application is a fork off of the Loc8r example in the getting-mean-2 guide detailed in 'Getting MEAN...' second edition. My version has had a few adjustments so far.
The first major adjustment compared to the example provided is the use of mapping technology. In Getting MEAN they use the Google maps API but I've chosen to go with a lower
maintaince opensource source solution with OpenLayers and OpenStreetMap. This give peace of mind of protecting against API thiefs or potential charges if I deploy this example.
I'm sure there will be more differences to come as I progress through the book.

# Getting started
1) Clone this repository.
2) Open terminal to repository root.
3) Run `npm install`
4) Run `npm build`
5) Run `nodemon`
6) Navigate to http://localhost:3000 by default

When you're restarting the program you need to only run the build and nodemon.
