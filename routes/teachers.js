module. exports = {
    addTeachersPage: (req,res) => {
        res.render('add-teacher.ejs', {
            title: 'Add a new Teacher'
            ,message: ''
            ,user: req.decoded.user
        });
    },
    mainTeachers: (req,res)=>{
        let q = "SELECT * FROM teachers";
        db.query(q, (err, result) => {
            res.render('teachers.ejs', {
                title: 'Teachers Main Page'
                ,message: '',
                teachers: result
                ,user: req.decoded.user
            })
        })
    },
    addTeacher: (req,res) => {
        let e_firstname = req.body.e_firstname;
        let e_lastname= req.body.e_lastname;
        let e_sex= req.body.e_sex;
        let e_passport= req.body.e_passport;
        let e_dob= req.body.e_dob;
        let e_civilid= req.body.e_civilid;
        let e_qualification= req.body.e_qualification;
        let marital = req.body.marital;
        let e_salary= req.body.e_salary;
        let bank= req.body.bank;
        let accno= req.body.accno;
        let e_mobile= req.body.e_mobile;
        let e_address= req.body.e_address;
        let e_note= req.body.e_note;
        let e_active= req.body.e_active;

        let teacher = [[e_firstname],[e_lastname],[e_sex],[e_dob],[e_civilid],[e_passport],[e_qualification],[marital],[e_salary],[bank],[accno],[e_mobile],[e_address],[e_note],[e_active]];
        let q ="INSERT INTO teachers (e_firstname, e_lastname, e_sex, e_dob, e_civilid, e_passport, e_qualification, marital, e_salary, bank, accno, e_mobile, e_address, e_note, e_active) VALUE (?)";

        db.query(q, [teacher], (err,result) => {
            if (err) {
                req.flash('error_msg', 'Error saving new teacher');
                return res.redirect('/teachers');
            }
            req.flash('success_msg', 'New teacher saved successfully');
            return res.redirect('/teachers');
            })
    }, 
    editTeacherPage: (req,res) => {
        let teacher_id = req.params.id;
        let q = "SELECT * FROM teachers WHERE e_id = ?";
        db.query(q, teacher_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error fetching teachers');
                return res.redirect('back');
            }
            res.render('edit-teacher.ejs', {
                title: 'Edit Teacher Details',
                message: '',
                teacher: result[0]
                ,user: req.decoded.user
            }) ;
        });
    },
    editTeacher: (req, res) => {
        let teacher_id = req.params.id;
        let e_firstname = req.body.e_firstname;
        let e_lastname= req.body.e_lastname;
        let e_sex= req.body.e_sex;
        let e_passport= req.body.e_passport;
        let e_dob= req.body.e_dob;
        let e_civilid= req.body.e_civilid;
        let e_qualification= req.body.e_qualification;
        let marital = req.body.marital;
        let e_salary= req.body.e_salary;
        let bank= req.body.bank;
        let accno= req.body.AccNo;
        let e_mobile= req.body.e_mobile;
        let e_address= req.body.e_address;
        let e_note= req.body.e_note;
        let e_active= req.body.e_active;

        let teacher = [[e_firstname],[e_lastname],[e_sex],[e_dob],[e_civilid],[e_passport],[e_qualification],[marital],[e_salary],[bank],[accno],[e_mobile],[e_address],[e_note],[e_active],[teacher_id]];
        let q ="UPDATE teachers SET e_firstname=?, e_lastname=?, e_sex=?, e_dob=?, e_civilid=?, e_passport=?, e_qualification=?, marital=?, e_salary=?, bank=?, AccNo=?, e_mobile=?, e_address=?, e_note=?, e_active=? WHERE e_id = ?";

        db.query(q, teacher, (err,result) => {
            if (err) {
                req.flash('error_msg', 'Error updating teacher details');
                return res.redirect('/teachers');
            }
            req.flash('success_msg', 'Teacher details updeted successfully');
            res.redirect('/teachers')
        });
    },
    deleteTeacher: (req, res) => {
        let teacherId = req.params.id;
        let deleteUserQuery = 'DELETE FROM teachers WHERE e_id = ?';
            db.query(deleteUserQuery, teacherId, (err, result) => {
                if (err) {
                    req.flash('error_msg', 'Error deleting teacher details');
                    return res.redirect('back');
                }
                req.flash('success_msg', 'Teacher details deleted successfully');
                res.redirect('/teachers');
            });
    },
    teacherSalaries: (req, res) => {
        let e_id = req.params.id;
        let q = "SELECT e_firstname, e_lastname, bank, AccNo, sal_id, CONCAT (month(sal_month),'-',year(sal_month)) as sal_month, pay_date, amount, note FROM teachers LEFT JOIN salaries ON teachers.e_id = salaries.e_id WHERE teachers.e_id = ? order by sal_month";
        
        db.query(q, e_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error fetching salary data');
                return res.redirect('back');
            }
            res.render('salary-teacher.ejs', {
                title: 'Welcome to School | Teacher salaries',
                message: '',
                salaries: result,
                e_id: e_id, 
                e_firstname: result[0].e_firstname,
                e_lastname: result[0].e_lastname 
                ,user: req.decoded.user
            })
        })
    }    

}