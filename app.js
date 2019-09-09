const mysql = require('mysql');
const faker = require('faker');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const ejsLint = require('ejs-lint');
const i18n = require('i18n');
const  cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwtEx = require('express-jwt');
const bcrypt = require('bcryptjs');
const Role =require('./helpers/role');
const authorize = require('./helpers/authorize')
const errorHandler = require('./helpers/error-handler');
const {check, validationResult} = require('express-validator')
const v = require('./helpers/validation')
var helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
var compression = require('compression');
require('dotenv').config()



const { getIndexPage,getHomePage, getOrderdHomePage} = require('./routes/index')
const {addStudentPage, addStudent, editStudent, editStudentPage, deleteStudent, viewStudent, searchStudentPage, searchStudents, deleteParent, deletePayment, deleteSalary} = require('./routes/student')
const {addParentPage, addParent, parentStudentPage, parentParentsPage, parentFees, viewHomeworkPage, viewHomework, viewParentTable} = require('./routes/parent')
const {addPayPage, addPayment} = require('./routes/fees')
const {financeMainPage, addExpense, addIncome, getAddIncome, getAddExpense, getSalaries, saveSalaries, monthFinance} = require('./routes/finances')
const {addTeachersPage, mainTeachers,addTeacher, editTeacherPage, editTeacher, deleteTeacher, teacherSalaries} = require('./routes/teachers')
const {busesPage, addBusPage, saveBus, editBusPage, editBus, deleteBus, Students2BusPage, addStudents2Bus,viewBus} = require('./routes/buses')
const {signIn,signInPage, register, registerParent, registerPage, registerParentPage,parentMainPage, checktoken, viewUsersPage, enableUser, deleteUser, signOut, changeRoleUser} = require('./routes/login')
const {classesPage, addClassPage, addClass, editClassPage, editClass, deleteClass, Students2ClassPage, addStudents2Class, viewClass, addTablePage, addTable, addPeriodsPage,savePeriods, viewTablePage, viewTable} = require('./routes/class')
const {addSubjectPage, addSubject, viewSubjectsPage, deleteSubject} = require('./routes/subject')
const {addHomeworkPage, addHomework, listHomeworkPage, findHomework} = require('./routes/homework')

const port = process.env.PORT;


