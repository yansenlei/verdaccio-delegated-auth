const axios = require('axios')

module.exports = DelegatedAuthentication

const DEFAULT_CACHE = 30
let ch = {}

function DelegatedAuthentication(config, stuff) {
  var self = Object.create(DelegatedAuthentication.prototype)

  // config for this module
  self._config = config
  self._logger = stuff.logger
  self._logger.warn('Auth plugin configuration:\n', config)

  var url = self._config.url
  if (!url) throw new Error('should specify "url" in config')

  return self
}

DelegatedAuthentication.prototype.authenticate = function (user, password, cb) {
  let self = this
  let _user = this._config.email ? `${user}@${this._config.email}` : user
  if(ch[user] && ch[user]['password'] === password && ch[user]['date'] > new Date().getTime()) {
    return cb(null, [user])
  } else {
    let params = {}
    params[this._config.user_key || 'username'] = _user
    params[this._config.pwd_key || 'password'] = password
    self._logger.warn('Authentication request: ', _user)
    axios.post(self._config.url, params)
    .then(function (res) {
      if(res.data.error) { // json-rpc error
        self._logger.warn('Authentication failed. ', res.data.error.code ?  `code: ${res.data.error.code}` : 'not error code')
        return cb(null, false)
      } else { // success: supports API style for RESTful and JSON-rpc
        self._logger.warn('Authentication succeeded')
        ch[user] = {
          password: password,
          date: new Date().getTime() + 1000 * (self._config.cache || DEFAULT_CACHE)
        }
        return cb(null, [user])
      }
    })
    .catch(function (error) {
      self._logger.warn('Authentication failed: ', _user)
      return cb(null, false)
    });
  }
}
