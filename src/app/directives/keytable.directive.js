(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3KeyTable', keytable)
    .controller('KeyTableController', KeyTableController);

  keytable.$inject = ['$parse'];
  function keytable($parse) {
    var directive = {
      require          : '^ngModel',
      restrict         : 'EA',
      replace          : true,
      bindToController : true,
      controller       : 'KeyTableController',
      controllerAs     : 'keytable',
      templateUrl      : 'directives/keytable.html',
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      // get the value of the `ng-model` attribute
      scope.keytable.heading = attrs.heading;
      scope.keytable._onChange = $parse(attrs.ngChange);

      var variable = attrs.ngModel;
      scope.$watch(variable, function(model) {
        scope.keytable.reset(model);
      });
    }
  }

  KeyTableController.$inject = ['$scope'];
  function KeyTableController($scope) {
    // HEAD //
    var vm = this;
    vm._onChange = null;
    vm.model  = $scope.keytable.model || $scope.model || null;
    vm.rows   = [];
    vm.add    = add;
    vm.remove = remove;
    vm.change = change;
    vm.reset  = reset;

    _activate();
    
    // BODY //
    function _activate() {
      if (vm.model) {
        for (var key in vm.model) {
          add(key, vm.model[key], false);
        }
      } else {
        vm.model = {};
      }
    }

    function reset(model) {
      vm.rows = [];
      vm.model = model;
      _activate();
    }

    function add(key, value, fixed) {
      vm.rows.push({key:key, value:JSON.stringify(value), fixed:fixed===true});
    }

    function remove(j) { 
      vm.rows.splice(j,1);
      //update the scene
      for (var key in vm.model){
        if (vm.model.hasOwnProperty(key)){
          delete vm.model[key];
        }
      }
        if ( vm.rows.length == 0){
        vm._onChange($scope);
        }
        for (var i=0; i<vm.rows.length; i++) {
          var r = vm.rows[i];
          var value = r.value;
          try {
            value = JSON.parse(value);
          } catch (e) {
            // keep value as string
          }
  
          vm.model[r.key] = value;
          
          
          vm._onChange($scope);
          
        }
      
      
    }

    function change() {
      for (var key in vm.model){
        if (vm.model.hasOwnProperty(key)){
          delete vm.model[key];
        }
      }
      for (var i=0; i<vm.rows.length; i++) {
        var r = vm.rows[i];
        if (! r.key) continue;

        var value = r.value;
        try {
          value = JSON.parse(value);
        } catch (e) {
          // keep value as string
        }

        vm.model[r.key] = value;
        
        if (vm._onChange) {
          vm._onChange($scope);
        }
      }
    }
  }

})();