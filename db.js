const Sequelize=require('sequelize')
var db;
if(process.env.DATABASE_URL){
db=new Sequelize(process.env.DATABASE_URL,{
    dialect:'postgres',
    protocol:'postgres',
    logging:false
})
}

else{
    db=new Sequelize('paymentDB','paymentDB','paymentDB',{
        host:'localhost',
        dialect:'mysql',
        pool:{
            max:5,
            min:5
        },
       
    })
    }

const customers=db.define('customers',{
    merchantRefNo:{
        type:Sequelize.DataTypes.STRING,
          unique:true
        },
    customerId:{
            type:Sequelize.DataTypes.STRING,
              
            },
   singleUseToken:{
        type:Sequelize.DataTypes.STRING,
        
                },
    tokenexpiryTime:{
        type:Sequelize.DataTypes.STRING
    }
})

db.sync()
.then(()=>{
    console.log("db started")
})
.catch((err)=>{
console.log(err)
})
exports=module.exports={
    customers
}