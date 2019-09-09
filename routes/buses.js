let faker = require('faker')
module.exports = {
    busesPage: (req, res) => {
        let q = "SELECT * FROM buses";
        db.query(q, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading buses');
                return res.redirect('back');
            }
            res.render('buses.ejs', {
                title: 'View Buses'
                ,buses: result
                ,message: ''
                ,user: req.decoded.user
            })
        })
    },
    addBusPage: (req, res) => {
        res.render('add-bus.ejs', {
            title: 'Add Buses'
            ,message: ''
            ,user: req.decoded.user
        })
    },
    saveBus: (req, res) => {
        let bus_name = req.body.bus_name;
        let driver = req.body.driver;
        let drv_mobile = req.body.drv_mobile;
        let bus_super = req.body.bus_super;
        let sup_mobile = req.body.sup_mobile;
        let area = req.body.area;
        let bus = [[bus_name],[driver],[drv_mobile],[bus_super],[sup_mobile],[area]];
        let q = "INSERT INTO buses (bus_name, driver, drv_mobile, bus_super, sup_mobile, area) VALUES (?)";

        db.query(q, [bus], (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error saving new bus');
                return res.redirect('back');
            }
            req.flash('success_msg', '1 bus saved successfully');
            res.redirect('/buses')
        })
    },
    editBusPage: (req,res) => {
        let bus_id  = req.params.id;
        let q= "SELECT * FROM buses WHERE bus_id = ?";
        db.query(q, bus_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading bus details');
                return res.redirect('back');
            }
            res.render('edit-bus', {
                title: 'Edit Bus',
                message: '', 
                bus: result[0]
                ,user: req.decoded.user
            })
        })

    },
    editBus: (req, res) => {
        let bus_id = req.body.bus_id
        let bus_name = req.body.bus_name;
        let driver = req.body.driver;
        let drv_mobile = req.body.drv_mobile;
        let bus_super = req.body.bus_super;
        let sup_mobile = req.body.sup_mobile;
        let area = req.body.area;
        let bus = [[bus_name],[driver],[drv_mobile],[bus_super],[sup_mobile],[area],[bus_id]];
        let q = "UPDATE buses SET bus_name=?, driver=?, drv_mobile=?, bus_super=?, sup_mobile=?, area=? WHERE bus_id=?";

        db.query(q, bus, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error updating bus');
                return res.redirect('/buses');
            }
            req.flash('success_msg', 'Bus updated successfully');
            res.redirect('/buses')
        }) 
    }, 
    deleteBus: (req, res) => {
        let bus_id = req.params.id;
        let q = 'DELETE FROM buses WHERE bus_id = ?';
        db.query(q, bus_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error deleting bus');
                return res.redirect('back');
            }
            req.flash('success_msg', '1 bus deleted successfully');
            res.redirect('/buses');
        })
    },
    Students2BusPage: (req, res) => {
        let bus_id = req.params.id;
        let order = req.params.order || 'bus_id';
        //let q= "SELECT * FROM buses WHERE bus_id = ?";
        let q= `SELECT * FROM students ORDER BY ${order} ASC LIMIT ? OFFSET ? ;`;
        let q1 ='SELECT COUNT(*) AS count FROM students;';
        let q2= 'SELECT * FROM buses WHERE bus_id = ?'

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
            db.query(q2, bus_id, (err, result) => {
                if (err) {
                    req.flash('error_msg', 'Error loading bus');
                    return res.redirect('back');
                }
                let bus = result[0]
                db.query(q, page, (err, result) => {
                    if (err) {
                        req.flash('error_msg', 'Error loading students');
                        return res.redirect('back');
                    }
                    res.render('add-students2bus.ejs', {
                        title: 'Add students to bus',
                        bus_id: bus_id,
                        order: order,
                        bus: bus,
                        students: result, 
                        user: req.decoded.user,
                        pages: pages
                    });
                });
            })
        })
    },
    addStudents2Bus: (req,res) => {
        let bus_id = req.params.id;
        let students = req.body;
        let q = "UPDATE students SET bus_id= ? WHERE id = ?";
        for(let i=0; i < students.student_id.length; i++) {
                if (students.set_bus[i] === '1') {
                    let studentBus = [[bus_id],[students.student_id[i]]]
                    db.query(q,studentBus, (err, result) => {
                        if (err) {
                            req.flash('error_msg', 'Error saving students to bus');
                            return res.redirect('back');
                        }
                    })
                } else {
                continue
            }
       }
       req.flash('success_msg', 'Students successfully assigned to bus');
        res.redirect('/buses')
    },
    viewBus: (req, res) =>{
        let bus_id = req.params.id;
        let q = 'SELECT * FROM buses WHERE bus_id = ?';
        db.query(q, bus_id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error bus details');
                return res.redirect('back');
            }
            let bus = result[0]

            let q2 ="SELECT * FROM students WHERE bus_id = ?";
            db.query(q2, bus_id, (err,result2) => {
                if (err) {
                    req.flash('error_msg', 'Error fetching students assigned to bus');
                    return res.redirect('back');
                }
                res.render('view-bus.ejs', {
                    title: 'Welcome to  school | View Bus',
                    bus: bus,
                    students: result2, 
                    message:''
                    ,user: req.decoded.user
                })
            })
        })
    }
}