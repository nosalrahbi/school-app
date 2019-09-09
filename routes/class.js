module.exports = {
    classesPage : (req, res) => {
        let q = "SELECT * FROM classes"

        db.query(q, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading classes');
                return res.redirect('back');
            }
            res.render('classes-main', {
                title: 'Add Classes'
                ,message: ''
                ,user: req.decoded.user
                ,classes: result 
            })
        })
    },
    addClassPage : (req, res) => {
        let q = "SELECT DISTINCT CONCAT(e_firstname,' ',e_lastname) as name, e_id FROM teachers;"
        db.query(q, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading class details');
                return res.redirect('back');
            }
            res.render('add-class.ejs', {
                title: 'Add Classes'
                ,message: ''
                ,user: req.decoded.user
                ,teachers: result
            })
        })
    },
    addClass : (req, res) => {
        let className = req.body.class_name
        let classTeacher = req.body.class_teacher
        let q= "INSERT INTO classes (class_name, class_teacher) VALUEs (?)"
        let clas= [[className],[classTeacher]]

        db.query(q, [clas], (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error saving class');
                return res.redirect('/classes');
            }
            req.flash('success_msg', '1 class added successfully');
            res.redirect('/classes') 
        })
    },
    editClassPage: (req, res) => {
        let classId = req.params.id
        let q = "SELECT * FROM classes WHERE class_id = ?"
        let q1 = "SELECT DISTINCT CONCAT(e_firstname,' ',e_lastname) as name, e_id FROM teachers;"

        db.query(q, classId, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading classes');
                return res.redirect('back');
            }
            db.query(q1, (err1, result1) => {
                if (err) {
                    req.flash('error_msg', 'Error loading class details');
                    return res.redirect('back');
                }
                res.render('edit-class.ejs', {
                title: 'Add Classes'
                ,message: ''
                ,user: req.decoded.user
                ,clas: result[0]
                ,teachers: result1
                })
            })
        })
    },
    editClass: (req, res) => {
        let classId = req.params.id
        let className = req.body.class_name
        let classTeacher = req.body.class_teacher
        let clas = [[className],[classTeacher],[classId]]
        let q = "UPDATE classes SET class_name=?, class_teacher=? WHERE class_id=?;"

        db.query(q, clas, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error updating class');
                return res.redirect('back');
            }
            req.flash('success_msg', '1 classs updated successfully');
            res.redirect('/classes') 
        })

    },
    deleteClass: (req, res) => {
        let class_id = req.params.id;
        let q = 'DELETE FROM classes WHERE class_id = ?';
        db.query(q, class_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading student / خطأ في تحميل بيانات الطالب');
                return res.redirect('back');
            }
            req.flash('success_msg', '1 class deleted successfully');
            res.redirect('/classes');
        })
    },
    Students2ClassPage: (req, res) => {
        let class_id = req.params.id;
        let order = req.params.order || 'class';
        let q= `SELECT * FROM students ORDER BY ${order} ASC LIMIT ? OFFSET ? ;`;
        let q1 ='SELECT COUNT(*) AS count FROM students;';
        let q2= "SELECT * FROM classes WHERE class_id = ?";

        db.query(q1, (err1, count) => {
            if (err1) {
                req.flash('error_msg', 'Error fetching count');
                return res.redirect('back');
            }
            let stcount = count[0].count;
            let pages = parseInt(stcount/20)+1;
            var startNum;
            var LimitNum=20;
            if(!req.params.start){
                startNum = 0
              }
            else{
                //parse int Convert String to number 
                startNum = ((parseInt(req.params.start)-1)*20);
            }
            let page = [LimitNum,startNum]
            db.query(q2, class_id, (err, result) => {
                if (err) {
                    req.flash('error_msg', 'Error loading class');
                    return res.redirect('back');
                }
                let clas = result[0]
                db.query(q, page, (err, result) => {
                    if (err) {
                        req.flash('error_msg', 'Error loading students');
                        return res.redirect('back');
                    }
                    res.render('add-students2Class.ejs', {
                        title: 'Add students to class',
                        class_id: class_id,
                        order: order,
                        clas: clas,
                        students: result, 
                        user: req.decoded.user,
                        pages: pages
                    });
                });
            })
        })
    },
    addStudents2Class: (req,res) => {
        let class_id = req.params.id;
        let students = req.body;
        let q = "UPDATE students SET class= ? WHERE id = ?";
        for(let i=0; i < students.student_id.length; i++) {
                if (students.set_class[i] === '1') {
                    let studentClass = [[class_id],[students.student_id[i]]]
                    db.query(q,studentClass, (err, result) => {
                        if (err) {
                            req.flash('error_msg', 'Error assigning students to class');
                            return res.redirect('back');
                        }
                    })
                } else {
                continue
            }
       }
        req.flash('success_msg', 'Students assigned to class successfully');
        res.redirect('/viewClass/'+class_id)
    },
    viewClass: (req, res) =>{
        let clas_id = req.params.id;
        let q = 'SELECT * FROM classes WHERE class_id = ?';
        db.query(q, clas_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading class details');
                return res.redirect('back');
            }
            let clas = result[0]

            let q2 ="SELECT * FROM students WHERE class = ?";
            db.query(q2, clas_id, (err,result2) => {
                if (err) {
                    req.flash('error_msg', 'Error loading class students');
                    return res.redirect('back');
                }
                res.render('view-class.ejs', {
                    title: 'Welcome to  school | View Class',
                    clas: clas,
                    students: result2, 
                    message:''
                    ,user: req.decoded.user
                })
            })
        })
    },
    addTablePage : (req, res) => {
        let qSub= "SELECT * FROM subjects;";
        let qCls= "SELECT * FROM classes;";

        db.query(qSub, (err, subjects) => {
            if (err) {
                req.flash('error_msg', 'Error loading subjects');
                return res.redirect('back');
            } 
            db.query(qCls, (err2, clases) => {
                if (err2) {
                    req.flash('error_msg', 'Error loading classes');
                    return res.redirect('back');
                } 
                res.render('add-table.ejs', {
                title: ' View Table'
                ,user: req.decoded.user
                , message:''
                , subjects : subjects
                , clases : clases 
                })   
            })
        })
    },
    addTable : (req,res) => {
        let t_name = req.body.table_name;
        let classId = req.body.class_id;
        let up_date = req.body.up_date;
        let table = [[t_name],[classId],[up_date]]
        let q = "INSERT INTO tables (t_name, class_id, up_date) VALUES (?)";

        db.query(q, [table], (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error saving table');
                return res.redirect('back');
            } 
            path = '/addPeriods/'+t_name;
            req.flash('success_msg', '1 table added successfully');
            res.redirect(path) 
        })
        
    },
    addPeriodsPage : (req, res) => {
        let t_name = req.params.tname;

        let qSub= "SELECT * FROM subjects;";
        let qCls= "SELECT * FROM classes;";

        db.query(qSub, (err, subjects) => {
            if (err) {
                req.flash('error_msg', 'Error loading subjects');
                return res.redirect('back');
            } 
            db.query(qCls, (err2, clases) => {
                if (err2) {
                    req.flash('error_msg', 'Error loading classes');
                    return res.redirect('back');
                } 
                res.render('add-periods.ejs', {
                    title: 'Add Periods'
                    ,user: req.decoded.user
                    , message:''
                    , subjects : subjects
                    , clases : clases 
                    ,t_name : t_name 
                })  
            })
        })
    },
    savePeriods : (req, res) => {
        let t_name = req.body.table_name;
        let q1 = "SELECT id FROM tables WHERE t_name = ?";
        let q2 = "INSERT INTO periods(t_id, day_id, p1, p2, p3, p4, p5, p6, p7, p8) VALUES ?;";

        db.query(q1, t_name,(err, result1) => {
            if (err) {
                req.flash('error_msg', 'Error loading table');
                return res.redirect('back');
            } 
            
            //console.log(result1[0].id)
            let data = [[[result1[0].id],[1],[req.body.a1],[req.body.a2],[req.body.a3],[req.body.a4],[req.body.a5],[req.body.a6],[req.body.a7],[req.body.a8]],
        [[result1[0].id],[2],[req.body.b1],[req.body.b2],[req.body.b3],[req.body.b4],[req.body.b5],[req.body.b6],[req.body.b7],[req.body.b8]],
        [[result1[0].id],[3],[req.body.c1],[req.body.c2],[req.body.c3],[req.body.c4],[req.body.c5],[req.body.c6],[req.body.c7],[req.body.c8]],
        [[result1[0].id],[4],[req.body.d1],[req.body.d2],[req.body.d3],[req.body.d4],[req.body.d5],[req.body.d6],[req.body.d7],[req.body.d8]],
        [[result1[0].id],[5],[req.body.e1],[req.body.e2],[req.body.e3],[req.body.e4],[req.body.e5],[req.body.e6],[req.body.e7],[req.body.e8]]];
            //console.log(data)
            db.query(q2,[data],(err2, result) => {
                if (err2) {
                    req.flash('error_msg', 'Error saving periods');
                    return res.redirect('back');
                } 
                req.flash('success_msg', 'Periods save successfully');
                res.redirect('/viewTable')
            })
        })
    },
    viewTablePage: (req, res) => {
        let qtname ="SELECT * FROM tables;";
        let qclas =" SELECT * FROM classes;";
        db.query(qtname, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading tables');
                return res.redirect('back');
            } 
            db.query(qclas, (err1, result1) => {
                if (err1) {
                    req.flash('error_msg', 'Error loading class');
                    return res.redirect('back');
                }  
                res.render('view-Tables.ejs', {
                    title: 'View Timetables'
                    ,user: req.decoded.user
                    , message:'SELECT TABLE Id TO VIEW'
                    ,clases:result1
                    ,tables: result
                })  
             })
        })
    },
    viewTable: (req, res) => {
        let id = req.params.id;
        let qt="SELECT * FROM tables WHERE id =?;"
        let q = "SELECT p.t_id, d.day_name, s1.subject_ename as p1, s2.subject_ename as p2, s3.subject_ename as p3, s4.subject_ename as p4,s5.subject_ename as p5, s6.subject_ename as p6,s7.subject_ename as p7, s8.subject_ename as p8 FROM periods p JOIN day_of_week d on d.id = p.day_id JOIN subjects s1 on s1.subject_id = p.p1 JOIN subjects s2 on s2.subject_id = p.p2 JOIN subjects s3 on s3.subject_id = p.p3 JOIN subjects s4 on s4.subject_id = p.p4 JOIN subjects s5 on s5.subject_id = p.p5 JOIN subjects s6 on s6.subject_id = p.p6 JOIN subjects s7 on s7.subject_id = p.p7 JOIN subjects s8 on s8.subject_id = p.p8 WHERE p.t_id = ?;"

        db.query(q, id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading subjects');
                return res.redirect('back');
            } 
            db.query(qt, id, (err1, tables)=> {
                if (err) {
                    req.flash('error_msg', 'Error loading table');
                    return res.redirect('back');
                } 
                res.render('view-Table.ejs', {
                title: 'View Timetble'
                    ,user: req.decoded.user
                    , message:''
                    ,periods: result
                    ,table: tables[0]
            })
            
            })
        })
        
    }
}
