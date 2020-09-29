const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt  = require('bcryptjs');
const app = express();
const port  = 1000 || process.env.Port
const User = require('./Model/User');

mongoose.Promise = global.Promise
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('useCreateIndex', true);


mongoose.connect('mongodb://localhost:27017/Authenticate', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection
 .once('open', ()=>console.log('Connected'))
 .on('error', ()=>console.log('Error'));

 app.get('/', (req, res)=>{
     res.send('WELCOME TO AUTHENTICATE')
 })



//  Registering
 app.post('/register', (req,res)=>{
    // Generating hash password using bcryptjs
   bcrypt.genSalt(10, (err, salt)=>{
       bcrypt.hash(req.body.password, salt, (err, hash)=>{
           if(err) throw err

        
           newUser = new User(
            {
            fullname: req.body.fullname,
            email: req.body.email,
            password: hash
            }
        )
         newUser.save()
         .then(response=>{
             console.log(`Registerd: ${response}`);
             res.send(`Registered: ${req.body.fullname}`);
         })
         .catch(err=>{
             console.log(`Error caused by: ${err}`);
             res.status(404).send(`Error caused by: ${err}`)
         })
           
       })
   })

 })



// Login -- 
app.post('/login', (req, res)=>{

    User.findOne({email: req.body.email})
    .then(user=>{
        if(!user){
            console.log(`Email not recognised`);
            res.send(`Email not recognised`);
        }else{
            console.log(`Email: ${user.email} | Pass: ${user.password}`);
            bcrypt.compare(req.body.password,  user.password,  (err, matched)=>{
                if(err) return err;

                if(matched){
                    res.send(`Logged In Successfully! as : ${user.email}`);
                    console.log(`Logged In Successfully! as : ${user.email}`);
                }else{
                    res.send(`Invalid Password | ${user.email}`);
                    console.log(`Invalid Password | ${user.email}`);
                }
            })
        }
        
    })
    .catch(err=>{
        console.log(`Error caused by: ${err}`);
        res.send(`Error caused by: ${err}`);
    })
})

// Find all users
 app.get('/users', (req, res)=>{
     User.find()
      .then(users=>{
          console.log(users);
        //   res.send(users);
          users.forEach( user=>{
              res.send(`${user.fullname} | ${user.email}`)
          })
      })
      .catch(err=>{
          console.log(err);
          res.status(404).send(err)
      })
 })


// updating users
app.patch('/users/:id/edit', (req, res)=>{

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            if(err) return err;

            User. findOneAndUpdate(
                {_id: req.params.id},
                {$set:
                    {
                    password: hash
                    }
                }     
            )
             .then(response=>{
                 console.log(`Response: ${response}`)
             })
             .catch(err=>{
                 console.log(`Error: ${err}`)
             })

        })
    })

    
})


app.listen(port, ()=>{
    console.log(`Listening to Port - ${port}`)
})