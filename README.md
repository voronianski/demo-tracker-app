demo-tracker-app
================

Time tracker app demo is here - http://trakkker-app.jit.su/

It use ``angular.js`` on client side and ``node.js (express)`` as back-end api for ``CouchDB`` data.

Currently there is no registration module, so check demo with default user:

```bash
login: guest
password: xxx
```

To run app locally you need to setup your db in **settings.js** file (currently it works with CouchDB):

```javascript
couchdb {
  name: 'some name',
  url: 'some url',
  port: 'port on which it runs',
  username: 'db user',
  password: 'db pass'
}

