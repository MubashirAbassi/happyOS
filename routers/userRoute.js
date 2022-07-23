const express = require('express')
const db = require('../db.js')
const routes = express.Router()
const nodemailer = require('nodemailer')
const multer = require('multer')
const fs = require('fs')


//file upload
const fileStorageEngine = multer.diskStorage({

    destination : (req, res, cb)=>{
        cb( null, './public/uploads')
    },

    filename : (req, file, cb)=>{
        cb( null , file.originalname + Date.now( ))
    },

})
const upload = multer(
    {
     storage : fileStorageEngine,
     limits : {
        fileSize : 2000000
     },
     fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(pdf)$/)){        //condition 
          return  cb(new Error('Please only upload a PDF file'))
        }

        cb(undefined, true)                                              //if supported file

     }
    }
)



//sending emails
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abbasi.snooker@gmail.com',
      pass: 'ndsdkcvfaljfkslo'
    }
  });


routes.get('',(req, res)=>{
    if(req.session.already_logged == 'true' && req.session.is_admin === 'true'){
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else if(req.session.already_logged == 'true' && req.session.is_admin === 'false'){
        res.render('need',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else if(req.session.already_logged == 'false' || req.session.already_logged == undefined){
        res.render('intro')
    }
})

routes.get('/signup',(req, res)=>{ 
    if(req.session.already_logged == 'true'){
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath           
        })
    }
    else if(req.session.already_logged == 'false' || req.session.already_logged == undefined){
        res.render('signup')
    }
})

routes.get('/admin',(req, res)=>{
    console.log('already logged' + req.session.already_logged)
    console.log( 'is admin' + req.session.is_admin)

    if(req.session.already_logged === "true"  && req.session.is_admin === 'true'){
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else if (req.session.already_logged === "true"  && req.session.is_admin === 'false') {
        res.render('need',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else if (req.session.already_logged === "true"  && req.session.is_admin === undefined) {
        res.render('view-policy',{
            user_name : req.session.name,
            filepath : req.session.filepath,
            success_msg : 'File downloaded Successfully'

        })
    }
    else {
        res.render('login')
    }
})





routes.get('/register-signup',(req, res)=>{
    if(req.session.already_logged == 'true'){
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else if(req.session.already_logged == 'false' || req.session.already_logged == undefined){
        res.render('register-signup')
    }  
})

routes.get('/register-signup/:email',(req, res)=>{
    const email = req.params.email
    res.render('register-signup',{
        email : email
    })
})



routes.post('/signup',(req, res)=>{
    const { email }= req.body

    var mailOptions = {
        from: 'Happy OS',
        to: `${email}`,
        subject: 'Complete SignUp',
        text: 'Hi,',
        html : `<h1>Welcome</h1><p>kindly complete your signup process by clicking below link</p><a href = "http://localhost:3000/register-signup/${email}"> Click here to complete signup </a>`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (!error) {

            console.log('Email sent: ' + info.response);
            db.raw(`insert into users (email) values ('${email}')`).then((result)=>{
                res.render('signup',{
                    msg : `A link has been sent to : ${email} for further procedures`,
                    email : email
                })    
        
            }).catch((err)=>{
                res.render('signup',{
                    errorMsg : 'Email is already taken. Please try another one!'
                })
                console.log('Error : ', err)
            })
        } else {
          console.log(error);
        }
      });  
})



routes.post('/signup2',  upload.single('image') ,(req, res)=>{
    const {org_name, address, city, state, zipcode, country_code, company_phone_number, first_name, title, last_name,
         coun_code, contact_phone_number, email, confirm_email, user_name, password, confirm_password, policy_check } = req.body;
        const filepath = req.file.path.replace('public','')
         if(policy_check == 'on'){
            db.raw(`update users
            SET 
                org_name = '${org_name}',
                address = '${address}',
                city = '${city}',
                state = '${state}',
                zipcode = ${zipcode},
                country_code = ${country_code},
                company_phone_number = '${company_phone_number}',
                first_name = '${first_name}',
                title = '${title}',
                last_name = '${last_name}',
                coun_code = ${coun_code},
                contact_phone_number = '${contact_phone_number}',
                email = '${email}',
                confirm_email = '${confirm_email}',
                user_name = '${user_name}',
                password = '${password}',
                confirm_password = '${confirm_password}',
                agree_policies = '${policy_check}',
                filepath = '${filepath}'

                WHERE email = '${email}'
                `).then((result)=>{
                    console.log('values submitted and updated sucessfully')
                    console.log('file saved to uploads')
                    res.render('admin',{
                        user_name : user_name,
                        filepath : filepath
                    })
                        }).catch((err)=>{
                            console.log('Error : ',err)
                        })
                    }
                else{
                    res.render('register-signup',{
                        signup_error : 'Please accept our Terms and Conditions to proceed',
                        org_name : org_name,
                        address : address,
                        city : city,
                        state : state,
                        zipcode : zipcode,
                        country_code : country_code,
                        company_phone_number : company_phone_number,
                        first_name : first_name,
                        title : title,
                        last_name : last_name,
                        coun_code : coun_code,
                        contact_phone_number : contact_phone_number,
                        email : email,
                        confirm_email : confirm_email,
                        user_name : user_name,
                        password : password,
                        confirm_password : confirm_password,
                    })
                }
    
})



routes.post('/edit_profile_pic', upload.single('image'), (req, res)=>{

    //deleting old file

    let filepath = req.session.filepath
    let user = req.session.name
    fs.unlink('public' + filepath ,(err)=>{                  //using fs module to delete old file from disk storage
        if(err){
            console.log(err)
        } else {
            console.log('old file deleted successfully')
        }
    })

    //updating new file that is added


    filepath = req.file.path.replace('public','')    // removing public from path to be stored in database
    req.session.filepath = filepath        //updating session variable

    db.raw(`update users SET filepath = '${filepath}' where user_name = '${user}' OR email = '${user}'`).then((result)=>{
        console.log('Profile Picture changed sucessfully')
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    })
},(err, req, res, next)=>{                             //for handling multer or middlewire errors
    if(err.message == 'File too large'){
        err.message = 'Image should be less then 2MB'
    }
    res.render('admin',{
        fileError : err.message,
        filepath : req.session.filepath,
        user_name : req.session.name      
    })
})



routes.get('/login',(req, res)=>{
    if(req.session.already_logged === "true"  && req.session.is_admin === 'true'){
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else if (req.session.already_logged === "true"  && req.session.is_admin === 'false') {
        res.render('need',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
    else {
        res.render('login')
    }
})

routes.post('/admin',(req, res)=>{
    const {email_user_name, password} = req.body
    db.raw(`select * from users where email = '${email_user_name}' OR user_name = '${email_user_name}'`).then((result)=>{
        if(result.rows[0] == undefined){
            res.render('login',{
                error : 'Credentials donot match. Try Again!'
            })
        }
        else if (result.rows[0].password == password) {

                console.log('User Logged in')
                req.session.already_logged = 'true'
                req.session.name = email_user_name
                req.session.loginid = result.rows[0].id
                req.session.filepath = result.rows[0].filepath

                if(email_user_name == 'admin' && password == 'admin123'){
                    req.session.is_admin = 'ture'
                    res.render('admin',{
                        user_name : result.rows[0].user_name,
                        filepath : result.rows[0].filepath
                    })
                }
                else if(result.rows[0].is_paid == '1' || result.rows[0].is_paid === '1'){
                    res.render('view-policy',{
                        user_name : result.rows[0].user_name,
                        filepath : result.rows[0].filepath
                    })
                }
                else {
                    res.render('need',{
                        user_name : result.rows[0].user_name,
                        filepath : result.rows[0].filepath
                    })  
                }


        }
        else {
            res.render('login',{
                error : 'Wrong Password!',
                name : email_user_name,
                password : password
            })           
        }
        
    }).catch((err)=>{       
        console.log('Error : ',err)
        res.render('login',{
            error : 'Wrong Input, Please try Again!',
            name : email_user_name,
            password : password
        })
    })
})

routes.get('/plan', (req, res) => {
    if(req.session.already_logged === "true"){
        console.log('plan page randered')
        res.render('plan',{
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    }
})


routes.get('/forget_pass',(req, res)=>{
    if(req.session.already_logged === "true"){
        res.render('admin',{
            user_name : req.session.name,
            filepath : req.session.filepath

        })
    }
    else {
        res.render('forget-pass',{
            title : 'Reset password'
        })
    }
})

routes.get('/forget_pass/reset',(req, res)=>{

        res.render('forget-pass',{
            title : 'Reset password'
        })
    
})


routes.post('/forget_pass_2',(req, res)=>{
    const { email }= req.body
    db.raw(`select * from users where email = '${email}'`).then((result)=>{
        if(result.rows[0] != undefined && result.rows[0].email == email){

            var mailOptions = {
            from: 'Happy OS',
            to: `${email}`,
            subject: 'Reset Password',
            text: 'Hi,',
            html : `<h1>Welcome</h1><p>kindly reset your Password by clicking the link below,</p><a href = "http://localhost:3000/forget-pass-2/${email}"> Click here to Reset your Password </a>`
            };

              transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                    res.render('forget-pass',{
                        mail_msg : `Link has been sent to ${email} to RESET the Password`
                    })
                } else {
                  console.log(error);
                }
              });

        }
        else {
            res.render('forget-pass',{
                mail_error : `(${email}) not found in database`,
                email : email
            })
        }
        
    }).catch((err)=>{
        console.log('Error :', err)
    })
 
})



routes.get('/forget-pass-2/:email',(req, res)=>{
    if(req.session.already_logged === "true"){
        res.render('admin')
    }
    else {
        const email = req.params.email
        res.render('forget-pass-2',{
            email : email
        })
    }

})


routes.post('/forget-pass-2/reset',(req, res)=>{
    const{email, password, confirm_password} = req.body
        if(password == confirm_password){
            db.raw(`update users Set 
                    password = '${password}',
                    confirm_password = '${confirm_password}'
                    WHERE email = '${email}'
                    `).then((result)=>{
                        console.log('Password reset successfully')
                        res.render('login',{
                            resetMsg : 'Password Reset Successful'
                        })
                    }).catch((err)=>{
                        console.log('Error :', err)
                    })
        } 
        else{
 
            console.log('Password and Confirm_password Should be same, Try again')

            res.render('forget-pass-2',{
                email : email,
                resetError : 'Password and Confirm_password Should be same, Try again!'
            })
        }  
})



routes.get('/logout',(req, res)=>{
    console.log('user logged out')
    req.session.already_logged = 'false'
    req.session.filepath = ''
    req.session.is_admin = 'false'
    req.session.is_paid = '0'
    res.render('login',{
        logoutMsg : 'Logout Successful'
    })
})


module.exports = routes;











 