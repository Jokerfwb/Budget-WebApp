function Bill (data) {
    this.Name = ko.observable(data.name);
    this.DueDate = ko.observable(data.dueDate);
    this.Amount = ko.observable(data.amount);
}
function BudgetItem(item) {   
    this.WeekOf = ko.observable(item.startDate)
    this.Bills = ko.observableArray([
        {
            BillName: ko.observable(item.name),
            BillDueDate: ko.observable(item.dueDate),
            BillAmount: ko.observable(item.amount)
        },
    ])
}

var ViewModel = function() {
    var self = this;

    self.Bills = ko.observableArray([]);
    self.budget = ko.observableArray([
        {
            WeekOf: ko.observable(),
            Bills: ko.observableArray([])
        }
    ]);
    self.weekRange = ko.observableArray([]);
    self.payFrequency = ko.observable();
    self.payDay = ko.observable("2016-12-30");
    self.bill = {
  	    name : ko.observable(" "),
        dueDate: ko.observable("2017-01-01"),        
        amount: ko.observable(" ")
    };
  
    self.addBill = function () {
        var x = ko.toJS(self.bill);
        self.Bills.push(new Bill(x));
        self.resetForm();
        console.log(self.Bills());
    }

    self.getBills = function () {
        for (var i = 0; i < myBills.length; i++) {
            var x = new Bill(myBills[i]);
            self.Bills.push(x);
        }
    }

    self.getWeekRange = function () {        
        var a = moment(self.payDay()).format('YYYY-MM-DD');
        self.weekRange.push(a);
        for (var i = 0; i < 48; i++) {
            a = moment(a).add(7, 'days').format('YYYY-MM-DD');
            self.weekRange().push(a);
        }
        console.log(self.weekRange());
    }

    self.setBudget = function () {
        for (var i = 0; i < self.weekRange().length; i++) {

            var startDate = moment(self.weekRange()[i]);
            var endDate = moment(self.weekRange()[i + 1]);
            self.budget()[i].WeekOf(self.weekRange()[i]);

            for (var j = 0; j < self.Bills().length; j++) {
                var date = moment(self.Bills()[j].DueDate());

                if (date.isBetween(startDate, endDate, null, '[)')) {                    

                    self.budget()[i].Bills.push(self.Bills()[j]);
                }
            }
            console.log(ko.toJS(self.budget()))
        }
        console.log(ko.toJS(self.budget()));
    }

    self.resetForm = function () {
        self.bill.name(" ")
        self.bill.dueDate("2017-01-01")
        self.bill.amount(" ");
    }

    self.getBills();
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