const db = mysql.createConnection({
    db_dialect: process.env.DB_DIALECT,
    host      : process.env.DB_HOST,
    port : process.env.DB_PORT,
    database      : process.env.DB_NAME,
    user      : process.env.DB_USER,
    password  : process.env.DB_PASSWORD,
    dateStrings: true,
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

global.db = db;

//i18n configuration
i18n.configure({
    // setup some locales - other locales default to en silently
    locales:['en', 'ar'],
  
    // where to store json files - defaults to './locales' relative to modules directory
    directory: __dirname + '/locales',
    
    defaultLocale: 'en',
    
    // sets a custom cookie name to parse locale settings from  - defaults to NULL
    cookie: 'i18n',

    queryParameter: 'lang',
});

// configure middelware
app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.use(cookieParser(process.env.JWT_ENCRYPTION));
app.use(session({
    secret: process.env.JWT_ENCRYPTION ,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(i18n.init);
app.use(helmet());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(compression()); //Compress all routes

// process.on('uncaughtException', (err) => {
//     console.error('There was an uncaught error', err)
//     process.exit(1) //mandatory (as per the Node docs)
// })

//routes for the app
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//app.get('/', checktoken, authorize(Role.Admin), getHomePage);
app.get('/', checktoken, authorize(Role.Admin), getIndexPage);
app.get('/students/:order/:start', checktoken, authorize(Role.Admin), getOrderdHomePage);
app.get('/add', checktoken, addStudentPage);
app.get('/edit/:id', checktoken, editStudentPage)
app.get('/delete/:id', checktoken, deleteStudent)
app.get('/mainStudent/:id', checktoken, viewStudent)
app.get('/addparent/:id', checktoken, addParentPage)
app.get('/fees/:id', checktoken, addPayPage)
app.get('/mainFinance', checktoken, financeMainPage)
app.get('/finances/:month', checktoken, monthFinance)
app.get('/addIncome', checktoken, getAddIncome)
app.get('/addExpense', checktoken, getAddExpense)
app.get('/teachers', checktoken, mainTeachers)
app.get('/addTeacher', checktoken, addTeachersPage)
app.get('/editTeacher/:id', checktoken, editTeacherPage)
app.get('/delete-teacher/:id', checktoken, deleteTeacher)
app.get('/teachers/paySalaries', checktoken, getSalaries)
app.get('/salary-teacher/:id', checktoken, teacherSalaries)
app.get('/buses', checktoken, busesPage)
app.get('/addBus', checktoken, addBusPage)
app.get('/editBus/:id', checktoken, editBusPage)
app.get('/deleteBus/:id', checktoken, deleteBus)
app.get('/addSt2Bus/:id/:order/:start', checktoken, Students2BusPage)
app.get('/viewBus/:id', checktoken, viewBus)
app.get('/login', signInPage)
app.get('/register', registerPage)
app.get('/viewUsers', checktoken, viewUsersPage)
app.get('/registerParent', registerParentPage)
app.get('/signOut', checktoken, signOut)
app.get('/classes', checktoken, classesPage)
app.get('/addClass', checktoken, addClassPage)
app.get('/editClass/:id', checktoken, editClassPage)
app.get('/deleteClass/:id', checktoken, deleteClass)
app.get('/addSt2Class/:id/:order/:start', checktoken, Students2ClassPage)
app.get('/viewClass/:id',checktoken, viewClass)
app.get('/parent/main',checktoken, parentMainPage)
app.get('/parent/student/:id',checktoken, parentStudentPage)
app.get('/parent/parents/:id',checktoken, parentParentsPage)
app.get('/parent/fees/:id', checktoken, parentFees)
app.get('/addSubject', checktoken, addSubjectPage)
app.get('/viewSubjects', checktoken, viewSubjectsPage)
app.get('/deleteSubject/:id', checktoken, deleteSubject)
app.get('/parent/homework/:id',checktoken, viewHomeworkPage)
app.get('/parent/table/:id',checktoken, viewParentTable)
app.get('/searchStudents',checktoken, searchStudentPage)
app.get('/deleteUser/:id', checktoken,deleteUser)
app.get('/addTable', checktoken, addTablePage)
app.get('/addPeriods/:tname', checktoken, addPeriodsPage)
app.get('/viewTable', checktoken, viewTablePage)
app.get('/viewTable/:id', checktoken, viewTable)
app.get('/addHomework', checktoken, addHomeworkPage)
app.get('/homeworkList', checktoken, listHomeworkPage)
app.get('/deleteParent/:id', checktoken, deleteParent)
app.get('/deletePayment/:id', checktoken, deletePayment)
app.get('/deleteSalary/:id', checktoken, deleteSalary)

app.post('/students/:start', checktoken,getOrderdHomePage);
app.post('/add', checktoken, addStudent)
app.post('/edit/:id', checktoken, editStudent)
app.post('/addparent/:id', checktoken, addParent)
app.post('/fees/:id', checktoken, addPayment )
app.post('/addExpense', checktoken, addExpense)
app.post('/addIncome', checktoken, addIncome)
app.post('/addTeacher', checktoken, addTeacher)
app.post('/editTeacher/:id', checktoken, editTeacher)
app.post('/teachers/paySalaries', checktoken, saveSalaries)
app.post('/addBus', checktoken, saveBus)
app.post('/editBus/:id', checktoken, editBus)
app.post('/addSt2Bus/:id', addStudents2Bus)
app.post('/login', v.validateLogin, signIn)
app.post('/register', v.validateUser, register)
app.post('/registerParent', v.validateUser, registerParent)
app.post('/addClass', checktoken, addClass)
app.post('/editClass/:id', checktoken, editClass)
app.post('/addSt2Class/:id', checktoken, addStudents2Class)
app.post('/addSubject', checktoken, addSubject)
app.post('/addHomework', checktoken, addHomework)
app.post('/parent/homework/:id',checktoken, viewHomework)
app.post('/searchStudents', checktoken, searchStudents)
app.post('/enableUser/:id', checktoken, enableUser)
app.post('/changeRoleUser/:id', checktoken, changeRoleUser)
app.post('/addTable', checktoken, addTable)
app.post('/addPeriods/:tname', checktoken, addPeriodsPage)
app.post('/savePeriods', checktoken, savePeriods)
app.post('/homeworkList', checktoken, findHomework )

// //404
// app.use(function(req, res, next) {
//     req.flash('error_msg', '404: Page was not Found');
//     return res.redirect('/')
//     //return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
//   });
  
//   // 500 - Any server error
// app.use(function(err, req, res, next) {
//     return res.status(500).send({ error: err });
//   });

// global error handler
app.use(errorHandler);

//set langauge routes
app.get("/en", (req, res) => {
    res.cookie('i18n', 'en');
    res.redirect('back');
})

app.get("/ar", (req, res) => {
    res.cookie('i18n', 'ar');
    res.redirect('back');
})

app.listen(port, function() {
    console.log(`App listening on port ${port}` );
});