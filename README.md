## What's this?

This is a collection of work from one a website I developed

## Function methodology
    
All input from the user is bad and malfored. Hence any input from the user is filtered and checked on the client side first. Then verfied on the server before any actions are done. Similarly, the DB functions have catches for malformed or invalid data. 


## App structure

Structured against a normal express.js application.


## Testing

There is a folder with a large set of tests
 
- First set of test are done against the running server
- Second set of tests are done against the router/index.js file direclty. No server needed
- Third set of tests are done against the Database
- Lastly a set of tests for any socket functions that may exist for a specific route/page

## Browser compatibility

I am using twitter bootstrap package as a basis of the site.






