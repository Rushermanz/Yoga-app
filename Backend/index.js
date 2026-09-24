
 
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const stripe = require('stripe')('sk_test_51Q19vOL0hwv53RFqDDuFA6AT9trVnF29iJ7DkBoy1BNfd1j2eR4aJlGRXc3ZNXmyJfHZ0lT531wkZ5QurE1gV0J900IOgSbURA');

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.ACCESS_SECRET || 'c914bfba5241fa02c6bdf3b5e43a6d96e5e8e82ef62b95c0c97825d10d65b796';

// Routes
// SET TOKEN .
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
      return res.status(401).send({ error: true, message: 'Unauthorize access' })
  }
  const token = authorization?.split(' ')[1]
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).send({ error: true, message: 'forbidden user or token has expired' })
      }
      req.decoded = decoded;
      next()
  })
}


// MongoDB connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI || 
  (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD ? 
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.cbyvkrs.mongodb.net/yoga-master?retryWrites=true&w=majority` :
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cbyvkrs.mongodb.net/yoga-master?retryWrites=true&w=majority`
  );

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect asynchronously so routes are immediately registered
    client.connect()
      .then(async () => {
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      })
      .catch((err) => {
        console.warn("MongoDB connection warning:", err.message);
        console.warn("If you see SSL alert 80, please ensure your IP address is whitelisted in MongoDB Atlas Network Access.");
      });

    // Create a database and collections
    const database = client.db("yoga-master");
    const classesCollection = database.collection("classes");
    const userCollection = database.collection("users");
    const cartCollection = database.collection("cart");
    const enrolledCollection = database.collection("enrolled");
    const paymentCollection = database.collection("payments");
    const appliedCollection = database.collection("applied");


    
        // Verify admin
        const verifyAdmin = async (req, res, next) => {
          const email = req.decoded.email;
          const query = { email: email };
          const user = await userCollection.findOne(query);
          if (user.role === 'admin') {
              next()
          }
          else {
              return res.status(401).send({ error: true, message: 'Unauthorize access' })
          }
      }

      const verifyInstructor = async (req, res, next) => {
          const email = req.decoded.email;
          const query = { email: email };
          const user = await userCollection.findOne(query);
          if (user.role === 'instructor' || user.role === 'admin') {
              next()
          }
          else {
              return res.status(401).send({ error: true, message: 'Unauthorize access' })
          }
      }


    
    app.post('/new-user', async (req, res) => {
      const newUser = req.body;

      const result = await userCollection.insertOne(newUser);
      res.send(result);
  })

  app.post('/api/set-token', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
    res.send({ token })
})

// GET ALL USERS
app.get('/users', async (req, res) => {
  const users = await userCollection.find({}).toArray();
  res.send(users);
})
// GET USER BY ID
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const user = await userCollection.findOne(query);
    res.send(user);
})
// GET USER BY EMAIL
app.get('/user/:email', verifyJWT, async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await userCollection.findOne(query);
    res.send(result);
})
// Delete a user

