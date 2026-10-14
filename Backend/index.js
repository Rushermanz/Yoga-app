
 
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Prevent uncaught errors from crashing the Express server
process.on('unhandledRejection', (reason) => {
  console.warn('MongoDB / Async notice:', reason && reason.message ? reason.message : reason);
});
process.on('uncaughtException', (err) => {
  console.error('Server exception caught:', err && err.message ? err.message : err);
});

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
    // Retry loop for MongoDB connection
    let retryTimer = null;
    const connectToMongo = async () => {
      try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } catch (err) {
        console.warn("MongoDB connection warning:", err.message);
        console.warn("If you see SSL alert 80, please ensure your IP address is whitelisted in MongoDB Atlas Network Access.");
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = setTimeout(connectToMongo, 10000);
      }
    };
    connectToMongo();

    // Create a database and collections
    const database = client.db("yoga-master");
    const classesCollection = database.collection("classes");
    const userCollection = database.collection("users");
    const cartCollection = database.collection("cart");
    const enrolledCollection = database.collection("enrolled");
    const paymentCollection = database.collection("payments");
    const appliedCollection = database.collection("applied");
    const reviewsCollection = database.collection("reviews");


    
        // Verify admin
        const verifyAdmin = async (req, res, next) => {
          const email = req.decoded?.email;
          if (!email) {
            return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
          }
          const query = { email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } };
          const user = await userCollection.findOne(query);
          const role = user?.role ? String(user.role).trim().toLowerCase() : '';
          if (role === 'admin') {
            next();
          } else {
            return res.status(403).send({ error: true, message: 'Forbidden: Admin access required' });
          }
        };

        const verifyInstructor = async (req, res, next) => {
          const email = req.decoded?.email;
          if (!email) {
            return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
          }
          const query = { email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } };
          const user = await userCollection.findOne(query);
          const role = user?.role ? String(user.role).trim().toLowerCase() : '';
          if (role === 'instructor' || role === 'admin') {
            next();
          } else {
            return res.status(403).send({ error: true, message: 'Forbidden: Instructor access required' });
          }
        };


    
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
    const query = { email: { $regex: new RegExp(`^${(email || '').trim()}$`, 'i') } };
    const result = await userCollection.findOne(query);
    res.send(result);
})
// Delete a user (Admin)
app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
})

