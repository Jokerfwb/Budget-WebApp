function Bill (data) {
    this.Name = ko.observable(data.name());
    this.DueDate = ko.observable(data.dueDate());
    this.Amount = ko.observable(data.amount());
}

var ViewModel = function() {
    var self = this;

    self.weekRange = ko.observableArray([]);
    self.payFrequency = ko.observable();
    self.payDay = ko.observable();
    self.bill = {
  	    name : ko.observable(" "),
        dueDate: ko.observable("2017-01-01"),        
        amount: ko.observable(" ")
    };

    self.Bills = ko.observableArray([]);
  
  
    self.addBill = function () {    
        self.Bills.push(new Bill(self.bill));
        self.resetForm();
        console.log(self.Bills());
    }

    self.getWeekRange = function () {        
        var a = moment(self.payDay()).format('LL');
        self.weekRange.push(a);
        for (var i = 0; i < 48; i++) {
            a = moment(a).add(7, 'days').format('LL');
            self.weekRange().push(a);
        }
        console.log(self.weekRange());
    }


    self.getDay = function() {
        var date = self.bill.dueDate();
        date = moment(date).format('dddd');  
        console.log(date);    
        self.bill.dayDue(date);
    }

    self.resetForm = function () {
        self.bill.name(" ")
        self.bill.dueDate("2017-01-01")
        self.bill.amount(" ");
    }
}

ko.applyBindings(new ViewModel());