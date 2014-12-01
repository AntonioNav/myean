MyEAN: MySQL, ExpressJS, AngularJS, NodeJS
==========================================

A boilerplate for applications based in MySQL, ExpressJS, AngularJS, NodeJS with PassportJS authentication.

This is my first approach to a NodeJS + AngularJS application. I need to migrate a PHP+MySQL web, but I don't want to migrate to MongoDB.

 
Code structure
--------------

*    src
     This is main projet. Download and run _npm install_ to install all modules and dependencies. Then run _node_ or _nodemon_ to start server. You have to configure database in _src/server/_shared/config.js

*    src/client
     An angular web client. I include bootstrap css, angular and ngtable libs. There is only views for login and list/manage users.

*    src/server
     A nodejs-expressjs REST API server. Implements the API access for query MySQL database. Authentication is implemented with PassportJS. 
		 
*    database
     In this folder you have a mysql script to load the database schema and a few data (an admin user, with 'admin' pass).
 
ToDo
----

There is many to do right now :-D

- Implement test, for server and for client.
- Add centraliced error management in server.
- Add error control in client.
- Verify roles in server for add, update or delete...
- ~~Add i18n translations (review angular-translate)~~.

    