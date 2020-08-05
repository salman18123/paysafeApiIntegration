const route=require('express').Router()
var request = require('request');
const config=require('./config')
const customersDB=require('./db').customers
let makeReq = request.defaults({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': config.apikey64,
        'Simulator': 'EXTERNAL'
      }
});
route.post('/payment',(req,res)=>{
   
    var ans;
    var requestData={
            "merchantRefNum":req.body.merchantRefNum,
            "paymentTypes":["CARD"]
        }
    makeReq({
        method: 'POST',
        url: config.paymentApi,
       
        body:JSON.stringify(req.body)
      }, function (error, response, body) {
        
        if(error){
            res.send({error:error})
        }
        if(req.body.merchantCustomerId || req.body.customerId){
        ans=JSON.parse(body)
        
        var paysafeCustomerId=ans.customerId
        
        console.log(paysafeCustomerId)
        if(req.body.merchantCustomerId){
        generateNewToken(paysafeCustomerId,req.body.merchantRefNum,'new',res)
        res.send({data:"success"})
        }
        else{
            generateNewToken(req.body.customerId,req.body.merchantRefNum,'existing',res)   
        }
        }
        // res.send({data:"success"})
      });
      

})

route.get('/customers/:merchantRefNo',(req,res)=>{
    customersDB.findAll({
        where:{
            merchantRefNo:req.params.merchantRefNo
        }
    })
    .then((data)=>{
        if(data[0]){
            
            const expirytokentime=data[0].tokenexpiryTime;
            console.log(data[0].merchantRefNo)
            console.log(expirytokentime)
            var date = new Date();
            var ctime=date.getTime()
            if((expirytokentime-ctime)>0){
                res.send({data:data[0].singleUseToken,customerId:data[0].customerId})
            }
            else{
                
            
            generateNewToken(data[0].customerId,data[0].merchantRefNo,'existing',res)
    
       
            }
        }
        else{
            res.send({data:'NO_RECORD_EXISTS'})
        }
    })
})
route.get('/customers',(req,res)=>{
customersDB.findAll()
.then((data)=>{
    res.send({data:data})
})
})
function generateNewToken(customerId,merchantRefNo,value,res){
    
    var tokenData={
        "merchantRefNum":merchantRefNo,
        "paymentTypes":["CARD"]
    }
    makeReq({
        method: 'POST',
        url: config.customerCreateApi+customerId+'/singleusecustomertokens',
       
        body:JSON.stringify(tokenData)
      }, function (error, response, body) {
          if(error){
              res.send({error:error})
          }

        var resp_single_token=JSON.parse(body)
        var singleUseToken=resp_single_token.singleUseCustomerToken
        console.log(singleUseToken)
        var date = new Date();
        var expiryTime=date.getTime()+14*60000;
        console.log(expiryTime)
        console.log(date.getTime());
        if(value=='new'){
            customersDB.create({
                merchantRefNo:merchantRefNo,
                customerId:customerId,
                singleUseToken:singleUseToken,
                tokenexpiryTime:expiryTime
            })
            .then((data)=>{
                if(data){
                    console.log("new data created")
                     }
            }) 
        }
        else{
            customersDB.update({
                singleUseToken:singleUseToken,
                tokenexpiryTime:expiryTime
            },{where:{
                customerId:customerId
            }})
            .then((data)=>{
                console.log("record updated")
            }) 
            res.send({data:singleUseToken,customerId:customerId})
        }
        return
})
}

exports=module.exports=route