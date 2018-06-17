const get = (rq, res) => {
  res.send('get user')
}

const create = (rq, res) => {
  res.send('create user')
}

const login = (rq, res) => {
  res.send('login user')
}

const logout = (rq, res) => {
  res.send('logout user')
}

export {get, create, login, logout}
