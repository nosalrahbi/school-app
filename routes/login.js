const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')


let cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies.token;
    }
    return token;
};

let checktoken = (req, res, next) => {
    let token = req.cookies.token
    if (token) {
        jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
          if (err) {
            req.flash('error_msg', 'User verification fialed / فشل التحقق من صلاحية المستخدم ');
            return res.redirect('/login');
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        req.flash('error_msg', 'Your session have expired. Please log in again / فترة الصلاحية انتهت. يرجى إعادة الدخول');
        res.redirect('/login')
      }
}

const signIn = (req, res) => {
    // Get credentials from JSON body
    const username = req.body.username;
    const password = req.body.password;
    //let visit = new Date;
    let q = "SELECT * FROM users WHERE user_name = ?"
    //let q2 = `UPDATE users SET lastVisit = ? WHERE user_name = ?;`
    
    if (!username || !password) {
      // return 401 error is username or password doesn't exist, or if password does
      // not match the password in our records
      return res.status(401).end()
    }
    db.query(q, username, (err, result) => {
        if (err || result.length < 1 || result[0].Enabled!=="Yes") {
          req.flash('error_msg', 'Username does not exist / أسم المستخدم غير مسجل');
          req.flash('error_msg', 'Or username is not enabled / أو اسم المستخدم غير مفعل');
          return res.redirect('/login')
        }
        let user = result[0]
        bcrypt.compare(password, user.user_password, function(err, result2) {
        if (err || result2 == false) {
          req.flash('error_msg', 'Password Incorrect / كلمة المرور غير صحيحة');
          return res.redirect('/login')
        }
        // let usertime = [[visit],[username]]
        // db.query(q2, usertime, (err1, result1)=> {
        //   if (err1) {
        //     res.status(500).send(err1)
        //   }
        // })
        // Create a new token with the username in the payload
        // and which expires 300 seconds after issue
        const token = jwt.sign({user: user.user_name, role: user.role, stid: user.st_id}, process.env.JWT_ENCRYPTION, {
            algorithm: 'HS256',
            expiresIn: parseInt(process.env.JWT_EXPIRATION)
        })        
        // set the cookie as the token string, with a similar max age as the token
        // here, the max age is in milliseconds, so we multiply by 1000
        res.cookie('token', token)
        res.cookie('token', token, { maxAge: parseInt(process.env.JWT_EXPIRATION) *1000 })
        if (user.role==='Parent') {
          res.render('parent/main.ejs', {
            title: 'Welcome to  school',
            message: '',
            user: user.user_name,
            stid: user.st_id
          })
        } else {
         res.redirect('/') 
        }    
    });        
})
} 

const signInPage = (req, res) => {
    res.render('login.ejs', {
        title: 'Login',
        user: ''
    });
};

const signOut = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(500).end();
  }
    res.clearCookie('token', 'connect.sid', {path: '/'})
    res.redirect('/login')
  };

const register = (req, res) => {
    //console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    let hash = bcrypt.hashSync(password, 8);
    let email = req.body.email;
    let role = req.body.role;
    let enabled = 'No';

    const errors = validationResult(req);

    if (!errors.isEmpty()){

      return res.render('register.ejs', {
        title: 'Register User',
        user: '',
        errors: errors.errors
      })
    }
    let user = [[username],[email],[hash], [role], [enabled]]
    let q = "INSERT INTO users (user_name, email, user_password, role, enabled) VALUES (?); "

    db.query(q,[user], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      req.flash('success_msg', 'User registered succesfully. Pending activation by Administrator')
      res.redirect('/login')
    })
}

const registerParent = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let hash = bcrypt.hashSync(password, 8);
  let email = req.body.email;
  let st_id = req.body.st_id;
  let role = req.body.role;
  let enabled = 'No';
  let user = [[username],[email],[hash],[st_id],[role],[enabled]]
  let q = "INSERT INTO users (user_name, email, user_password,st_id, role, enabled) VALUES (?); "

  db.query(q,[user], (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }
    req.flash('success_msg', 'Parent registered succesfully. Pending activation by Administrator')
    res.redirect('/login')
  })
}


const registerPage = (req, res) => {
    res.render('register.ejs', {
      title: 'Register User',
      user: '',
      errors: ''
    })
}

const registerParentPage = (req, res) => {
  res.render('register-parent.ejs', {
    title: 'Register Parent',
    user: '',
    errors: ''
  })
}

const parentMainPage = (req,res) => {
  res.render('parent/main.ejs', {
    title: 'Parents View',
    user: req.decoded.user,
    stid: req.decoded.stid
})
}

const viewUsersPage = (req, res) => {
  let q = "SELECT * FROM users;"
  db.query(q,(err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    //console.log(result)
    res.render('users-main.ejs',{
      title: 'Users View',
      message:'',
      user: req.decoded.user,
      users: result
    })
  })
}

const enableUser = (req, res) => {
  //console.log(req.body)
  let userId = req.params.id;
  let en= req.body.en; 
  let q = "UPDATE users SET Enabled=? WHERE user_id= ?;"
  if (en === "Yes") {
    Enabled = "No";
  } else {
    Enabled = "Yes"
  }
  let user =[[Enabled],[userId]]
  db.query(q, user, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/viewUsers')
  })
}

const deleteUser = (req, res) => {
  let userId = req.params.id;
  let q = "DELETE FROM users WHERE user_id =?;";

  db.query(q,userId,(err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    req.flash('success_msg', 'User deleted successfully')
    res.redirect('/viewUsers')
  })
}

const changeRoleUser = (req, res) => {
  let userId = req.params.id;
  let newRole = req.body.newRole;
  let q = "UPDATE users SET role = ? WHERE user_id = ?;";
  let user = [[newRole],[userId]]
  //console.log(user)

  db.query(q, user, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    req.flash('success_msg', 'User updated succesfully')
    res.redirect('/viewUsers')
  })
}

  module.exports ={
      signIn,
      signInPage,
      register,
      registerParent,
      registerPage,
      registerParentPage,
      parentMainPage,
      checktoken,
      cookieExtractor, 
      signOut,
      viewUsersPage,
      enableUser,
      deleteUser,
      changeRoleUser
  }