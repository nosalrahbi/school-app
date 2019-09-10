const mysql = require('mysql');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const i18n = require('i18n');
const  cookieParser = require('cookie-parser');
//const jwt = require('jsonwebtoken');
//const jwtEx = require('express-jwt');
//const bcrypt = require('bcryptjs');
const Role =require('./helpers/role');
const authorize = require('./helpers/authorize')
const errorHandler = require('./helpers/error-handler');
//const {check, validationResult} = require('express-validator')
const v = require('./helpers/validation')
var helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
var compression = require('compression');
require('dotenv').config()



const { getIndexPage,getHomePage, getOrderdHomePage} = require('./routes/index')
const {addStudentPage, addStudent, editStudent, editStudentPage, deleteStudent, viewStudent, searchStudentPage, searchStudents, deleteParent, deletePayment, deleteSalary, viewFess} = require('./routes/student')
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
app.get('/', checktoken, authorize([Role.Admin, Role.User]), getIndexPage);
app.get('/students/:order/:start', checktoken, authorize([Role.Admin, Role.User]), getOrderdHomePage);
app.get('/add', checktoken, authorize([Role.Admin, Role.User]), addStudentPage);
app.get('/edit/:id', checktoken, authorize([Role.Admin, Role.User]),editStudentPage)
app.get('/delete/:id', checktoken, authorize(Role.Admin),deleteStudent)
app.get('/mainStudent/:id', checktoken, authorize([Role.Admin, Role.User]), viewStudent)
app.get('/viewFees/:id', checktoken, authorize(Role.Admin), viewFess)
app.get('/addparent/:id', checktoken, authorize([Role.Admin, Role.User]), addParentPage)
app.get('/fees/:id', checktoken, authorize([Role.Admin, Role.User]), addPayPage)
app.get('/mainFinance', checktoken, authorize(Role.Admin), financeMainPage)
app.get('/finances/:month', checktoken, authorize(Role.Admin), monthFinance)
app.get('/addIncome', checktoken, authorize([Role.Admin, Role.User]), getAddIncome)
app.get('/addExpense', checktoken, authorize([Role.Admin, Role.User]), getAddExpense)
app.get('/teachers', checktoken, authorize(Role.Admin), mainTeachers)
app.get('/addTeacher', checktoken, authorize([Role.Admin, Role.User]), addTeachersPage)
app.get('/editTeacher/:id', checktoken, authorize(Role.Admin), editTeacherPage)
app.get('/delete-teacher/:id', checktoken, authorize(Role.Admin), deleteTeacher)
app.get('/teachers/paySalaries', checktoken, authorize(Role.Admin), getSalaries)
app.get('/salary-teacher/:id', checktoken, authorize(Role.Admin), teacherSalaries)
app.get('/buses', checktoken, authorize([Role.Admin, Role.User]), busesPage)
app.get('/addBus', checktoken, authorize([Role.Admin, Role.User]), addBusPage)
app.get('/editBus/:id', checktoken, authorize([Role.Admin, Role.User]), editBusPage)
app.get('/deleteBus/:id', checktoken, authorize(Role.Admin), deleteBus)
app.get('/addSt2Bus/:id/:order/:start', checktoken, authorize([Role.Admin, Role.User]), Students2BusPage)
app.get('/viewBus/:id', checktoken, authorize([Role.Admin, Role.User]), viewBus)
app.get('/login', signInPage)
app.get('/register', registerPage)
app.get('/viewUsers', checktoken, authorize([Role.Admin, Role.User]), viewUsersPage)
app.get('/registerParent', registerParentPage)
app.get('/signOut', checktoken, signOut)
app.get('/classes', checktoken, authorize([Role.Admin, Role.User]), classesPage)
app.get('/addClass', checktoken, authorize([Role.Admin, Role.User]), addClassPage)
app.get('/editClass/:id', checktoken, authorize([Role.Admin, Role.User]), editClassPage)
app.get('/deleteClass/:id', checktoken, authorize(Role.Admin), deleteClass)
app.get('/addSt2Class/:id/:order/:start', checktoken, authorize([Role.Admin, Role.User]), Students2ClassPage)
app.get('/viewClass/:id',checktoken, authorize([Role.Admin, Role.User]), viewClass)
app.get('/parent/main',checktoken, authorize([Role.Admin, Role.Parent]), parentMainPage)
app.get('/parent/student/:id',checktoken, authorize([Role.Admin, Role.Parent]),parentStudentPage)
app.get('/parent/parents/:id',checktoken, authorize([Role.Admin, Role.Parent]), parentParentsPage)
app.get('/parent/fees/:id', checktoken, authorize([Role.Admin, Role.Parent]), parentFees)
app.get('/addSubject', checktoken, authorize([Role.Admin, Role.User]), addSubjectPage)
app.get('/viewSubjects', checktoken, authorize([Role.Admin, Role.User]), viewSubjectsPage)
app.get('/deleteSubject/:id', checktoken, authorize(Role.Admin,), deleteSubject)
app.get('/parent/homework/:id',checktoken, authorize([Role.Admin, Role.Parent]), viewHomeworkPage)
app.get('/parent/table/:id',checktoken, authorize(Role.Admin), viewParentTable)
app.get('/searchStudents',checktoken, authorize([Role.Admin, Role.User]), searchStudentPage)
app.get('/deleteUser/:id', checktoken,authorize(Role.Admin), deleteUser)
app.get('/addTable', checktoken, authorize([Role.Admin, Role.User]), addTablePage)
app.get('/addPeriods/:tname', checktoken, authorize([Role.Admin, Role.User]), addPeriodsPage)
app.get('/viewTable', checktoken, authorize([Role.Admin, Role.User]), viewTablePage)
app.get('/viewTable/:id', checktoken, authorize([Role.Admin, Role.User]), viewTable)
app.get('/addHomework', checktoken, authorize([Role.Admin, Role.User]), addHomeworkPage)
app.get('/homeworkList', checktoken, authorize([Role.Admin, Role.User]), listHomeworkPage)
app.get('/deleteParent/:id', checktoken, authorize(Role.Admin), deleteParent)
app.get('/deletePayment/:id', checktoken, authorize(Role.Admin),deletePayment)
app.get('/deleteSalary/:id', checktoken, authorize(Role.Admin),deleteSalary)

