function Bill (data) {
    this.Name = ko.observable(data.name());
    this.DueDate = ko.observable(data.dueDate());
    this.Amount = ko.observable(data.amount());
}

var ViewModel = function() {
	var self = this;
  self.bill = {
  	name : ko.observable(),
    dueDate: ko.observable(),
    dayDue: ko.observable(" "),
    amount: ko.observable()
	};
  self.Bills = ko.observableArray([]);
  ;
  
  self.addBill = function() {
  	self.Bills.push(new Bill(self.bill));
    self.bill.name()
    self.bill.dueDate()
    self.bill.amount();
    console.log(self.Bills());
  }
  
  self.getDay = function() {
    var date = self.bill.dueDate();
    date = moment(date).format('dddd');  
    console.log(date);    
    self.bill.dayDue(date);
  }
}

ko.applyBindings(new ViewModel());