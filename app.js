var budgetController = (function () {



})();

var UIController = (function () {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //get inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };

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
  }



      var ctrlAddItem = function () {
        var input = UICtrl.getInput();


      };

    return {
      init: function() {
        setupListeners();
      }
    }


})(budgetController, UIController);

controller.init();
