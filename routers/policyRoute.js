const express = require('express')
const db = require('../db.js')
const routes = express.Router()
const multer = require('multer')
const fs = require('fs')
const {PDFDocument} = require('pdf-lib')
const stripe = require('stripe')('sk_test_51LISkOD4ME8T1OhFjvD38OukkAYeydxnW3urAnNau5G4k6pHO7wlvanpAeziDKkkQwl0QSPV0KaN6BJNzmHvyRXA00wrsfzaS2')




const fileStorageEngine = multer.diskStorage({

    destination : (req, res, cb)=>{
        cb( null, './public/pdf_uploads' )
    },

    filename : (req, file, cb)=>{
        cb( null, file.originalname + '-' + Date.now()+ ".pdf");
    },

})
const pdf_upload = multer(
    {
     storage : fileStorageEngine,

     fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(pdf)$/)){        //condition 
          return  cb(new Error('Please only upload a PDF file'))
        }

        cb(undefined, true)                                              //if supported file

     }
    }
)




routes.post('/addPolicies', pdf_upload.single('files'), async (req, res) => {



    let policyid;
    let statueid;
    let devisionid;

    const statutes = JSON.parse(req.body.get)
    const statue_number = req.body.statue_number
    const statue_name = req.body.statue_name
    const program_name = req.body.program
    const category_name = req.body.catagory
    const filename = req.file.filename

    

    //inserting policy data in policies table
    await db.raw(`insert into policies (number, name, file_name, program, catagory) 
                VALUES ('${statue_number}','${statue_name}','${filename}','${program_name}','${category_name}')`
                ).then( async () => {

        console.log('policy data inserted')

    }).catch((err) => {
        console.log('error : ' + err)
        var response = {type: 'error', message: 'Values Not Inserted in Policies Table'}
        res.send(response)
        return
    })

    await db.raw(`select * from policies where number = '${statue_number}' and name = '${statue_name}' and file_name = '${filename}'`).then ((res)=>{
        policyid = res.rows[0].id  
    }).catch((err)=>{
        console.log('policy not found')
    })
    console.log('your policy id : ' + policyid)

    const statutes_array = statutes['statutes']

    for(let i = 0; i < statutes_array.length ; i++){

        //insering statutes in statutes table

        const statue_name = statutes_array[i]['name'];

        await db.raw(`insert into statutes (policy_id, name) VALUES (${policyid},'${statue_name}')`).then( (statutes_result) => {

        }).catch((error) => {
            console.log('error in statutes insertion : ' + error)
            var response = {type: 'error', message: 'Values Not Inserted in Statues Table'}
            res.send(response)
            return
        })

        await db.raw(`select * from statutes where policy_id = ${policyid} and name = '${statue_name}'`).then((res)=>{
            statueid = res.rows[0].id  
        }).catch((err)=>{
            console.log('statue not found')
        })

        //insertion in devisions table

        let devisions = statutes_array[i]['devisions']
        console.log('your statute ID : ' + statueid)

        for(let j = 0; j < devisions.length; j++){

            const devision_name = devisions[j].name

            await db.raw(`insert into devisions (statue_id, name) VALUES (${statueid},'${devision_name}')`).then( (devision_result) => {

            }).catch((err) => {
                console.log('error in devision insertion : ' + err)

                var response = {type: 'error', message: 'Values Not Inserted in Devisions Table'}

                res.send(response)
                return
            })

            db.raw(`select * from devisions where statue_id = ${statueid} and name = '${devision_name}'`).then((res)=>{
                devisionid = res.rows[0].id
            }).catch((err)=>{
                console.log('devision not found')
            })

            console.log('your devision id : ' + devisionid)
        }


    }
    console.log('values submitted sucessfully in database')
    res.render('admin',{
        user_name : req.session.name,
        mess : 'Values Submitted Sucessfully'
    })

})


routes.get('/addPolicies', (req, res) => {
    if(req.session.already_logged === "true"){
        res.render('admin',{
            user_name : req.session.name,
            mess : 'Values Submitted Sucessfully'
        })
    }
    else {
        res.render('login')
    }
})


routes.post('/stripe_process', async (req, res) => {

    console.log(req.body);
    try {
        var name = req.body.fname + " " + req.body.lname;
        var amount = 2000;
        stripe.customers.create({
            name: name,
            email: req.body.email,
            address: {"city": req.body.city, "country": req.body.country, "line1": req.body.street, "line2": req.body.address, "postal_code": "", "state": req.body.state},
            source: req.body.stripeToken
        }).then(customer => stripe.charges.create({
                amount: amount * 100,
                currency: 'usd',
                customer: customer.id,
                description: 'Amount has been paid successfully.'
            })).then(() => {

            
            db.raw(`update users set is_paid = '1' where id = ${req.session.loginid}`).then((result) => {
                // let returningid = result[0].id
                // mainID = returningid
                console.log('amount paid successfully')
                req.session.is_paid = '1'
                res.render('view-policy', {
                    user_name : req.session.name
                })

            }).catch((err) => {
                console.log(err)
                res.render('plan', {
                    error: err.massage,
                    name: req.session.name
                })
            });

        })
    } catch (err) {
        res.send(err)
    }

}) 

routes.get('/view-policies', () => {
    if (req.session.loginid !== undefined) {
        res.render('view-policy', {
            user_name : req.session.name,
            filepath : req.session.filepath
        })
    } else {
        res.redirect('/login')
    }

})

routes.get('/loadPolicies', (req, page_res) => {
    
        db.raw('select json_agg(j) from (' +
        'select ' +
        'policies.id, ' +
        'policies.number,' +
        'policies.name,' +
        'policies.file_name,' +
        'policies.program,' +
        'policies.catagory,' +
        'json_agg(json_build_object(\'name\',statutes.name,\'id\',statutes.id,\'devisions\',D.devision_name)) AS statutes  ' +
        '   from policies ' +
        '   join statutes on policies.id = statutes.policy_id ' +
        '    join (select json_agg(json_build_object(\'name\', name)) devision_name,devisions.statue_id from devisions group by devisions.statue_id  )D' +
        '   on statutes.id = D.statue_id' +
        '           GROUP BY policies.id' +
        ') j').then((res) => {

    page_res.send(res.rows[0].json_agg)
    });
})

routes.get('/downloadPdf/:policyId',  async (req, res) => {
    let policyId = req.params.policyId

    await db.raw(`select * from policies where id = ${policyId}`).then((result) => {
        let file_name = result.rows[0].file_name
        console.log('filepath =' + file_name)
        const path = require('path');
        var path1= path.join(__dirname, '../public/pdf_uploads/'+ file_name);
        console.log(path1);

        res.download(path1, (err) => {
            console.log('error :' + err.massage)
        })
        console.log('file downloaded successfully')
        res.redirect('back')
    }).catch((err) => {
        console.log('fetchError: ' + err)
    })


})

routes.get('/download', (req, res) => {
    if (req.session.loginid !== undefined) {

        if (req.session.is_paid == '1' || req.session.is_paid === '1') {
            res.render('view-policy', {
                user_name: req.session.name
            })
        } else {
            res.render('download-policies-disabled', {
                user_name: req.session.name
            })
        }
    } else {
        res.redirect('/login')
    }
})



module.exports = routes