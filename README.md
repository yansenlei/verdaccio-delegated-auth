# verdaccio-delegated-auth
verdaccio(sinopia) authentication plugin that delegates authentication to another HTTP URL, Support RESTful and JSON-RPC

## Installation
```bash
$ npm install verdaccio-delegated-auth
```

## Config
Add to your `config.yaml`:
```yaml
auth:
  # htpasswd:
  #   file: ./htpasswd
  delegated-auth:
    url: https://your-auth-api/
    user_key: name # username field, default: username
    pwd_key: password # password field, default: password
```