var ViewModel = function() {
    var self = this;

    self.bills = ko.observableArray([]);
    self.budget = ko.observableArray([]);
    self.weekRange = ko.observableArray([]);
    self.payFrequency = ko.observable();
    self.payDay = ko.observable("2016-12-30");
    self.bill = new bill();
  
    self.addBill = function () {
        var x = ko.toJS(self.bill);
        self.bills.push(new bill(x));
        console.log(self.bills());
        self.resetForm();        
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

    self.setBudget = function () {
        self.budget.removeAll();
        console.log(self.bills());
        for (var i = 0; i < self.weekRange().length; i++) {            
            var weekOf = self.weekRange()[i];
            var startDate = moment(weekOf);
            var endDate = moment(self.weekRange()[i + 1]);

            var thisWeeksBill = new weeklyBill();
            thisWeeksBill.startOfWeek(weekOf);       
        
            for (var j = 0; j < self.bills().length; j++) {
                var date = moment(self.bills()[j].dueDate());
                
                if (date.isBetween(startDate, endDate, null, '[)')) {  
                    var jsBill= ko.toJS(self.bills()[j]);
                    thisWeeksBill.weeklyBills.push(new bill(jsBill));                   
                    self.bills()[j].dueDate(date.add(1, 'months').format("YYYY-MM-DD"))                     
                }
            }
            thisWeeksBill.weeklyAmount(totalWeeklyBills(thisWeeksBill));
            self.budget.push(thisWeeksBill);             
                    
        }
        console.log(self.budget());
    }

    self.resetForm = function () {
        self.bill.name(" ")
        self.bill.dueDate("2017-01-01")
        self.bill.amount(" ");
    }
}

function bill (data) {
    if(!data){
        this.name = ko.observable();
        this.dueDate = ko.observable('2017-01-01');
        this.amount = ko.observable();
    } else {
        this.name = ko.observable(data.name);
        this.dueDate = ko.observable(data.dueDate);
        this.amount = ko.observable(data.amount);
    }
}

function weeklyBill(){
    this.startOfWeek = ko.observable();
    this.weeklyBills = ko.observableArray([]);
    this.weeklyAmount = ko.observable();
}

function totalWeeklyBills(x) {
    var weeklyAmount = 0;
    for(var i = 0; i < x.weeklyBills().length; i++) {
        weeklyAmount += Number(x.weeklyBills()[i].amount());
    }
    return weeklyAmount
}

var myBills = [
    { name: 'Rent', dueDate: '2017-01-05', amount: '1100.00' },
    { name: 'Electric', dueDate: '2017-01-06', amount: '150.00' },
    { name: 'Internet', dueDate: '2017-01-29', amount: '45.00' },
    { name: 'Car Insurance', dueDate: '2017-01-03', amount: '145.00' },
    { name: 'Cell Phone', dueDate: '2017-01-21', amount: '193.00' },
    { name: 'Water', dueDate: '2017-01-21', amount: '20.00' },
    { name: 'Netflix', dueDate: '2017-01-03', amount: '13.00' },
    { name: 'Fairwinds Credit Card', dueDate: '2017-01-17', amount: '40.00' },
    { name: 'Amazon Credit Card', dueDate: '2017-01-19', amount: '25.00' },
    { name: 'Bealls Credit Card', dueDate: '2017-01-19', amount: '25.00' }
]

ko.applyBindings(new ViewModel());