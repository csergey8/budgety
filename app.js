var budgetController = (function () {
  //contsructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {

    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPerentage = function () {
    return this.percentage;
  }

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Creat new item
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      }

      //Push it into our data structure
      data.allItems[type].push(newItem);
      //Return new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var index, ids;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      calculateTotal('exp');
      calculateTotal('inc');

      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {

      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPerentages: function () {

      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPerentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function () {
      console.log(data);
    }
  };


})();

var UIController = (function () {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLaber: '.budget__expenses--value',
    percentageLaber: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item_percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function (num, type) {
    var numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }


    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };


  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //get inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };

    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //Create html string
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace the placeholder text with some actual
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      //Insert html in DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expensesLaber).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLaber).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLaber).textContent = '---';
      }
    },

    displayPercentages: function (percentages) {

      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);


      nodeListForEach(fields, function (current, index) {

        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });

    },

    displayMonth: function () {
      var now, year, month, months;

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();

      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;

    },

    changedType: function () {

      var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

    },

    getDOMStrings: function () {
      return DOMStrings;
    }
  };

})();


var controller = (function (budgetCtrl, UICtrl) {

  var setupListeners = function () {
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {

      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  }

  var updateBudget = function () {
    budgetCtrl.calculateBudget();

    var budget = budgetCtrl.getBudget();

    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {

    budgetCtrl.calculatePercentages();

    var percentages = budgetCtrl.getPerentages();

    UICtrl.displayPercentages(percentages);

  };

  var ctrlAddItem = function () {
    var input, newItem;
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      UICtrl.addListItem(newItem, input.type);

      UICtrl.clearFields();

      updateBudget();

      updatePercentages();
    }

  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0].slice(0, 3);
      ID = parseInt(splitID[1]);

      budgetCtrl.deleteItem(type, ID);

      UICtrl.deleteListItem(itemID);

      updateBudget();

      updatePercentages();

    }

  }

  return {
    init: function () {
      setupListeners();
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  }


})(budgetController, UIController);

controller.init();
