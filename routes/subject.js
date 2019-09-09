module.exports = {
    addSubjectPage: (req, res) => {
        res.render('add-subject.ejs', {
            title: 'Add Subject',
            message:'',
            user: ''
        })
    },
    addSubject: (req, res) => {
        let subject_e = req.body.subject_ename;
        let subject_a = req.body.subject_aname;
        let q = "INSERT INTO subjects(subject_ename, subject_aname) VALUES (?);"
        let subject= [[subject_e],[subject_a]]

        db.query(q, [subject], (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error saving subject');
                return res.redirect('back');
            }
            req.flash('success_msg', 'Subject saved successfuly');
            res.redirect('/viewSubjects')
        })
    },
    viewSubjectsPage: (req, res) => {
        let q = "SELECT * FROM subjects"

        db.query(q, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading subjects');
                return res.redirect('back');
            }
            res.render('view-subjects', {
                title: 'View Subjects'
                ,user: req.decoded.user
                ,subjects: result 
            })
        })
    },
    deleteSubject: (req, res) => {
        let id = req.params.id;
        let q = "Delete FROM subjects WHERE subject_id = ? ;";

        db.query(q, id, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error deleting subject');
                return res.redirect('back');
            }
            req.flash('success_msg', 'Subject deleted successfully');
            return res.redirect('back');
        })
    }
}