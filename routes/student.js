const fs = require('fs');

module.exports = {
    addStudentPage: (req, res) => {
        res.render('add-student.ejs', {
            title: 'Add a new Student'
            ,message: ''
            ,user: req.decoded.user
        });
    },
    addStudent: (req, res) => {
        //let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let sex = req.body.sex; 
        let dob = req.body.d_o_b;
        let passport_no = req.body.passport_no;
        let address = req.body.address;
        let st_class = req.body.class;
        let bus = req.body.bus_id;
        let parents_mobile = req.body.parents_phone;
        let reg_fee = req.body.reg_fee;
        let cloth_fee = req.body.cloth_fee;
        let transport_fee = req.body.transport_fee;
        let tuition_fee = req.body.tuition_fee;
        let discount_fee = req.body.discount_fee;
        let active = req.body.active;
        let name = first_name+'_'+last_name
        let nameQuery = "SELECT * FROM students WHERE CONCAT_WS('_',first_name, last_name) = ? ";        
        if (req.files) {
            let uploadedFile = req.files.image ;
            let image_name = uploadedFile.name;
            let fileExtension = uploadedFile.mimetype.split('/')[1];
            image_name = first_name.slice(0,5) + '_'+ Date.now() + '.' + fileExtension;       
                    // check the filetype before uploading it
                    if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                        // upload the file to the /public/assets/img directory
                        uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            // send the student's details to the database
                            let newStudent = [[first_name],[last_name],[sex],[dob],[passport_no],[image_name],[address],[st_class],[bus],[parents_mobile],[reg_fee],[cloth_fee],[transport_fee],[tuition_fee],[discount_fee],[active]];
                            let query = "INSERT INTO students (first_name, last_name, sex, d_o_b, passport_no, image, address, class, bus_id, parents_mobile, reg_fee, cloth_fee, transport_fee, tuition_fee, discount_fee, active) VALUES (?) "; 
                            db.query(query, [newStudent], (err, result) => {
                                if (err) {
                                    return res.status(500).send(err);
                                }
                                req.flash('success_msg', '1 student succesfully added / تم إضافة طالب بنجاح');
                                return res.redirect('/students/id/1');
                            });
                        });
                    } else {
                        req.flash('error_msg', 'Accepted image format: only jpeg, png or gif');
                        return res.redirect('back');
                    }
        } else {
             // send the student's details to the database
             let newStudent = [[first_name],[last_name],[sex],[dob],[passport_no],[address],[st_class],[bus],[parents_mobile],[reg_fee],[cloth_fee],[transport_fee],[tuition_fee],[discount_fee],[active]];
             let query = "INSERT INTO students (first_name, last_name, sex, d_o_b, passport_no, address, class, bus_id, parents_mobile, reg_fee, cloth_fee, transport_fee, tuition_fee, discount_fee, active) VALUES (?) "; 
             db.query(query, [newStudent], (err, result) => {
                 if (err) {
                    req.flash('error_msg', 'Adding student failed, server error / فشل في إضافة طالب');
                    return res.redirect('back');
                 }
                req.flash('success_msg', '1 student succesfully added / تم إضافة طالب بنجاح');
                return res.redirect('/students/id/1');
             });
        }
    },
    editStudentPage: (req, res, next) => {
        let studentId = req.params.id;
        let query = "SELECT * FROM students WHERE id = ?";
            db.query(query, studentId, (err, result) => {
                if (err) {
                    req.flash('error_msg', 'Error loading student / خطأ في تحميل بيانات الطالب');
                    return res.redirect('back');
                }
                res.render('edit-student.ejs', {
                    title: 'Edit  Student'
                    ,student: result[0]
                    ,message: ''
                    ,user: req.decoded.user
            });
        });
    },
    editStudent: (req, res) => {
        let studentId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let sex = req.body.sex; 
        let dob = req.body.d_o_b;
        let passport_no = req.body.passport_no;
        let address = req.body.address;
        let st_class = req.body.class;
        let parents_mobile = req.body.parents_phone;
        let bus = req.body.bus_id;
        let reg_fee = req.body.reg_fee;
        let cloth_fee = req.body.cloth_fee;
        let transport_fee = req.body.transport_fee;
        let tuition_fee = req.body.tuition_fee;
        let discount_fee = req.body.discount_fee;
        let active = req.body.active;
        if (req.files) {
            let uploadedFile = req.files.image ;
            let image_name = uploadedFile.name;
            let fileExtension = uploadedFile.mimetype.split('/')[1];
            image_name = first_name.slice(0,5) + '_'+ Date.now() + '.' + fileExtension;      
            // check the filetype before uploading it
            if ((uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') & (uploadedFile.size < 1 * 1024 * 1024)) {
                // upload the file to the /public/assets/img directory
                uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                    if (err) {
                        req.flash('error_msg', 'Error svaing image file');
                        return res.redirect('back');
                    }
                    let editedStudent = [[first_name],[last_name],[sex],[image_name], [dob],[passport_no],[address],[st_class],[bus],[parents_mobile],[reg_fee],[cloth_fee],[transport_fee],[tuition_fee],[discount_fee],[active],[studentId]];
                    let query = "UPDATE `students` SET `first_name` = ?, `last_name` = ?, `sex` = ?, `image`=?, `d_o_b` = ?, `passport_no` = ?, `address` = ?, `class` = ?, `bus_id` = ?, `parents_mobile` = ?, reg_fee= ?, cloth_fee= ?, transport_fee= ?, tuition_fee= ?, discount_fee= ?, active= ? WHERE `students`.`id` = ? ";
                    db.query(query, editedStudent, (err, result) => {
                        if (err) {
                            req.flash('error_msg', 'Error updating student with image');
                            return res.redirect('back');
                        }
                        res.redirect('/students/id/1');
                    });
                })
                } else {
                        message = "Please ensure file format is 'gif'or 'jpeg' or 'png' image and the fie size is less than 1 mb. ";
                        res.render('add-student.ejs', {
                            message,
                            title: 'Welcome to School | Add a new student'
                            ,user: req.decoded.user
                        });
                    }
            } else {
                let editedStudent = [[first_name],[last_name],[sex],[dob],[passport_no],[address],[st_class],[bus],[parents_mobile],[reg_fee],[cloth_fee],[transport_fee],[tuition_fee],[discount_fee],[active],[studentId]];
                let query = "UPDATE `students` SET `first_name` = ?, `last_name` = ?, `sex` = ?, `d_o_b` = ?, `passport_no` = ?, `address` = ?, `class` = ?, `bus_id` = ?, `parents_mobile` = ?, reg_fee= ?, cloth_fee= ?, transport_fee= ?, tuition_fee= ?, discount_fee= ?, active= ? WHERE `students`.`id` = ? ";
                db.query(query, editedStudent, (err, result) => {
                    if (err) {
                        req.flash('error_msg', 'Error updating student without image');
                        return res.redirect('back');
                    }
                    res.redirect('/students/id/1');
                });
            }
    },
    deleteStudent: (req, res) => {
        let studentId = req.params.id;
        let getImageQuery = 'SELECT image from `students` WHERE id = ?';
        let deleteUserQuery = 'DELETE FROM students WHERE id = ?';

        db.query(getImageQuery, studentId, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error finding student image');
                return res.redirect('back');
            }

            let image = result[0].image;
            if (image) {
                fs.unlink(`public/assets/img/${image}`, (err) => {
                    if (err) {
                        req.flash('error_msg', 'Error deleting image');
                        return res.redirect('back');
                        }

                db.query(deleteUserQuery, studentId, (err, result) => {
                    if (err) {
                        req.flash('error_msg', 'Error deleting student');
                        return res.redirect('back');
                    }
                    req.flash('success_msg', '1 student deleted succesfully');
                    res.redirect('/students/id/1');
                });
            }) 
        } else {
            db.query(deleteUserQuery, studentId, (err, result) => {
                if (err) {
                    req.flash('error_msg', 'Error deleting student');
                    return res.redirect('back');
                }
                req.flash('success_msg', '1 student deleted succesfully');
                res.redirect('/students/id/1');
            });
        }
        })
    },
    viewStudent: (req, res) => {
        // Load student parameters
        let studentId = req.params.id;
        let query = "SELECT * FROM students WHERE students.id = ?";
        let queryParents = "SELECT * FROM parents WHERE st_id = ?";
        let queryPayments = "SELECT * FROM payments WHERE st_id = ?";
        let queryPaid = "SELECT SUM(amount) AS total FROM payments WHERE st_id = ?";
        let queryDue = "SELECT (reg_fee+cloth_fee+transport_fee+tuition_fee-discount_fee) As FeeSum FROM students WHERE id=?";
        db.query(query, studentId, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error finding student');
                return res.redirect('back');
            }
            db.query(queryParents, studentId, function (err, resultPr) {
                if (err) {
                    req.flash('error_msg', 'Error finding parents');
                    return res.redirect('back');
                }
                db.query(queryPayments, studentId, (err, resultPm)=> {
                    if (err) {
                        req.flash('error_msg', 'Error fetching payments record');
                        return res.redirect('back');
                    }
                    db.query(queryPaid, studentId, (err,resultPaid)=> {
                        if (err) {
                            req.flash('error_msg', 'Error finding amount paid');
                            return res.redirect('back');
                        }
                        db.query(queryDue, studentId, (err,resultDue)=> {
                            if (err) {
                                req.flash('error_msg', 'Error fetching balance');
                                return res.redirect('back');
                            }
                            res.render('main-student.ejs', {
                                title: 'Student Details',
                                student: result[0],
                                parents: resultPr,
                                payments: resultPm,
                                total: resultPaid[0],
                                feeSum: resultDue[0],
                                message: ''
                                ,user: req.decoded.user
                            });
                        });
                    });
                });
            })
        })
    }, 
    searchStudentPage: (req, res) => {
        res.render('search-students.ejs', {
            title: 'Search Students'
            ,message: ''
            ,user: req.decoded.user
        });
    },

    searchStudents: (req, res) => {
        let criteria = req.body.criteria;
        let value = '%'+req.body.value+'%';
        let q=`SELECT * FROM students WHERE ${criteria} LIKE ? ORDER BY id ASC LIMIT 100`;
        db.query(q, value, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Searching error');
                return res.redirect('back');
            }
            res.render('index.ejs', {
                title: 'View Selected Students',
                students: result, 
                user: req.decoded.user,
                pages: '',
                order: ''
            })
        })
    },
    deleteParent: (req, res) => {
        let parent_id = req.params.id;
        let q = 'DELETE FROM parents WHERE parent_id = ?';
        db.query(q, parent_id, (err, result) => {
            if (err) { 
                return res.status(500).send(err) 
            }
            req.flash('success_msg', 'Parent deleted succesfully');
            res.redirect('back');

        })
    },
    deletePayment: (req, res) => {
        let pay_id = req.params.id;
        let q = 'DELETE FROM payments WHERE pay_id = ?';
        db.query(q, pay_id, (err, result) => {
            if (err) { 
                return res.status(500).send(err) 
            }
            req.flash('success_msg', 'Paryment deleted succesfully');
            res.redirect('back');
        })
    },
    deleteSalary: (req, res) => {
        let sal_id = req.params.id;
        let q = 'DELETE FROM salaries WHERE sal_id = ?';
        db.query(q, sal_id, (err, result) => {
            if (err) { 
                return res.status(500).send(err) 
            }
            req.flash('success_msg', 'Salary deleted succesfully');
            res.redirect('back');
        })
    }
}