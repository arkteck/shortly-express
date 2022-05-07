const parseCookies = (req, res, next) => {
  if (req.get('Cookie') === undefined) {
    req.cookies = {};
  } else {
    req.cookies = {};
    let cookies = req.get('Cookie').split('; ');
    for (let i = 0; i < cookies.length; i++) {
      let cookieString = cookies[i].split('=');
      req.cookies[cookieString[0]] = cookieString[1];
    }
  }
  next();
};

module.exports = parseCookies;
