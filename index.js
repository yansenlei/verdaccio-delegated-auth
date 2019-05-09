const axios = require('axios')

module.exports = DelegatedAuthentication

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
    let params = {}
    let _user = this._config.email ? `${ user }@${ this._config.email }` : user
    params[this._config.user_key || 'username'] = _user
    params[this._config.pwd_key || 'password'] = password

    self._logger.warn('Authentication request: ', _user)
    axios.post(self._config.url, params)
        .then(function (res) {
            if (res.data.error) { // json-rpc error
                self._logger.warn('Authentication failed. ', res.data.error.code ? `code: ${ res.data.error.code }` : 'not error code')
                return cb(null, false)
            } else { // success: supports API style for RESTful and JSON-rpc
                self._logger.warn('Authentication succeeded')
                return cb(null, [user])
            }
        })
        .catch(function (error) {
            self._logger.warn('Authentication failed: ', _user)
            return cb(null, false)
        })

}
