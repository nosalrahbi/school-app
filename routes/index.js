//var mysql = require('mysql');
module.exports = {
    getIndexPage: (req,res)=> {
        let username =req.decoded.user;
        let visit = new Date;
        let usertime = [[visit],[username]]
        let qupdatelast = `UPDATE users SET lastVisit = ? WHERE user_name = ?;`
        let qlastVisit = 'SELECT lastVisit FROM users WHERE user_name = ?';
        let qst = 'SELECT COUNT(*) AS Count FROM students;';
        let qparent = 'SELECT COUNT(*) AS Count FROM parents;';
        let qbus = 'SELECT COUNT(*) AS Count FROM buses;';
        let qclas = 'SELECT COUNT(*) AS Count FROM classes;';
        let qteacher = 'SELECT COUNT(*) AS Count FROM teachers;';

        db.query (qlastVisit, username,(err, lastVisit) => {
            if (err) { res.status(500).send(err) }
            db.query (qupdatelast, usertime, (err0, setlast) => {
                if (err0) { res.status(500).send(err0) }
                db.query (qst,(err1, students) => {
                    if (err1) { res.status(500).send(err1) }
                    db.query (qparent,(err2, parents) => {
                        if (err2) { res.status(500).send(err2) }
                        db.query (qbus,(err3, buses) => {
                            if (err3) { res.status(500).send(err3) }
                            db.query (qclas,(err4, classes) => {
                                if (err4) { res.status(500).send(err4) }
                                db.query (qteacher,(err5, teachers) => {
                                    if (err5) { res.status(500).send(err5) }
                                    res.render('master-index.ejs', {
                                        title: 'Main Page', 
                                        message:'',
                                        user: req.decoded.user
                                        ,lastVisit: lastVisit[0].lastVisit
                                        ,students: students[0].Count
                                        ,parents: parents[0].Count
                                        ,buses: buses[0].Count
                                        ,classes: classes[0].Count
                                        ,teachers: teachers[0].Count
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
getOrderdHomePage: (req,res) => {
    let order = req.params.order || 'id';
    let q = `SELECT * FROM students ORDER BY ${order} ASC LIMIT ? OFFSET ? ;`;
    let q1 ='SELECT COUNT(*) AS count FROM students;';

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
        db.query(q, page, (err, result) => {
         if (err) {
            req.flash('error_msg', 'Error fetching students');
            return res.redirect('back');
         }
         res.render('index.ejs', {
             title: 'View Students',
             students: result, 
             user: req.decoded.user
             ,pages: pages
             ,order: order
         });
     }); 
    })  
}
};
