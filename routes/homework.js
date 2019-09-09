module.exports= {
    addHomeworkPage: (req, res) => {
        let q1 = "SELECT DISTINCT * FROM subjects;"
        let q2 = "SELECT DISTINCT * FROM classes;"

        db.query(q1, (err, result1)=> {
            if (err) {
                req.flash('error_msg', 'Error loading subjects');
                return res.redirect('back');
            }
            db.query(q2, (err, result2) => {
                if (err) {
                    req.flash('error_msg', 'Error loading classes');
                    return res.redirect('back');
                }
                res.render('add-homework.ejs', {
                title: 'Add Homework',
                message:'',
                user: '',
                subjects: result1,
                classes: result2
                })
            })
        })
        
    },
    addHomework: (req, res) => {
        let subject_id= req.body.subject_id;
        let class_id= req.body.class_id;
        let homework = req.body.homework;
        let task_date= req.body.task_date;
        let work= [[subject_id],[class_id],[homework],[task_date]]
        let q = "INSERT INTO homeworks(subject_id, class_id, homework, task_date) VALUES (?);"

        db.query(q, [work], (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error saving homework');
                return res.redirect('back');
            }
            req.flash('success_msg', 'homework added successfully');
            res.redirect('/addHomework')
        })
    }, 
    listHomeworkPage: (req, res) => {
        //let q = "select h.id, s.subject_ename, c.class_name, h.task_date from homeworks h left join subjects s on h.subject_id = s.subject_id left join classes c on h.class_id = c.class_id order by h.task_date, h.class_id, s.subject_id;";
        let qclas = "SELECT DISTINCT h.class_id, c.class_name FROM homeworks h LEFT JOIN classes c on h.class_id = c.class_id ORDER BY h.class_id;"
        let qdate = "SELECT DISTINCT task_date FROM homeworks ORDER BY task_date;"
        db.query(qclas, (err, clases) => {
            if (err) {
                req.flash('error_msg', 'Error loading classes');
                return res.redirect('back'); 
            }
            db.query(qdate, (err2, h_dates) => {
                if (err2) {
                    req.flash('error_msg', 'Error fetching dates');
                    return res.redirect('back');
                }
                res.render('homework-list.ejs', {
                    title: 'Welcome to  school | Add Homework',
                    message:'',
                    user: '',
                    clases: clases,
                    h_dates: h_dates
                })   
            })  
        })
    }, 
    findHomework: (req, res) => {
        let class_id = req.body.class_id[0] ;
        let task_date = req.body.task_date;
        //console.log(req.body)
        let qClass = "SELECT DISTINCT homeworks.subject_id, subjects.subject_ename FROM homeworks left join Subjects ON homeworks.subject_id=subjects.subject_id WHERE class_id= ? AND task_date= ? ORDER BY subject_id;";
        let q = "SELECT * FROM homeworks left join subjects ON homeworks.subject_id=subjects.subject_id WHERE homeworks.class_id= ? AND homeworks.task_date= ? ORDER BY homeworks.subject_id;";
        let question = [class_id, task_date]
        //console.log(question)
        db.query(q, question, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading homeworks');
                return res.redirect('back');
            }
            db.query(qClass, question, (err1, resultClass) => {
                if (err1) {
                    req.flash('error_msg', 'Error loading homeworks');
                    return res.redirect('back');
                }
                if (result && result.length > 0) {
                 res.render('parent/view-homework.ejs', {
                    title: 'View Homework',
                    class_id: result[0].class,
                    resultClass: resultClass,
                    message: ''
                    ,user: req.decoded.user 
                    ,stid: ''
                    ,homeworks:result 
                })   
                } else {
                    console.log (' inside false');
                    res.render('parent/view-homework.ejs', {
                    title: 'View Homework',
                    class_id: '',
                    resultClass: '',
                    message: ''
                    ,user: req.decoded.user 
                    ,stid: ''
                    ,homeworks:''
                })   
                }  
            })

        })
    }
}