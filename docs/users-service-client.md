# Users Service Client

## Sign Up

### Via Wego Sign up form

```
const credentials = {
  "user": {
    "email": "inigo+23@wego.com",
    "password": "password",
    "password_confirmation": "password",
    "newsletter_opt_in": "0",
    "geo_country_code": "PH",
    "geo_city": "",
    "time_zone": "",
    "locale": "id",
     "cctld": "www.wego.com.ph",
    "source": "desktop_web"
  },
  "device": {
   "device_type": "desktop"
  }
}

const client = new WegoSdk.UsersServiceClient();
client.signIn(credentials).then(response => {
  // sample response:
  // {
  //   "id": 2609996,
  //   "email": "inigo+23@wego.com",
  //   "token": "kJJzLd2wSQwBupvAtqow",
  //   "needs_to_set_password": false,
  //   "sign_in_count": 0
  // }
  return response;
})
```

### Via Smartlock (facebook/google auth)

```
const credentials = {
  "user": {
    "newsletter_opt_in": "0",
    "geo_country_code": "ID",
    "geo_city": "",
    "time_zone": "",
    "locale": "id",
    "cctld": "www.wego.co.id",
    "source": "desktop_web"
  },
  "device": {
    "device_type": "ios_app",
  },
  "provider": "facebook",
  "token": "EAAJimrxzwzABAKGZAAuzPe3UOtUuaqxbZB1bGFh38gXX3pj03iY6vQZCYNujWEiHCacvmCUVGZBYuJcZAmpKdrcGRLjixF6kPdVwj6GXzZCBpdXYUp9hUwhYSrYtBkBgtCn73i35IkgbigwS5ZBY4aI60j1SOomdZCCmSVDBe6MwhfRliBDKKHRdCmTrmHPYESGjxZChilMDpTwZDZD"
}

const client = new WegoSdk.UsersServiceClient();
client.signIn(credentials).then(response => {
  // sample response:
  // {
  //   "id": 2609996,
  //   "email": "inigo+23@wego.com",
  //   "token": "kJJzLd2wSQwBupvAtqow",
  //   "needs_to_set_password": false,
  //   "sign_in_count": 0
  // }
  return response;
})
```

## Authenticate

There are three use-cases of acquiring authentication

1. Wego App/Client acquiring access token to be use for calling Wego API

```
const credentials = {
  client_id: "c9b8b07eaa081c88dd2354d63cef6a7",
  grant_type: "password",
  uid: "371dd0dd119a450b2a0689ba1910b3ae",
  timestamp: 1503473978
}

const client = new WegoSdk.UsersServiceClient();
client.signIn(credentials).then(response => {
  // sample response:
  // {
  //   "access_token": "eyJ0eXAiOi",
  //   "token_type": "bearer",
  //   "expires_in": 43199,
  //   "scope": "affiliate",
  //   "created_at": 1513841769
  // }
  return response;
})
```

_Ask wego devs how to get UID._

2. Wego user signing in to access user-specific data

```
const credentials = {
  "client_id": "uhab32169d482105c1kjabf660",
  "grant_type": "password",
  "scope": "user",
  "email": "hobbes@wego.com",
  "password": "testing897"
 }

const client = new WegoSdk.UsersServiceClient();
client.signIn(credentials).then(response => {
  // sample response:
  // {
  //   "access_token": "eyJ0eXAiOiJKV1QL0",
  //   "token_type": "bearer",
  //   "expires_in": 43199,
  //   "refresh_token": "1980c6af58f3573d1c91d72131d6b53f1a35bde6ed6050cdee6b2ea8030d17f3",
  //   "scope": "user",
  //   "created_at": 1513841879,
  //   "authentication_token": "QUCHaVpdgTX2qXQe3D__"
  // }
  return response;
```

_No need to send `client_secret`, as this should not be exposed in the client_

3. Affiliate acquiring access token to be use for calling Wego APIs

Only advisable for back end usage as this approach requires `client_secret` - eg node.js

```
const credentials = {
  "client_id": "84b32169d382105c18df660",
  "client_secret": "31cf529fd945e7c5905be",
  "grant_type": "client_credentials",
  "scope": "affiliate"
 }

const client = new WegoSdk.UsersServiceClient();
client.signIn(credentials).then(response => {
  // sample response:
  // {
  //   "access_token": "eyJ0eXAiOi",
  //   "token_type": "bearer",
  //   "expires_in": 43199,
  //   "scope": "affiliate",
  //   "created_at": 1513841769
  // }
  return response;
```
