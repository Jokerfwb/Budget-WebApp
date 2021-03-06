
//test

var ViewModel = function () {
    var self = this;
    self.bill = new bill();
    self.weeklyExpense = new weeklyExpense();
    self.selectedItem = ko.observable();

    //User input for expenses 
    self.bills = ko.observableArray([]);
    self.weeklyExpenses = ko.observableArray([]);

    //User Inputed for Income
    self.income = ko.observable(0);
    self.payFrequency = ko.observable('weekly');
    self.weeklyIncome = ko.observable(670.00);
    self.weekRange = ko.observableArray([]);
    self.payDay = ko.observable();
    self.dayOptions = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    

    //Computered amounts based of the users input for income and inexpenses 
    self.monthlyIncome = ko.computed(function() {
                            var income = self.income()
                            return ((Number(income) * 52)/12).toFixed(2);
                        })
    self.totalMonthlyBills = ko.computed(function() {
                            var total = 0;
                            var bills = self.bills();
                            for (var i = 0; i < bills.length; i++) {
                                total = total + Number(bills[i].amount());
                            }
                            return total.toFixed(2);
                        }) 
    self.totalMonthlyWeeklyExpenses = ko.computed(function() {
                            var total = 0;                            
                            var weeklyExpenses = ko.toJS(self.weeklyExpenses())                            
                            for (var i = 0; i < weeklyExpenses.length; i++) {
                                total = total + Number(weeklyExpenses[i].monthlyAmount);
                            }
                            return total.toFixed(2);
                        })  
    self.totalMonthlyExpenses = ko.computed(function() {
                            var total = 0;
                            var totalMonthlyBills = self.totalMonthlyBills();
                            var totalMonthlyWeeklyExpenses = self.totalMonthlyWeeklyExpenses();
                            return total = (Number(totalMonthlyBills) + Number(totalMonthlyWeeklyExpenses)).toFixed(2);
                        })
    self.monthlyMoneyLeft = ko.computed(function() {
                            var total = 0
                            var monthlyIncome = self.monthlyIncome();
                            var totalMonthlyExpenses = self.totalMonthlyExpenses();
                            return total = (monthlyIncome - totalMonthlyExpenses).toFixed(2);
                        })
    
    self.budget = ko.observableArray([]);
    self.moneyStatus = ko.computed(function (data) {
        return self.monthlyMoneyLeft() < 0 ? "outFlow" : "income";
    })

    self.addBill = function () {
        var x = ko.toJS(self.bill);
        self.bills.push(new bill(x));
        console.log(self.bills());
        self.resetForm();        
    }

    self.addWeeklyExpense = function() {
        var x = ko.toJS(self.weeklyExpense);
        self.weeklyExpenses.push(new weeklyExpense(x));
        console.log(self.weeklyExpenses());
        self.resetForm();
    }

    //Will enentrually be a call to a server for the information
    self.getWeeklyExpenses = function () {
        for (var i = 0; i < myExpenses.length; i++) {
            var x = new weeklyExpense(myExpenses[i]);
            self.weeklyExpenses.push(x);
        }
    }

    self.getBills = function () {
        for (var i = 0; i < myBills.length; i++) {
            var x = new bill(myBills[i]);
            self.bills.push(x);
        }
    }

    self.getWeekRange = function () {  
        self.weekRange.removeAll();      
        var a = moment(self.payDay()).format('YYYY-MM-DD');
        self.weekRange.push(a);
        for (var i = 0; i < 48; i++) {
            a = moment(a).add(7, 'days').format('YYYY-MM-DD');
            self.weekRange.push(a);
        }
        console.log(self.weekRange());
    }

    // self.setBudget = function () {
    //     self.budget.removeAll();
        
    //     for (var i = 0; i < self.weekRange().length; i++) {            
    //         var weekOf = self.weekRange()[i];
    //         var startDate = moment(weekOf);
    //         var endDate = moment(self.weekRange()[i + 1]);

    //         var thisWeeksBill = new weeklyBill();
    //         thisWeeksBill.startOfWeek(weekOf);       
        
    //         for (var j = 0; j < self.bills().length; j++) {
    //             var date = moment(self.bills()[j].dueDate());
                
    //             if (date.isBetween(startDate, endDate, null, '[)')) {  
    //                 var jsBill= ko.toJS(self.bills()[j]);
    //                 thisWeeksBill.weeklyBills.push(new bill(jsBill));                   
    //                 self.bills()[j].dueDate(date.add(1, 'months').format("YYYY-MM-DD"))                     
    //             }
    //         }
    //         thisWeeksBill.weeklyAmount(totalWeeklyBills(thisWeeksBill));
    //         self.budget.push(thisWeeksBill);             
                    
    //     }
    //     console.log(self.budget());
    // }
    self.setBudget = function () {
        self.budget.removeAll()
        // console.log(ko.toJS(self.bills()));
        // console.log(ko.toJS(self.weeklyExpenses()));
        // console.log(ko.toJS(self.payDay()))

         //Get Current Date
        setPlan(self.payDay());
    }

    self.editItem = function(itemToEdit) {
        self.selectedItem(itemToEdit);
    }

    self.deleteItem = function(itemToDelete) {
        var reallyDelete = confirm('If you want to delete this item select OK otherwise CANCEL');
        if(reallyDelete) {
            self.weeklyExpenses.remove(itemToDelete);
            self.bills.remove(itemToDelete);
        }
    }

    self.updateExpense = function() {
        self.selectedItem(null);
    }

    self.weeklyExpenseTemplate = function(itemToEdit) {
        return self.selectedItem() == itemToEdit ? "editWeeklyExpenseTmp" : "weeklyExpenseTmp"; 
    }

    self.billTemplate = function(itemToEdit) {
        return self.selectedItem() == itemToEdit ? "editBillTmp" : "billTmp";
    }

    self.resetForm = function () {
        self.bill.name(" ");
        self.bill.dueDate("2017-01-01");
        self.bill.amount(" ");
        self.weeklyExpense.name(" ");
        self.weeklyExpense.weeklyAmount(" ");

       
    }
}


