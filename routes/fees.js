
module.exports= {
    addPayPage: (req, res) => {
        let st_id = req.params.id;
        res.render('add-payment.ejs', {
            title: 'Add Payment',
            message: '',
            st_id: st_id
            ,user: req.decoded.user
        })
    },
    addPayment: (req, res) => {
        let st_id = req.body.st_id;
        let pay_date = req.body.pay_date;
        let amount = req.body.amount;
        let category = req.body.category;
        let note = req.body.note;
    
        let newPayment = [[pay_date],[amount],[category],[st_id],[note]];
        let query = "INSERT INTO payments (pay_date, amount, category, st_id, note) VALUES (?)";

        db.query(query, [newPayment], (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error saving payment');
                return res.redirect('back')
            }
            req.flash('success_msg', 'Payment saved succesfully');
            res.redirect('/mainStudent/'+st_id);
        })
    }
}