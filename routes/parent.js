module.exports= {
    addParentPage: (req,res) => {
        let st_id = req.params.id
        res.render('add-parent.ejs', {
            title: 'Add Parent',
            message: '',
            st_id: st_id
            ,user: req.decoded.user
        });
    },
    addParent: (req, res) => {
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let sex = req.body.sex;
        let civil_id = req.body.civil_id;
        let mobile = req.body.mobile;
        let email = req.body.email;
        let st_id = req.body.st_id;

        let studentQuery = "SELECT * FROM students WHERE id = ?";
        db.query(studentQuery, st_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error finding student');
                return res.redirect('back');
            }
            if (result.length<1) {
                message = 'No student with this ID';
                res.render('index.ejs', {
                    title: 'View Students',
                    students: result
                    ,user: req.decoded.user})      
            } else {
                let parentQuery = "SELECT * FROM parents WHERE st_id = ?";
                db.query(parentQuery, req.params.id, (err, result) => {
                    if (err) {
                        req.flash('error_msg', 'Error fetching parents');
                        return res.redirect('back');
                    }
                    if (result.length === 2) {
                        req.flash('error_msg', 'Tow Parents already added to this student !!');
                        return res.redirect('/mainStudent/'+st_id);
                    } else {
                        let newParent = [[first_name],[last_name],[sex],[civil_id],[mobile],[email],[st_id]];
                        let query = "INSERT INTO parents (first_name, last_name, sex, civil_id, mobile, email, st_id) VALUES (?)";
                        db.query(query, [newParent], (err, result) => {
                        if (err) {
                            req.flash('error_msg', 'Error saving new parent');
                            return res.redirect('back'); 
                        }
                        req.flash('success_msg', '1 New parent added');
                        res.redirect('/mainStudent/'+st_id);
                    })
                    }
                })

                
            }
        })
    },
    parentStudentPage: (req, res) => {
        let st_id = req.params.id
        let q = "SELECT * FROM students WHERE students.id = ?";
        db.query(q, st_id, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('parent/student.ejs', {
                title: 'Student Details',
                student: result[0],
                message: ''
                ,user: req.decoded.user
                ,stid: st_id 
            })
        })
    },
    parentParentsPage: (req, res) => {
        let st_id = req.params.id;
        let queryParents = "SELECT * FROM parents WHERE st_id = ?";
        db.query(queryParents, st_id, function (err, resultPr) {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('parent/parents.ejs', {
                title: 'Parents Details',
                parents: resultPr,
                message: ''
                ,user: req.decoded.user
                ,stid: st_id 
            })
        })
    },
    parentFees: (req, res) => {
        let st_id = req.params.id;
        let queryPayments = "SELECT * FROM payments WHERE st_id = ?";
        let queryPaid = "SELECT SUM(amount) AS total FROM payments WHERE st_id = ?";
        let queryDue = "SELECT (reg_fee+cloth_fee+transport_fee+tuition_fee-discount_fee) As FeeSum FROM students WHERE id=?";
        db.query(queryPayments, st_id, (err, resultPm)=> {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(queryPaid, st_id, (err,resultPaid)=> {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(queryDue, st_id, (err,resultDue)=> {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.render('parent/Fees.ejs', {
                        title: 'Student Details',
                        payments: resultPm,
                        total: resultPaid[0],
                        feeSum: resultDue[0],
                        message: ''
                        ,user: req.decoded.user
                        ,stid: st_id 
                    });
                });
            });
        })
    },
    viewHomeworkPage: (req,res) => {
        var st_id = req.params.id;
        let q = "SELECT class FROM students WHERE id = ?";
        let q1 = "SELECT DISTINCT task_date FROM homeworks WHERE class_id = ? ORDER BY task_date";
        db.query(q, st_id, (err, result) => {
            if (err) {
             return res.status(500).send(err);
            }
            let class_id = result[0].class;      
            db.query(q1, class_id, (err1, result1) => {
                if (err) {
                    return res.status(500).send(err1);
                } 
                res.render('parent/homework.ejs', {
                    title: 'Find Homework',
                    class_id: class_id,
                    dates: result1
                    ,user: req.decoded.user 
                    ,stid: st_id 
                })
            })
        });
    } ,
    viewHomework: (req, res) => {
        let st_id = req.params.id;
        let class_id = req.body.class_id;
        let task_date = req.body.task_date;
        let qClass = "SELECT DISTINCT homeworks.subject_id, subjects.subject_ename FROM homeworks left join Subjects ON homeworks.subject_id=subjects.subject_id WHERE class_id= ? AND task_date = ? ORDER BY subject_id;";
        let q = "SELECT * FROM homeworks left join Subjects ON homeworks.subject_id=subjects.subject_id WHERE class_id= ? AND task_date = ? ORDER BY homeworks.subject_id;";
        let question = [[class_id],[task_date]]

        db.query(q, question, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(qClass, question, (err, resultClass) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render('parent/view-homework.ejs', {
                    title: 'View Homework',
                    class_id: result[0].class,
                    resultClass: resultClass,
                    message: ''
                    ,user: req.decoded.user 
                    ,stid: st_id
                    ,homeworks:result 
                })
            })

        })
    },
    viewParentTable: (req, res) => {
        let st_id = req.params.id
        let qtname ="SELECT * FROM tables WHERE class_id = ? ORDER BY up_date DESC;";
        let qclas ="SELECT class FROM students WHERE id = ?";
        let q = "SELECT p.t_id, d.day_name, s1.subject_ename as p1, s2.subject_ename as p2, s3.subject_ename as p3, s4.subject_ename as p4,s5.subject_ename as p5, s6.subject_ename as p6,s7.subject_ename as p7, s8.subject_ename as p8 FROM periods p JOIN day_of_week d on d.id = p.day_id JOIN subjects s1 on s1.subject_id = p.p1 JOIN subjects s2 on s2.subject_id = p.p2 JOIN subjects s3 on s3.subject_id = p.p3 JOIN subjects s4 on s4.subject_id = p.p4 JOIN subjects s5 on s5.subject_id = p.p5 JOIN subjects s6 on s6.subject_id = p.p6 JOIN subjects s7 on s7.subject_id = p.p7 JOIN subjects s8 on s8.subject_id = p.p8 WHERE p.t_id = ?;"
        db.query(qclas, st_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading class');
                return res.redirect('/parent/main');
            } 
            db.query(qtname, result[0].class, (err1, result1) => {
                if (err1) {
                    req.flash('error_msg', 'No tables found');
                    return res.redirect('/parent/main');
                } 
                if (result1[0]){
                  db.query(q, result1[0].id, (err, result2) => {
                    if (err1) {
                        req.flash('error_msg', 'Error loading tables');
                        return res.redirect('/parent/main');
                    } 
                   res.render('view-Table.ejs', {
                    title: 'View Timetble'
                    ,user: req.decoded.user
                    , message:''
                    ,periods: result2
                    ,table: result1[0] 
                    })               
                })    
                } else {
                    res.render('view-Table.ejs', {
                        title: 'View Timetble'
                        ,user: req.decoded.user
                        , message:''
                        ,periods: ''
                        ,table: '' 
                        })               
                    }     
                }) 
             })
        }
    }