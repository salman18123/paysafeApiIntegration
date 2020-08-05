myapp.config(['$routeProvider',function($routeProvider){
    $routeProvider
    
    .when('/',{
      
        templateUrl:'views/paymentview.html',
        controller:'paymentcontroller',
        controllerAs:'payment'
    })
   
  
    
    
    }])