app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
})
// UPDATE USER
app.put('/update-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.option,
            address: updatedUser.address,
            phone: updatedUser.phone,
            about: updatedUser.about,
            photoUrl: updatedUser.photoUrl,
            skills: updatedUser.skills ? updatedUser.skills : null,
        }
    }
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.send(result);
})



    // ! CLASSES ROUTES

    app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      // newClass.availableSeats = parseInt(newClass.availableSeats)
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    //get classes by instructor email address
    app.get("/classes/:email", verifyJWT, verifyInstructor, async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    //manage classes
    app.get("/classes-manage", async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    //update classes status and reason
    app.put("/change-status/:id", verifyJWT, verifyInstructor, async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
          reason: reason,
        },
      };
      const result = await classesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //get approved class
    app.get("/approved-classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    //get single class details
    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.findOne(query);
      res.send(result);
    });

    //update classes details (all data)
    app.put("/update-class/:id", verifyJWT, verifyInstructor, async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: "pending",
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //cart Routes !----------
    app.post('/add-to-cart', verifyJWT, async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);

    });

    //get cart item by id
    app.get('/cart-item/:id', verifyJWT, async (req, res) =>{
      console.log(req.params);
      
      const id = req.params.id;
      const email = req.query.email;;

      console.log(email,"email");
      console.log(id,"id");
      
      const query = {
        classId: id,
        userMail: email
      };
      const projection = {classId: 1 };
      const result = await cartCollection.findOne(query, {projection: projection});

      console.log(result);
      
      res.send(result);
    });


    //cart info by user mail
    app.get('/cart/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const projection = { classId: 1 };
      const carts = await cartCollection.find(query, { projection: projection }).toArray();
      const classIds = carts.map(cart => new ObjectId(cart.classId));
      const query2 = { _id: { $in: classIds } };
      const result = await classesCollection.find(query2).toArray();
      res.send(result);
  });

  //delete cart items
  app.delete('/delete-cart-items/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const query = { classId: id };
    const result = await cartCollection.deleteOne(query);
    res.send(result);
  });   


  //Payment Routes
  app.post('/create-payment-intent',verifyJWT, async (req, res) => {
    console.log(verifyJWT,"token");
    console.log(req.body);
    
    
    const { price } = req.body;
    const amount = parseInt(price) * 100;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
})



        // POST PAYMENT INFO 
        app.post('/payment-info', async (req, res) => {
          const paymentInfo = req.body;
          const classesId = paymentInfo.classesId;
          const userEmail = paymentInfo.userEmail;
          const singleClassId = req.query.classId;
          let query;
          // const query = { classId: { $in: classesId } };
          if (singleClassId) {
              query = { classId: singleClassId, userMail: userEmail };
          } else {
              query = { classId: { $in: classesId } };
          }
          const classesQuery = { _id: { $in: classesId.map(id => new ObjectId(id)) } }
          const classes = await classesCollection.find(classesQuery).toArray();
          const newEnrolledData = {
              userEmail: userEmail,
              classesId: classesId.map(id => new ObjectId(id)),
              transactionId: paymentInfo.transactionId,
          }
          const updatedDoc = {
              $set: {
                  totalEnrolled: classes.reduce((total, current) => total + current.totalEnrolled, 0) + 1 || 0,
                  availableSeats: classes.reduce((total, current) => total + current.availableSeats, 0) - 1 || 0,
              }
          }
          // const updatedInstructor = await userCollection.find()
          const updatedResult = await classesCollection.updateMany(classesQuery, updatedDoc, { upsert: true });
          const enrolledResult = await enrolledCollection.insertOne(newEnrolledData);
          const deletedResult = await cartCollection.deleteMany(query);
          const paymentResult = await paymentCollection.insertOne(paymentInfo);
          res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
      })

      
      app.get('/payment-history/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const result = await paymentCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);
    })


    app.get('/payment-history-length/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const total = await paymentCollection.countDocuments(query);
        res.send({ total });
    })

     // ! ENROLLED ROUTES

     app.get('/popular_classes', async (req, res) => {
      const result = await classesCollection.find().sort({ totalEnrolled: -1 }).limit(6).toArray();
      res.send(result);
  })


  app.get('/popular-instructors', async (req, res) => {
    const pipeline = [
        {
            $group: {
                _id: "$instructorEmail",
                totalEnrolled: { $sum: "$totalEnrolled" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "email",
                as: "instructor"
            }
        },
        {
          $match: {
            "instructor.role": "instructor",
          }
        },
        {
          $project: {
              _id: 0,
              instructor: {
                  $arrayElemAt: ["$instructor", 0]
              },
              totalEnrolled: 1
          }
      },
      {
          $sort: {
              totalEnrolled: -1
          }
      },
      {
          $limit: 6
      }
    ];

    const result = await classesCollection.aggregate(pipeline).toArray();
    console.log("After lookup: ", result);
    res.send(result);
});




  
        // Admins stats 
        app.get('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
          // Get approved classes and pending classes and instructors 
          const approvedClasses = (await classesCollection.find({ status: 'approved' }).toArray()).length;
          const pendingClasses = (await classesCollection.find({ status: 'pending' }).toArray()).length;
          const instructors = (await userCollection.find({ role: 'instructor' }).toArray()).length;
          const totalClasses = (await classesCollection.find().toArray()).length;
          const totalEnrolled = (await enrolledCollection.find().toArray()).length;
          // const totalRevenue = await paymentCollection.find().toArray();
          // const totalRevenueAmount = totalRevenue.reduce((total, current) => total + parseInt(current.price), 0);
          const result = {
              approvedClasses,
              pendingClasses,
              instructors,
              totalClasses,
              totalEnrolled,
              // totalRevenueAmount
          }
          res.send(result);

      })

              // !GET ALL INSTrUCTOR  

              app.get('/instructors', async (req, res) => {
                const result = await userCollection.find({ role: 'instructor' }).toArray();
                res.send(result);
            })
    
    
    
    
            app.get('/enrolled-classes/:email', verifyJWT, async (req, res) => {
                const email = req.params.email;
                const query = { userEmail: email };
                const pipeline = [
                    {
                        $match: query
                    },
                    {
                        $lookup: {
                            from: "classes",
                            localField: "classesId",
                            foreignField: "_id",
                            as: "classes"
                        }
                    },
                    {
                        $unwind: "$classes"
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "classes.instructorEmail",
                            foreignField: "email",
                            as: "instructor"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            classes: 1,
                            instructor: {
                                $arrayElemAt: ["$instructor", 0]
                            }
                        }
                    }
    
                ]
                
                const result = await enrolledCollection.aggregate(pipeline).toArray();
                console.log(result);
                // const result = await enrolledCollection.find(query).toArray();
                res.send(result);
            }) 
            
            
            
            // Applied route 
            app.post('/as-instructor', async (req, res) => {
                const data = req.body;
                const result = await appliedCollection.insertOne(data);
                res.send(result);
            })
            app.get('/applied-instructors/:email',   async (req, res) => {
                const email = req.params.email;
                const result = await appliedCollection.findOne({email});
                res.send(result);
            });
  



    // All routes successfully initialized
  } catch (err) {
    console.error("Error setting up routes:", err);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Hello 20!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