app.post('/students/:start', checktoken, authorize([Role.Admin, Role.User]),getOrderdHomePage);
app.post('/add', checktoken, authorize([Role.Admin, Role.User]), addStudent)
app.post('/edit/:id', checktoken, authorize([Role.Admin, Role.User]), editStudent)
app.post('/addparent/:id', checktoken, authorize([Role.Admin, Role.User]), addParent)
app.post('/fees/:id', checktoken, authorize([Role.Admin, Role.User]), addPayment )
app.post('/addExpense', checktoken, authorize([Role.Admin, Role.User]), addExpense)
app.post('/addIncome', checktoken, authorize([Role.Admin, Role.User]), addIncome)
app.post('/addTeacher', checktoken, authorize([Role.Admin, Role.User]), addTeacher)
app.post('/editTeacher/:id', checktoken, authorize(Role.Admin), editTeacher)
app.post('/teachers/paySalaries', checktoken, authorize(Role.Admin), saveSalaries)
app.post('/addBus', checktoken, authorize([Role.Admin, Role.User]), saveBus)
app.post('/editBus/:id', checktoken, authorize([Role.Admin, Role.User]), editBus)
app.post('/addSt2Bus/:id', authorize([Role.Admin, Role.User]), addStudents2Bus)
app.post('/login', v.validateLogin, signIn)
app.post('/register', v.validateUser, register)
app.post('/registerParent', v.validateUser, registerParent)
app.post('/addClass', checktoken, authorize([Role.Admin, Role.User]), addClass)
app.post('/editClass/:id', checktoken, authorize([Role.Admin, Role.User]), editClass)
app.post('/addSt2Class/:id', checktoken, authorize([Role.Admin, Role.User]), addStudents2Class)
app.post('/addSubject', checktoken, authorize([Role.Admin, Role.User]), addSubject)
app.post('/addHomework', checktoken, authorize([Role.Admin, Role.User]), addHomework)
app.post('/parent/homework/:id',checktoken, authorize([Role.Admin, Role.Parent]),viewHomework)
app.post('/searchStudents', checktoken, authorize([Role.Admin, Role.User]), searchStudents)
app.post('/enableUser/:id', checktoken, authorize(Role.Admin), enableUser)
app.post('/changeRoleUser/:id', checktoken, authorize(Role.Admin), changeRoleUser)
app.post('/addTable', checktoken, authorize([Role.Admin, Role.User]),addTable)
app.post('/addPeriods/:tname', checktoken, authorize([Role.Admin, Role.User]), addPeriodsPage)
app.post('/savePeriods', checktoken, authorize([Role.Admin, Role.User]), savePeriods)
app.post('/homeworkList', checktoken, authorize([Role.Admin, Role.User]), findHomework )

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