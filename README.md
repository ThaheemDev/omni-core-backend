### Account management API

##### Accounts
API Calls:
- GET /api/accounts
- POST /api/accounts = new account
- PUT /api/accounts = update account
- DELETE /api/accounts = delete account

Account object: 
```
{
    name: '',
    email: '',
    websites: [],
    status: <ACTIVE, BLOCKED>,
    role: '',
    password: 'BCRYPT SALTED 10 rounds'
}
```

##### Authentication
API Calls:
- POST /login
- POST /logout (or GET logout maybe)
- POST /register (can be done later - we can do this manually)

##### Website
API Calls:
- GET /api/websites
- POST /api/websites = new website
- PUT /api/websites = update website
- DELETE /api/websites = delete website

For POST and PUT and DELETE, you will call **the infrastructure service**, to update the infrastructure.

Website object: 
```
{
    name: '',
    status: '',
    size: <SMALL, MEDIUM, LARGE, XLARGE>,
    domainname: '',
}
```

Dependencies:
- Database -> MySQL
