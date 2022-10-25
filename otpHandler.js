const nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var {global_db} = require('./dbconfig');

//permission Provider for OTP Sending
let otpGranter = async(status)=>{
  if(status === null || status ==='Inactive')
  {
    console.log('sess_otp_not pass');
    return 200;
  }
  

  else
  return 404;
}


//send otp to user mail address
let otpSender = async(toMail,otpValue)=>{

    try{
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'kovil.software.dev@gmail.com',
              pass: '12Kovil#$',
              clientId: '408479789478-6knti1eg60irnd7fc5ho90s5794genlq.apps.googleusercontent.com',
              clientSecret: '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',
              refreshToken: '1//04F4eO6NUL2n3CgYIARAAGAQSNwF-L9IrF6stRHL3QH9yl3nWpOyBFHpeA6K1CCxklOuTSssOLmOCVdxGZkTkTr4s_-DgBtWQXtk'
            }
          });
          let mailOptions = {
            from: 'kovil.software.dev@gmail.com',
            to: toMail,
            subject: 'next-Nodemailer Project',
            text: 'Hi from your nodemailer project otp is ',
            html:`
            <div style="background-image: url("img_girl.jpg");
                 height: 100%;
                 background-position: center;
                 background-repeat: no-repeat;
                 background-size: cover;">
              <p>Your OTP:<h2>${otpValue}</h2></p>
              <p>It is valid for 30min</p>
            </div>
          `
          };

          let info = await transporter.sendMail(mailOptions,(err, data)=> {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
              return 200;
            }
        })
        
    }
    catch(err)
    {
        return 404;
    }
}

//update otp in login_global table only if otpGranter() permits
let otpUpdater = async(email_id,otp)=>{
  let G_db = await mysql.createConnection(global_db);
  try{
      let sts = await G_db.query("UPDATE GLOBAL_DEV.EMAIL_GLOBAL SET status = '"+otp+"' WHERE email_id ='"+email_id+"'",
      (err,result,fields)=>{
        if(err){
          return 404;
        }

        else
        {    
            console.log("otp updated"); 

            return 200;

        }
                                                                                  
    });  
  }
  catch(err)
   {
     return 404
   }
   finally{
         await G_db.end();
       }
}
let wipe='';

let otpWiper = (email_id)=>{
wipe= setTimeout(()=>{
    otpUpdater(email_id,'Inactive');
    },300000);
}

let stopWiper = ()=>{clearTimeout(wipe)};



module.exports = {otpSender,otpUpdater,otpGranter,otpWiper,stopWiper};
  
 
  