//Data Functions
function bill (data) {
    if(!data){
        this.name = ko.observable();
        this.dueDate = ko.observable('2017-01-01');
        this.amount = ko.observable('0.00');
        this.dayDue = ko.observable();
    } else {
        this.name = ko.observable(data.name);
        this.dueDate = ko.observable(data.dueDate);
        this.amount = ko.observable(data.amount);
        this.dayDue = ko.observable(moment(data.dueDate, 'YYYY-MM-DD').format('DD'));
    }
}

function weeklyExpense(data) {
    if(!data){
        this.name = ko.observable();
        this.weeklyAmount =ko.observable('0.00');
        this.monthlyAmount = ko.observable('0.00');
    } else {
        this.name = ko.observable(data.name);
        this.weeklyAmount = ko.observable(data.weeklyAmount);
        this.monthlyAmount = ko.computed(function() {                                
                                console.log(this.weeklyAmount());
                                var temp = this.weeklyAmount();
                                return total = (Number(temp) * 4.4).toFixed(2);
                            }, this);
    }
}


function weeklyBill(){
    this.startOfWeek = ko.observable();
    this.weeklyBills = ko.observableArray([]);
    this.weeklyAmount = ko.observable();
}

function totalWeeklyBills(x) {
    var weeklyAmount = 460.00;
    for(var i = 0; i < x.weeklyBills().length; i++) {
        weeklyAmount += Number(x.weeklyBills()[i].amount());
    }
    return weeklyAmount
}

function setPlan(payDay) {
    // console.log(moment().format("YYYY-MM-DD"));
    // console.log(moment().startOf('week').format('DD'));
    // console.log(moment().startOf('week').format('YYYY-MM-DD'));
    // console.log(moment().diff(moment().startOf('week'),'days'));
    console.log(moment(payDay, 'dddd').day());
    console.log(moment().day());
    //console.log(moment().day(moment().day() >= 5 ? 5 : -2).format("YYYY-MM-DD"));
    var todaysIndex = moment().day();
    var payDayIndex = moment(payDay, 'dddd').day();

    var temp = payDayIndex - todaysIndex;
    if (temp < 0) {temp = 7 + temp;}
    var payDayDate = moment().add(temp, 'days').format('YYYY-MM-DD');
    console.log('Next pay day date is:   ' + payDayDate);
    console.log('Previous pay day is:    ' + moment(payDayDate).subtract(7, 'days').format('YYYY-MM-DD'));

    // getPayDayDate() {
    //     this.todaysDate = new Date(this.year, this.month-1, this.day);
    //     this.payDayDate = this.todaysDate;
        
    //     this.todaysDayOfWeekIndex = this.todaysDate.getDay();
    //     this.todaysDayOfWeek = this.daysOfWeek[this.todaysDayOfWeekIndex];

    //     var temp = this.payDayIndex - this.todaysDayOfWeekIndex;

    //     if  (temp < 0) {temp = 7+temp; }
    //     this.payDayDate.setDate(this.todaysDate.getDate() + temp);    
    // }
}

var myExpenses = [
    {name: 'Gas', weeklyAmount: '60.00'},
    {name: 'Groceries', weeklyAmount: '150.00'}
]

var myBills = [
    { name: 'Rent', dueDate: '2017-01-05', amount: '1100.00' },
    { name: 'Electric', dueDate: '2017-01-06', amount: '180.00' },
    { name: 'Internet', dueDate: '2017-01-29', amount: '45.00' },
    { name: 'Car Insurance', dueDate: '2017-01-03', amount: '145.00' },
    { name: 'Cell Phone', dueDate: '2017-01-21', amount: '193.00' },
    { name: 'Water', dueDate: '2017-01-21', amount: '20.00' },
    { name: 'Netflix', dueDate: '2017-01-03', amount: '13.06' },
    { name: 'Fairwinds Credit Card', dueDate: '2017-01-17', amount: '40.00' },
    { name: 'Amazon Credit Card', dueDate: '2017-01-19', amount: '25.00' },
    { name: 'Bealls Credit Card', dueDate: '2017-01-19', amount: '25.00' },
    { name: 'Title Loan', dueDate: '2017-01-02', amount: '170.00' },
    { name: 'Planet Fitness', dueDate: '2017-010--17', amount: '10.65' },
    { name: 'Chrissys Bags', dueDate: '2017-01-02', amount: '20.00' }
]

ko.applyBindings(new ViewModel());