const date =require('date-and-time')

module.exports = {
    financeMainPage : (req, res) =>{
        //let q = " SELECT * FROM monthlysum;"
        let q1 = "SELECT m.month_no, m.month_name, e.ex_sum, i.in_sum, p.pay_sum, s.salaries_sum FROM months m "+
        "LEFT JOIN "+ 
        "(SELECT date_format(ex_date,'%M-%Y') As emonthly, SUM(ex_price*ex_quantity) As ex_sum FROM expenses group by year(ex_date), month(ex_date)) e  ON m.month_name = e.emonthly "+
        "LEFT JOIN "+
        "(SELECT date_format(in_date,'%M-%Y') As imonthly, SUM(in_price*in_quantity) As in_sum FROM income group by year(in_date), month(in_date)) i  ON m.month_name = i.imonthly "+
        "LEFT JOIN "+
        "(SELECT date_format(pay_date,'%M-%Y') As pmonthly, SUM(amount) As pay_sum FROM payments group by year(pay_date), month(pay_date)) p  ON m.month_name = p.pmonthly "+
        "LEFT JOIN "+
        "(SELECT date_format(pay_date,'%M-%Y') As smonthly, SUM(amount) As salaries_sum FROM salaries group by year(pay_date), month(pay_date)) s  ON m.month_name = s.smonthly "+
        "ORDER BY m.month_no;"

        db.query(q1, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error loading finances');
                return res.redirect('back');
            } 
            var income =[]
            var expense =[]
            result.forEach((total) => {
                income.push(total.pay_sum+total.in_sum);
                expense.push(total.ex_sum+total.salaries_sum);
            })
            res.render('finance-main.ejs', {
                title: 'Main Finance',
                totals: result
                ,user: req.decoded.user
                ,income:income
                ,expense: expense
        });
    })
},
    getAddIncome: (req,res) => {
        res.render('income-expense.ejs', {
            title: "Add Income",
            message: "Add Income"
            ,user: req.decoded.user
        });
    },
    getAddExpense: (req,res) => {
        res.render('income-expense.ejs', {
            title: "Add Expense",
            message: 'Add Expense'
            ,user: req.decoded.user
        });
    },
    addIncome: (req,res)=>{
        let in_category = req.body.in_category;
        let invoice_no= req.body.invoice_no;
        let in_item= req.body.in_item;
        let in_quantity= req.body.in_quantity;
        let in_price= req.body.in_price;
        let in_date= req.body.in_date;
        let in_desc= req.body.in_desc;

        let income =[[in_category],[invoice_no],[in_item],[in_quantity],[in_price],[in_date],[in_desc]];
        let query = "INSERT INTO income (in_category, invoice_no, in_item, in_quantity, in_price, in_date, in_desc) VALUES (?)";

        db.query(query, [income], (err, result)=> {
            if (err) {
                req.flash('error_msg', 'Error saving income');
                return res.redirect('back');
            }
            req.flash('success_msg', 'Income saved successfully');
            res.redirect('/mainFinance')
        })
    },
    addExpense: (req,res)=>{
        let in_category = req.body.in_category;
        let invoice_no= req.body.invoice_no;
        let in_item= req.body.in_item;
        let in_quantity= req.body.in_quantity;
        let in_price= req.body.in_price;
        let in_date= req.body.in_date;
        let in_desc= req.body.in_desc;

        let income =[[in_category],[invoice_no],[in_item],[in_quantity],[in_price],[in_date],[in_desc]];
        let query = "INSERT INTO expenses (ex_category, invoice_no, ex_item, ex_quantity, ex_price, ex_date, ex_desc) VALUES (?)";

        db.query(query, [income], (err, result)=> {
            if (err) {
                req.flash('error_msg', 'Error saving expense');
                return res.redirect('back');
            }
            req.flash('success_msg', 'Expense saved successfully');
            res.redirect('/mainFinance')
        })
    }, 
    getSalaries: (req,res) => {
        let q= "SELECT e_id, e_firstname, e_lastname, e_salary, bank, AccNo FROM teachers";

        db.query(q, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Error fetching salary details');
                return res.redirect('back');
            }
            res.render('pay-salaries.ejs', {
                title: 'Pay Salaries',
                message: '', 
                teachers: result
                ,user: req.decoded.user
            })
        })
    },
    saveSalaries: (req, res) => {
        let dt = new Date(req.body.e_month);
        let pay_month = date.format(dt, 'YYYY-MM-[01]');
        let salaries = req.body;
        let q = "INSERT INTO salaries (e_id, sal_month, pay_date, amount, note) VALUES (?)";

        for (let i=0; i < salaries.e_id.length; i++) {
            if (salaries.use[i]== 1) {
                let salary = [[salaries.e_id[i]], [pay_month], [salaries.pay_date[i]],[salaries.amount[i]], [salaries.note[i]]];
                db.query(q, [salary], (err, result) => {
                    if (err) {
                        res.status(500).send(err)
                    }                  
                })   
            } else{
              continue  
            }
            
        } 
        //req.flash('success_msg', 'Salaries saved successfully');
        res.redirect('/Teachers')  
    },
    monthFinance: (req, res) => {
        let month_name = req.params.month;
        let qp = "SELECT * FROM payments WHERE date_format(pay_date,'%M-%Y') = ? ORDER BY pay_id;";
        let qi = "SELECT * FROM income WHERE date_format(in_date,'%M-%Y') = ? ORDER BY in_id;";
        let qe = "SELECT * FROM expenses WHERE date_format(ex_date,'%M-%Y') = ? ORDER BY ex_id;";
        let qs = "SELECT * FROM salaries WHERE date_format(pay_date,'%M-%Y') = ? ORDER BY sal_id;";
        db.query(qp, month_name,(err, payments) => {
            if (err) {
                res.status(500).send(err)
            }
            db.query(qi, month_name,(err, incomes) => {
                if (err) {
                    res.status(500).send(err)
                }
                db.query(qe, month_name,(err, expenses) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    db.query(qs, month_name,(err, salaries) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        res.render('month-finances.ejs', {
                            title: 'Month Statement',
                           payments: payments,
                           incomes: incomes,
                           expenses: expenses, 
                           salaries: salaries
                           ,user: req.decoded.user 
                        })
                    })    
                })
            })
        })
    }

}