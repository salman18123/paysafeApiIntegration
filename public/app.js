var myapp=angular.module('paymentapp',['ngRoute']);
myapp.controller('paymentcontroller',['$location','$http',function($location,$http){  
 var main=this;
 this.checkouts=function(){
     console.log(main.customerId)
     console.log(main.customerName)
     console.log(main.customerMail)
     console.log(main.customerAmount)
 }
 this.checkout=function(){
     var output;
     var customer
    (async () => {
        output = await fetch('/api/customers/'+main.customerId);
        customer = await output.json(customer);
        console.log(customer)

        
        var input={
            "currency": "USD",
            "amount": main.customerAmount*100,
         //"singleUseCustomerToken":"SPwK56jsdzDwpVN8",
            
            "locale": "en_US",
            "customer": {
                "firstName": main.customerName,
                "lastName": "Dee",
                "email": main.customerMail,
                "phone": "1234567890",
                "dateOfBirth": {
                    "day": 1,
                    "month": 7,
                    "year": 1990
                }
            },
            "billingAddress": {
                "nickName": "John Dee",
                "street": "20735 Stevens Creek Blvd",
                "street2": "Montessori",
                "city": "Cupertino",
                "zip": "95014",
                "country": "US",
                "state": "CA"
            },
            "environment": "TEST",
            "merchantRefNum": main.customerId,
            "canEditAmount": true,
            "merchantDescriptor": {   
                "dynamicDescriptor": "XYZ",
                "phone": "1234567890"
                },
            "displayPaymentMethods":["card"],
            "paymentMethodDetails": {
                "paysafecard": {
                    "consumerId": "1232323"
                }
                
               
            }
        }
        if(customer.data!='NO_RECORD_EXISTS'){
            input.singleUseCustomerToken=customer.data
            console.log(input)
            }
            else{
                console.log("no record")
            }
        paysafe.checkout.setup(main.apikey, input, function(instance, error, result) {
            if (result && result.paymentHandleToken) {
                console.log(result.paymentHandleToken);
                console.log("hello")
                console.log(instance)
                console.log(result)
                instance.showSuccessScreen()
                var  requestdata= {  
                "merchantRefNum": main.customerId, 
                "amount": main.customerAmount*100, 
                "currencyCode": "USD", 
                "dupCheck": false, 
                "settleWithAuth": true,
                "paymentHandleToken": result.paymentHandleToken, 
                "customerIp": "10.10.12.64", 
                "description": "Donation purpose"
            }
            if(result.customerOperation=='ADD'){
                if(customer.data=='NO_RECORD_EXISTS'){
                requestdata.merchantCustomerId=main.customerId  
                }
                else{
                    requestdata.customerId= customer.customerId
                }
               
               
            }
            
            console.log(requestdata)
            $http.post('/api/payment',requestdata)
            .then((response)=>{
            console.log(response)
            })
            } else {
                console.error(error);
                console.log("error came")
                // Handle the error
            }
        }, function(stage, expired) {
            switch(stage) {
                case "PAYMENT_HANDLE_NOT_CREATED": // Handle the scenario
                case "PAYMENT_HANDLE_CREATED": // Handle the scenario
                case "PAYMENT_HANDLE_REDIRECT": // Handle the scenario
                case "PAYMENT_HANDLE_PAYABLE": // Handle the scenario
                default: // Handle the scenario
            }
        });
        
      })();
      console.log(output)
     
    

 }
 this.apikey="cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ="

 }


])