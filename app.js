var budgetController = (function () {



})();

var UIController = (function () {

  return {
    getInput: function(){

    }
  }

})();


var controller = (function (budgetCtrl, UICtrl) {

  var ctrlAddItem = function () {

  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', function (event) {

    if (event.keyCode === 13 || event.which) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