// Delete Own Account (User Self-Deletion)
app.delete('/api/user/account', verifyJWT, async (req, res) => {
    try {
        const userEmail = req.decoded?.email;
        if (!userEmail) {
            return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
        }

        const emailFilter = { email: { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') } };

        // Remove user profile document
        const userDeleteResult = await userCollection.deleteOne(emailFilter);
        // Remove cart items
        await cartCollection.deleteMany({ userMail: userEmail.trim() });

        res.send({
            success: true,
            message: 'User account and profile data deleted successfully from database',
            result: userDeleteResult
        });
    } catch (err) {
        console.error("Error deleting user account:", err);
        res.status(500).send({ error: true, message: err.message });
    }
});
// UPDATE USER
app.put('/update-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const photo = updatedUser.photoUrl || updatedUser.photoURL || '';
    const updateDoc = {
        $set: {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.option ? updatedUser.option.trim().toLowerCase() : 'user',
            address: updatedUser.address || '',
            phone: updatedUser.phone || '',
            about: updatedUser.about || '',
            photoUrl: photo,
            photoURL: photo,
            skills: updatedUser.skills ? updatedUser.skills : null,
        }
    }
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.send(result);
})

    // ── ONBOARDING & RECOMMENDATIONS HELPERS & ROUTES ──────────
    const calculateBMI = (height, heightUnit, weight, weightUnit) => {
      let hInM = 0;
      let wInKg = 0;

      if (heightUnit === 'ft') {
        if (typeof height === 'object' && height !== null) {
          const ft = Number(height.ft) || 0;
          const inch = Number(height.in) || 0;
          const totalInches = ft * 12 + inch;
          hInM = totalInches * 0.0254;
        } else {
          hInM = Number(height) * 0.3048;
        }
      } else {
        hInM = Number(height) / 100;
      }

      if (weightUnit === 'lbs') {
        wInKg = Number(weight) * 0.45359237;
      } else {
        wInKg = Number(weight);
      }

      if (!hInM || hInM <= 0 || !wInKg || wInKg <= 0) {
        return { bmi: 0, bmiCategory: 'Normal weight', heightCm: 0, weightKg: 0 };
      }

      const heightCm = Math.round(hInM * 100);
      const weightKg = Math.round(wInKg * 10) / 10;
      const bmiVal = wInKg / (hInM * hInM);
      const bmi = Math.round(bmiVal * 10) / 10;

      let bmiCategory = 'Normal weight';
      if (bmi < 18.5) bmiCategory = 'Underweight';
      else if (bmi < 25) bmiCategory = 'Normal weight';
      else if (bmi < 30) bmiCategory = 'Overweight';
      else bmiCategory = 'Obese';

      return { bmi, bmiCategory, heightCm, weightKg };
    };

    // Save Onboarding Profile to MongoDB users collection
    app.post('/api/onboarding', verifyJWT, async (req, res) => {
      try {
        const userEmail = req.decoded?.email;
        if (!userEmail) {
          return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
        }

        const {
          age,
          gender,
          yogaExperience,
          primaryGoal,
          yogaStyle,
          fitnessLevel,
          diet,
          waterIntake,
          hasInjuries,
          injuryAreas,
          injuryDetails,
          height,
          heightUnit,
          weight,
          weightUnit,
          targetWeight,
          preferredDuration
        } = req.body;

        if (!age || !gender || !yogaExperience || !primaryGoal || !yogaStyle || !fitnessLevel || !diet || !waterIntake || !hasInjuries || !height || !weight || !preferredDuration) {
          return res.status(400).send({ error: true, message: 'Missing required onboarding profile fields' });
        }

        // Recalculate BMI on the backend before saving to MongoDB
        const { bmi, bmiCategory, heightCm, weightKg } = calculateBMI(height, heightUnit || 'cm', weight, weightUnit || 'kg');

        const onboardingProfile = {
          age,
          gender,
          yogaExperience,
          primaryGoal,
          yogaStyle,
          fitnessLevel,
          diet,
          waterIntake,
          hasInjuries,
          injuryAreas: Array.isArray(injuryAreas) ? injuryAreas : [],
          injuryDetails: injuryDetails || '',
          height,
          heightUnit: heightUnit || 'cm',
          weight,
          weightUnit: weightUnit || 'kg',
          targetWeight: targetWeight || weight,
          preferredDuration: Number(preferredDuration) || 30,
          heightCm,
          weightKg,
          bmi,
          bmiCategory,
          updatedAt: new Date()
        };

        const filter = { email: { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') } };
        const updateDoc = {
          $set: {
            onboardingProfile,
            onboardingCompleted: true
          }
        };

        // Try to update existing user; retry up to 3 times in case /new-user hasn't completed yet (race condition)
        let result;
        for (let attempt = 0; attempt < 3; attempt++) {
          result = await userCollection.updateOne(filter, updateDoc);
          if (result.matchedCount > 0) break;
          // User not found yet – wait 400ms and retry (handles /new-user async race condition)
          if (attempt < 2) await new Promise(r => setTimeout(r, 400));
        }

        // If user still not found after retries, upsert with email field to avoid losing data
        if (!result || result.matchedCount === 0) {
          result = await userCollection.updateOne(
            filter,
            { $set: { email: userEmail.trim(), onboardingProfile, onboardingCompleted: true } },
            { upsert: true }
          );
        }

        res.send({ success: true, onboardingProfile, result });
      } catch (err) {
        console.error("Error updating onboarding profile:", err);
        res.status(500).send({ error: true, message: err.message });
      }
    });

    // ── UPDATE LOGGED-IN USER PROFILE & PERSONALISATION ────────
    app.put('/api/user/profile', verifyJWT, async (req, res) => {
      try {
        const userEmail = req.decoded?.email;
        if (!userEmail) {
          return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
        }

        const {
          name,
          phone,
          address,
          about,
          mantra,
          photoUrl,
          photoURL,
          // Tailored Yoga & Wellness fields
          age,
          gender,
          yogaExperience,
          primaryGoal,
          yogaStyle,
          preferredStyles,
          fitnessLevel,
          diet,
          waterIntake,
          hasInjuries,
          injuryAreas,
          injuryDetails,
          height,
          heightUnit,
          weight,
          weightUnit,
          targetWeight,
          preferredDuration,
          preferredTimeOfDay,
          weeklyPracticeGoal,
          ambientSound,
          notifications
        } = req.body;

        const filter = { email: { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') } };
        const existingUser = await userCollection.findOne(filter);
        const prevOnboarding = existingUser?.onboardingProfile || {};

        // Recalculate BMI if height or weight provided
        const curHeight = height !== undefined ? height : prevOnboarding.height;
        const curHeightUnit = heightUnit !== undefined ? heightUnit : (prevOnboarding.heightUnit || 'cm');
        const curWeight = weight !== undefined ? weight : prevOnboarding.weight;
        const curWeightUnit = weightUnit !== undefined ? weightUnit : (prevOnboarding.weightUnit || 'kg');

        let bmiData = {};
        if (curHeight && curWeight) {
          bmiData = calculateBMI(curHeight, curHeightUnit, curWeight, curWeightUnit);
        }

        const updatedOnboardingProfile = {
          ...prevOnboarding,
          age: age !== undefined ? age : prevOnboarding.age,
          gender: gender !== undefined ? gender : prevOnboarding.gender,
          yogaExperience: yogaExperience !== undefined ? yogaExperience : prevOnboarding.yogaExperience,
          primaryGoal: primaryGoal !== undefined ? primaryGoal : prevOnboarding.primaryGoal,
          yogaStyle: yogaStyle !== undefined ? yogaStyle : prevOnboarding.yogaStyle,
          preferredStyles: Array.isArray(preferredStyles) ? preferredStyles : (prevOnboarding.preferredStyles || (yogaStyle ? [yogaStyle] : [])),
          fitnessLevel: fitnessLevel !== undefined ? fitnessLevel : prevOnboarding.fitnessLevel,
          diet: diet !== undefined ? diet : prevOnboarding.diet,
          waterIntake: waterIntake !== undefined ? waterIntake : prevOnboarding.waterIntake,
          hasInjuries: hasInjuries !== undefined ? hasInjuries : prevOnboarding.hasInjuries,
          injuryAreas: Array.isArray(injuryAreas) ? injuryAreas : (prevOnboarding.injuryAreas || []),
          injuryDetails: injuryDetails !== undefined ? injuryDetails : (prevOnboarding.injuryDetails || ''),
          height: curHeight,
          heightUnit: curHeightUnit,
          weight: curWeight,
          weightUnit: curWeightUnit,
          targetWeight: targetWeight !== undefined ? targetWeight : (prevOnboarding.targetWeight || curWeight),
          preferredDuration: preferredDuration !== undefined ? Number(preferredDuration) : (prevOnboarding.preferredDuration || 30),
          preferredTimeOfDay: preferredTimeOfDay !== undefined ? preferredTimeOfDay : (prevOnboarding.preferredTimeOfDay || 'morning'),
          weeklyPracticeGoal: weeklyPracticeGoal !== undefined ? Number(weeklyPracticeGoal) : (prevOnboarding.weeklyPracticeGoal || 3),
          ambientSound: ambientSound !== undefined ? ambientSound : (prevOnboarding.ambientSound || 'bowls'),
          notifications: notifications !== undefined ? notifications : (prevOnboarding.notifications || {
            dailyReminder: true,
            reminderTime: '07:00',
            quoteNotification: true,
            emailDigest: true,
            defaultCameraOff: false
          }),
          ...(bmiData.bmi !== undefined ? bmiData : {}),
          updatedAt: new Date()
        };

        const finalPhoto = photoUrl || photoURL || existingUser?.photoURL || existingUser?.photoUrl;

        const updateSet = {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(about !== undefined && { about }),
          ...(mantra !== undefined && { mantra }),
          ...(finalPhoto && { photoUrl: finalPhoto, photoURL: finalPhoto }),
          onboardingProfile: updatedOnboardingProfile,
          onboardingCompleted: true,
          updatedAt: new Date()
        };

        await userCollection.updateOne(
          filter,
          { $set: updateSet },
          { upsert: true }
        );

        const updatedUser = await userCollection.findOne(filter);

        res.send({
          success: true,
          message: 'Profile and personalisation saved successfully',
          user: updatedUser
        });
      } catch (err) {
        console.error("Error updating profile personalisation:", err);
        res.status(500).send({ error: true, message: err.message });
      }
    });

    // Get User Onboarding Status
    app.get('/api/user/onboarding', verifyJWT, async (req, res) => {
      try {
        const userEmail = req.decoded?.email;
        if (!userEmail) {
          return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
        }

        const user = await userCollection.findOne({ email: { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') } });
        if (!user) {
          return res.status(404).send({ error: true, message: 'User not found' });
        }

        res.send({
          onboardingCompleted: !!user.onboardingCompleted,
          onboardingProfile: user.onboardingProfile || null
        });
      } catch (err) {
        console.error("Error fetching onboarding data:", err);
        res.status(500).send({ error: true, message: err.message });
      }
    });

    // Recommendation Engine: Dynamic weighted scoring using collected profile & existing class metadata
    app.get('/api/recommendations', verifyJWT, async (req, res) => {
      try {
        const userEmail = req.decoded?.email;
        if (!userEmail) {
          return res.status(401).send({ error: true, message: 'Unauthorized access: No email in token' });
        }

        const user = await userCollection.findOne({ email: { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') } });

        // If user has not completed onboarding, return clean response (Requirement 7)
        if (!user || !user.onboardingCompleted || !user.onboardingProfile) {
          return res.send({
            completed: false,
            message: 'Onboarding has not been completed yet.',
            recommendations: []
          });
        }

        const profile = user.onboardingProfile;
        const classes = await classesCollection.find({ status: 'approved' }).toArray();

        const scoredClasses = classes.map(cls => {
          let score = 55; // Base score
          const matchReasons = [];

          const text = `${cls.name || ''} ${cls.description || ''} ${cls.focus || ''} ${cls.category || ''} ${(Array.isArray(cls.categories) ? cls.categories.join(' ') : (cls.categories || ''))} ${(Array.isArray(cls.tags) ? cls.tags.join(' ') : (cls.tags || ''))}`.toLowerCase();

          // 1. Primary Goal Matching (Tailored for Yoga goals)
          const goal = (profile.primaryGoal || '').toLowerCase();
          const goalPref = (profile.goalPreference || '').toLowerCase();

          if (goal.includes('flexibility') || goal.includes('mobility')) {
            if (text.includes('flexibility') || text.includes('stretch') || text.includes('hatha') || text.includes('yin') || text.includes('mobility') || text.includes('hip') || text.includes('spine')) {
              score += 22;
              matchReasons.push('Expands range of motion & joint flexibility');
            }
          } else if (goal.includes('stress') || goal.includes('mental') || goal.includes('calm')) {
            if (text.includes('stress') || text.includes('relax') || text.includes('restorative') || text.includes('nidra') || text.includes('breath') || text.includes('calm') || text.includes('peace')) {
              score += 22;
              matchReasons.push('Calms nervous system & relieves stress');
            }
          } else if (goal.includes('strength') || goal.includes('tone') || goal.includes('power')) {
            if (text.includes('strength') || text.includes('power') || text.includes('ashtanga') || text.includes('vinyasa') || text.includes('core') || text.includes('sculpt')) {
              score += 22;
              matchReasons.push('Builds functional strength & core stability');
            }
          } else if (goal.includes('weight') || goal.includes('burn')) {
            if (text.includes('vinyasa') || text.includes('power') || text.includes('flow') || text.includes('burn') || text.includes('cardio') || text.includes('active') || text.includes('bikram')) {
              score += 22;
              matchReasons.push('Dynamic active flow for calorie burn');
            }
          } else if (goal.includes('posture') || goal.includes('align') || goal.includes('desk')) {
            if (text.includes('posture') || text.includes('spine') || text.includes('align') || text.includes('hatha') || text.includes('desk') || text.includes('shoulder') || text.includes('back')) {
              score += 22;
              matchReasons.push('Corrects posture, spinal alignment & desk tension');
            }
          } else if (goal.includes('recovery') || goal.includes('rehabilitation') || goal.includes('injury')) {
            if (text.includes('gentle') || text.includes('restorative') || text.includes('therapeutic') || text.includes('chair') || text.includes('healing') || text.includes('safe')) {
              score += 25;
              matchReasons.push('Gentle rehabilitation & safe therapeutic postures');
            }
          }

          // Preferred Yoga Style matching
          const preferredStyles = Array.isArray(profile.preferredStyles) && profile.preferredStyles.length > 0
            ? profile.preferredStyles
            : (profile.yogaStyle ? [profile.yogaStyle] : []);

          for (const style of preferredStyles) {
            const s = (style || '').toLowerCase();
            if (s && text.includes(s)) {
              score += 15;
              matchReasons.push(`Matches your favorite style: ${style}`);
              break;
            }
          }

          // Goal / Body Preference match (legacy fallback)
          if (goalPref && text.includes(goalPref)) {
            score += 8;
            matchReasons.push(`Matches style preference: ${profile.goalPreference}`);
          }

          // 2. Experience Level Matching
          const exp = (profile.yogaExperience || '').toLowerCase();
          const clsLevel = (cls.level || '').toLowerCase();

          if (exp.includes('beginner')) {
            if (clsLevel.includes('beginner') || text.includes('beginner') || text.includes('all levels') || text.includes('foundational')) {
              score += 12;
              matchReasons.push('Beginner-friendly step-by-step guidance');
            }
          } else if (exp.includes('intermediate')) {
            if (clsLevel.includes('intermediate') || text.includes('intermediate') || text.includes('all levels')) {
              score += 12;
              matchReasons.push('Progressive challenge suitable for intermediate yogis');
            }
          } else if (exp.includes('advanced')) {
            if (clsLevel.includes('advanced') || text.includes('advanced') || text.includes('deep') || text.includes('mastery')) {
              score += 15;
              matchReasons.push('Advanced asana sequencing for seasoned practitioners');
            }
          }

          // 3. Injury Protection Matching
          if (profile.hasInjuries === 'yes' && Array.isArray(profile.injuryAreas) && profile.injuryAreas.length > 0) {
            if (text.includes('gentle') || text.includes('restorative') || text.includes('safe') || text.includes('low impact') || text.includes('healing')) {
              score += 15;
              matchReasons.push(`Modified & safe for protecting: ${profile.injuryAreas.slice(0, 2).join(', ')}`);
            }
          }

          // 4. Preferred Duration Matching
          const userDur = Number(profile.preferredDuration) || 30;
          const classDur = Number(cls.duration) || 30;
          const durDiff = Math.abs(userDur - classDur);

          if (durDiff === 0) {
            score += 12;
            matchReasons.push(`Exact match for your ${userDur}-min practice window`);
          } else if (durDiff <= 15) {
            score += 6;
            matchReasons.push(`Fits your schedule (${classDur} mins)`);
          }

          // 5. BMI Category & Body Metric factor
          const bmiCat = (profile.bmiCategory || '').toLowerCase();
          if (bmiCat.includes('overweight') || bmiCat.includes('obese')) {
            if (text.includes('joint') || text.includes('mobility') || text.includes('gentle') || text.includes('flow') || text.includes('cardio') || text.includes('stretch')) {
              score += 8;
              matchReasons.push('Joint-friendly flow promoting comfortable movement');
            }
          } else if (bmiCat.includes('underweight')) {
            if (text.includes('gentle') || text.includes('restorative') || text.includes('strength') || text.includes('alignment')) {
              score += 8;
              matchReasons.push('Grounding sequence building balanced posture');
            }
          }

          if (cls.level) {
            matchReasons.push(`Class Level: ${cls.level}`);
          }

          const matchPercentage = Math.min(99, Math.max(65, Math.round(score)));

          return {
            ...cls,
            matchPercentage,
            matchReasons: matchReasons.length > 0 ? matchReasons : ['Recommended for your personalized yoga profile']
          };
        });

        scoredClasses.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.send({
          completed: true,
          profile: user.onboardingProfile,
          recommendations: scoredClasses
        });

      } catch (err) {
        console.error("Error generating recommendations:", err);
        res.status(500).send({ error: true, message: err.message });
      }
    });

    // ! CLASSES ROUTES

    app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      // newClass.availableSeats = parseInt(newClass.availableSeats)
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      try {
        const { category, categories, level, status } = req.query;
        let query = {};

        // By default, only return approved classes to the public
        if (status) {
          if (status !== 'all') {
            query.status = status;
          }
        } else {
          query.status = 'approved';
        }

        // Parse single or multiple category query parameters
        const rawCategories = categories || category;
        let catList = [];
        if (Array.isArray(rawCategories)) {
          catList = rawCategories.filter(c => c && c !== 'All');
        } else if (typeof rawCategories === 'string' && rawCategories !== 'All') {
          catList = rawCategories.split(',').map(c => c.trim()).filter(c => c && c !== 'All');
        }

        if (catList.length === 1) {
          query.categories = catList[0];
        } else if (catList.length > 1) {
          query.categories = { $in: catList };
        }

        if (level && level !== 'All levels') {
          query.level = level;
        }
        const result = await classesCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.warn("/classes query fallback:", err.message);
        res.send([]);
      }
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
      const cleanCategories = Array.isArray(updateClass.categories)
        ? updateClass.categories.filter((c) => c !== "Beginner")
        : updateClass.categories;

      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: "pending",
          ...(updateClass.level && { level: updateClass.level }),
          ...(cleanCategories && {
            categories: cleanCategories,
            ...(cleanCategories.length > 0 && { category: cleanCategories[0] })
          }),
          ...(updateClass.price !== undefined && { Price: updateClass.price }),
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Delete a class (instructor can delete their own class, admin can delete any)
    const deleteClassHandler = async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: true, message: "Invalid class ID" });
        }

        const email = req.decoded.email;
        const user = await userCollection.findOne({ email: email });

        let query = { _id: new ObjectId(id) };
        // If not admin, ensure instructor can only delete their own class
        if (user?.role !== "admin") {
          query.instructorEmail = email;
        }

        const result = await classesCollection.deleteOne(query);
        if (result.deletedCount > 0) {
          // Clean up any cart items referencing this deleted class
          await cartCollection.deleteMany({ classId: id });
          res.send(result);
        } else {
          res.status(404).send({ error: true, message: "Class not found or you are not authorized to delete it" });
        }
      } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).send({ error: true, message: err.message });
      }
    };

    app.delete("/delete-class/:id", verifyJWT, verifyInstructor, deleteClassHandler);
    app.delete("/class/:id", verifyJWT, verifyInstructor, deleteClassHandler);

    // Live Class Session Routes
    // Update live session status (start or end live session)
    app.put("/classes/live-status/:id", verifyJWT, verifyInstructor, async (req, res) => {
      try {
        const id = req.params.id;
        const { liveStatus } = req.body; // 'upcoming' | 'live' | 'ended'
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: true, message: "Invalid class ID" });
        }

        const email = req.decoded.email;
        const user = await userCollection.findOne({ email });

        let filter = { _id: new ObjectId(id) };
        if (user?.role !== "admin") {
          filter.instructorEmail = email;
        }

        const updateDoc = {
          $set: {
            liveStatus: liveStatus || "live",
            lastLiveUpdate: new Date(),
          },
        };

        const result = await classesCollection.updateOne(filter, updateDoc);
        if (result.matchedCount === 0) {
          return res.status(403).send({ error: true, message: "Not authorized to update this live session" });
        }
        res.send({ success: true, liveStatus });
      } catch (err) {
        console.error("Error updating live status:", err);
        res.status(500).send({ error: true, message: err.message });
      }
    });

    // Get live session verification and room details
    app.get("/classes/live-session/:id", verifyJWT, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: true, message: "Invalid class ID" });
        }

        const email = req.decoded.email;
        const classItem = await classesCollection.findOne({ _id: new ObjectId(id) });
        if (!classItem) {
          return res.status(404).send({ error: true, message: "Class not found" });
        }

        const user = await userCollection.findOne({ email });
        const isInstructor = classItem.instructorEmail === email;
        const isAdmin = user?.role === "admin";

        // Check if student is enrolled
        let isEnrolled = false;
        if (!isInstructor && !isAdmin) {
          const enrollment = await enrolledCollection.findOne({
            userEmail: email,
            classesId: { $in: [new ObjectId(id)] },
          });
          isEnrolled = !!enrollment;
        }

        if (!isInstructor && !isAdmin && !isEnrolled) {
          return res.status(403).send({
            authorized: false,
            message: "You must be enrolled in this class to access the live session room.",
          });
        }

        const cleanTitle = (classItem.name || "LiveClass").replace(/[^a-zA-Z0-9]/g, "");
        const roomName = `YogaMaster-${cleanTitle}-${id.slice(-6)}`;

        res.send({
          authorized: true,
          isInstructor: isInstructor || isAdmin,
          roomName,
          classItem,
        });
      } catch (err) {
        console.error("Error retrieving live session:", err);
        res.status(500).send({ error: true, message: err.message });
      }
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
        currency: 'inr',
        description: 'Yoga Master Course Enrollment',
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
        try {
          const email = req.params.email;
          const user = await userCollection.findOne({ email });

          if (user && (user.role === 'instructor' || user.role?.trim() === 'instructor')) {
            // Find all classes created by this instructor
            const instructorClasses = await classesCollection.find({ instructorEmail: email }).toArray();
            const instructorClassIds = instructorClasses.map(c => c._id.toString());
            const instructorClassIdObjects = instructorClasses.map(c => c._id);

            // Find payments where students paid for instructor's classes OR payments made by the instructor
            const payments = await paymentCollection.find({
              $or: [
                { classesId: { $in: instructorClassIds } },
                { classesId: { $in: instructorClassIdObjects } },
                { userEmail: email }
              ]
            }).sort({ date: -1 }).toArray();

            // Collect all unique class IDs across all payments
            const allPaymentClassIds = [...new Set(payments.flatMap(p => (p.classesId || []).map(id => id ? id.toString() : null)).filter(Boolean))];
            const allClassDocs = await classesCollection.find({
              _id: { $in: allPaymentClassIds.map(id => {
                try { return new ObjectId(id); } catch(e) { return null; }
              }).filter(Boolean) }
            }).toArray();

            const classMap = new Map();
            allClassDocs.forEach(c => classMap.set(c._id.toString(), c.name));

            const enriched = payments.map(p => {
              const names = (p.classesId || []).map(id => classMap.get(id.toString())).filter(Boolean);
              const classNames = names.length > 0 ? names.join(', ') : (p.classNames || 'Yoga Course');
              return {
                ...p,
                classNames,
                isEarnings: p.userEmail !== email
              };
            });
            return res.send(enriched);
          }

          const query = { userEmail: email };
          const result = await paymentCollection.find(query).sort({ date: -1 }).toArray();
          res.send(result);
        } catch (err) {
          console.error("Error in /payment-history:", err);
          res.status(500).send({ error: true, message: err.message });
        }
      });

      app.get('/instructor-payments/:email', async (req, res) => {
        try {
          const email = req.params.email;
          const instructorClasses = await classesCollection.find({ instructorEmail: email }).toArray();
          const instructorClassIds = instructorClasses.map(c => c._id.toString());
          const instructorClassIdObjects = instructorClasses.map(c => c._id);

          const payments = await paymentCollection.find({
            $or: [
              { classesId: { $in: instructorClassIds } },
              { classesId: { $in: instructorClassIdObjects } },
              { userEmail: email }
            ]
          }).sort({ date: -1 }).toArray();

          const allPaymentClassIds = [...new Set(payments.flatMap(p => (p.classesId || []).map(id => id ? id.toString() : null)).filter(Boolean))];
          const allClassDocs = await classesCollection.find({
            _id: { $in: allPaymentClassIds.map(id => {
              try { return new ObjectId(id); } catch(e) { return null; }
            }).filter(Boolean) }
          }).toArray();

          const classMap = new Map();
          allClassDocs.forEach(c => classMap.set(c._id.toString(), c.name));

          const enriched = payments.map(p => {
            const names = (p.classesId || []).map(id => classMap.get(id.toString())).filter(Boolean);
            const classNames = names.length > 0 ? names.join(', ') : (p.classNames || 'Yoga Course');
            return {
              ...p,
              classNames,
              isEarnings: p.userEmail !== email
            };
          });
          res.send(enriched);
        } catch (err) {
          console.error("Error in /instructor-payments:", err);
          res.status(500).send({ error: true, message: err.message });
        }
      });

      app.get('/payment-history-length/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const total = await paymentCollection.countDocuments(query);
        res.send({ total });
      });

     // ! ENROLLED ROUTES

     app.get('/popular_classes', async (req, res) => {
      try {
        const result = await classesCollection.find({ status: 'approved' }).sort({ totalEnrolled: -1 }).limit(6).toArray();
        res.send(result);
      } catch (err) {
        console.warn("/popular_classes query fallback:", err.message);
        res.send([]);
      }
  })


  app.get('/popular-instructors', async (req, res) => {
    try {
      const pipeline = [
          {
              $match: { status: 'approved' }
          },
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
      res.send(result);
    } catch (err) {
      console.warn("/popular-instructors query fallback:", err.message);
      res.send([]);
    }
});




  
        // Admins stats 
        app.get('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
          try {
            // Get approved classes and pending classes and instructors 
            const approvedClasses = (await classesCollection.find({ status: 'approved' }).toArray()).length;
            const pendingClasses = (await classesCollection.find({ status: 'pending' }).toArray()).length;
            const instructors = (await userCollection.find({ role: 'instructor' }).toArray()).length;
            const totalClasses = (await classesCollection.find().toArray()).length;
            const totalEnrolled = (await enrolledCollection.find().toArray()).length;
            const pendingApplications = (await appliedCollection.find({ status: { $in: ['pending', null, undefined] } }).toArray()).length;
            const totalApplications = (await appliedCollection.find().toArray()).length;
            const result = {
                approvedClasses,
                pendingClasses,
                instructors,
                totalClasses,
                totalEnrolled,
                pendingApplications,
                totalApplications,
            }
            res.send(result);
          } catch (err) {
            console.error('Error fetching admin stats:', err);
            res.status(500).send({ error: true, message: err.message });
          }
      })

              // !GET ALL INSTrUCTOR  

              app.get('/instructors', async (req, res) => {
                try {
                  const result = await userCollection.find({ role: { $regex: /^instructor/i } }).toArray();
                  res.send(result);
                } catch (err) {
                  console.warn("/instructors query fallback:", err.message);
                  res.send([]);
                }
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
            
            
            
            // Applied instructor routes
            app.get('/applied-instructors', verifyJWT, verifyAdmin, async (req, res) => {
                try {
                    const applications = await appliedCollection.find().sort({ submittedAt: -1, _id: -1 }).toArray();
                    // Enrich with user profile info (photo, phone, current role)
                    const enriched = await Promise.all(applications.map(async (appDoc) => {
                        const user = await userCollection.findOne({ 
                            email: { $regex: new RegExp(`^${(appDoc.email || '').trim()}$`, 'i') } 
                        });
                        return {
                            ...appDoc,
                            status: appDoc.status || 'pending',
                            userPhoto: user?.photoURL || user?.photoUrl || null,
                            userPhone: user?.phone || appDoc.phone || null,
                            currentRole: user?.role || 'user',
                            userAddress: user?.address || null,
                            skills: user?.skills || appDoc.skills || null
                        };
                    }));
                    res.send(enriched);
                } catch (err) {
                    console.error('Error fetching instructor applications:', err);
                    res.status(500).send({ error: true, message: err.message });
                }
            });

            app.get('/applied-instructors/:email', async (req, res) => {
                try {
                    const email = req.params.email;
                    const result = await appliedCollection.findOne({ 
                        email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } 
                    });
                    if (result && !result.status) {
                        result.status = 'pending';
                    }
                    res.send(result || {});
                } catch (err) {
                    console.error('Error fetching applicant status:', err);
                    res.status(500).send({ error: true, message: err.message });
                }
            });

            app.post('/as-instructor', async (req, res) => {
                try {
                    const data = req.body;
                    const cleanEmail = (data.email || '').trim().toLowerCase();
                    if (!cleanEmail) {
                        return res.status(400).send({ error: true, message: 'Email is required' });
                    }

                    // Check if already an instructor
                    const user = await userCollection.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
                    if (user?.role === 'instructor') {
                        return res.status(400).send({ error: true, message: 'You are already an active instructor!' });
                    }

                    const existing = await appliedCollection.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
                    if (existing && (!existing.status || existing.status === 'pending')) {
                        return res.status(400).send({ error: true, message: 'Your application is already pending review.' });
                    }

                    if (existing && existing.status === 'rejected') {
                        // Re-apply
                        const result = await appliedCollection.updateOne(
                            { _id: existing._id },
                            { 
                                $set: { 
                                    name: data.name || user?.name || 'Applicant',
                                    experience: data.experience,
                                    phone: data.phone || user?.phone || '',
                                    status: 'pending',
                                    feedback: null,
                                    submittedAt: new Date()
                                }
                            }
                        );
                        return res.send({ success: true, message: 'Application re-submitted for review!', result });
                    }

                    const applicationDoc = {
                        name: data.name || user?.name || 'Applicant',
                        email: cleanEmail,
                        experience: data.experience,
                        phone: data.phone || user?.phone || '',
                        status: 'pending',
                        submittedAt: new Date()
                    };
                    const result = await appliedCollection.insertOne(applicationDoc);
                    res.send({ success: true, message: 'Application submitted successfully!', result });
                } catch (err) {
                    console.error('Error submitting instructor application:', err);
                    res.status(500).send({ error: true, message: err.message });
                }
            });

            app.patch('/applied-instructors/approve/:id', verifyJWT, verifyAdmin, async (req, res) => {
                try {
                    const id = req.params.id;
                    const application = await appliedCollection.findOne({ _id: new ObjectId(id) });
                    if (!application) {
                        return res.status(404).send({ error: true, message: 'Application not found' });
                    }

                    // Update application status
                    await appliedCollection.updateOne(
                        { _id: new ObjectId(id) },
                        { 
                            $set: { 
                                status: 'approved', 
                                reviewedAt: new Date(), 
                                reviewedBy: req.decoded?.email || 'admin' 
                            } 
                        }
                    );

                    // Update user's role to instructor
                    const userUpdate = await userCollection.updateOne(
                        { email: { $regex: new RegExp(`^${(application.email || '').trim()}$`, 'i') } },
                        { $set: { role: 'instructor' } }
                    );

                    res.send({ 
                        success: true, 
                        message: `Approved! ${application.name || application.email} is now an instructor.`,
                        userModified: userUpdate.modifiedCount
                    });
                } catch (err) {
                    console.error('Error approving instructor application:', err);
                    res.status(500).send({ error: true, message: err.message });
                }
            });

            app.patch('/applied-instructors/reject/:id', verifyJWT, verifyAdmin, async (req, res) => {
                try {
                    const id = req.params.id;
                    const { reason } = req.body;
                    const application = await appliedCollection.findOne({ _id: new ObjectId(id) });
                    if (!application) {
                        return res.status(404).send({ error: true, message: 'Application not found' });
                    }

                    await appliedCollection.updateOne(
                        { _id: new ObjectId(id) },
                        { 
                            $set: { 
                                status: 'rejected', 
                                feedback: reason || 'Application not accepted at this time.', 
                                reviewedAt: new Date(), 
                                reviewedBy: req.decoded?.email || 'admin' 
                            } 
                        }
                    );

                    res.send({ 
                        success: true, 
                        message: 'Application rejected.' 
                    });
                } catch (err) {
                    console.error('Error rejecting instructor application:', err);
                    res.status(500).send({ error: true, message: err.message });
                }
            });

            app.delete('/applied-instructors/:id', verifyJWT, verifyAdmin, async (req, res) => {
                try {
                    const id = req.params.id;
                    const result = await appliedCollection.deleteOne({ _id: new ObjectId(id) });
                    res.send({ success: true, message: 'Application deleted', result });
                } catch (err) {
                    console.error('Error deleting application:', err);
                    res.status(500).send({ error: true, message: err.message });
                }
            });

            // ! REVIEWS & FEEDBACK ROUTES
            // Get all reviews for a class
            app.get('/reviews/:classId', async (req, res) => {
              try {
                const classId = req.params.classId;
                const reviews = await reviewsCollection
                  .find({ classId: classId })
                  .sort({ date: -1 })
                  .toArray();
                res.send(reviews);
              } catch (err) {
                console.warn("Error fetching reviews:", err.message);
                res.send([]);
              }
            });

            // Add or update review for a class
            app.post('/add-review', verifyJWT, async (req, res) => {
              try {
                const { classId, rating, comment, userName, userPhoto } = req.body;
                const userEmail = req.decoded.email;

                if (!classId || !rating || !comment) {
                  return res.status(400).send({ error: true, message: "Class ID, rating, and feedback comment are required" });
                }

                // Check enrollment status for verified student badge
                let isVerified = false;
                try {
                  if (ObjectId.isValid(classId)) {
                    const enrolled = await enrolledCollection.findOne({
                      userEmail: userEmail,
                      classesId: { $in: [new ObjectId(classId)] }
                    });
                    if (enrolled) isVerified = true;
                  }
                } catch (e) {}

                const query = { classId: classId, userEmail: userEmail };
                const updateDoc = {
                  $set: {
                    classId,
                    userEmail,
                    userName: userName || userEmail.split('@')[0],
                    userPhoto: userPhoto || null,
                    rating: Math.min(5, Math.max(1, Number(rating))),
                    comment: comment.trim(),
                    isVerified,
                    date: new Date()
                  }
                };

                const result = await reviewsCollection.updateOne(query, updateDoc, { upsert: true });
                res.send({ success: true, result });
              } catch (err) {
                console.error("Error submitting review:", err);
                res.status(500).send({ error: true, message: err.message });
              }
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
