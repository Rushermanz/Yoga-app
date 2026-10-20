# Yoga Master — AI-Enhanced Online Yoga Learning Platform

Yoga Master is a web-based, AI-enhanced online yoga learning and wellness platform developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js) with MongoDB Atlas as the cloud database. The platform connects learners with certified yoga instructors across three role-based modules—User, Instructor, and Administrator—combining structured course management, secure payments, private one-to-one coaching, and AI-powered personalization.

---

## Overview

Many online yoga platforms only host pre-recorded videos without personalized guidance, instructor interaction, or scheduling support. Yoga Master addresses this by offering a centralized environment where learners can complete a wellness onboarding profile, receive AI-driven yoga plans and class recommendations, purchase and enroll in courses, join live class sessions, and book private one-to-one appointments with instructors. Instructors can apply to teach, publish and manage classes, host live sessions, and track earnings, while administrators oversee user accounts, instructor applications, class approvals, and platform payments.

---

## Features

### User Module

- **Wellness Onboarding & BMI Profiling:** Complete a personalized onboarding profile capturing age, gender, height, weight (with automatic BMI and category calculation), fitness level, primary wellness goals, preferred yoga styles, session duration, dietary habits, water intake, and injury history.
- **Class & Instructor Discovery:** Browse approved yoga classes, filter by category and experience level, and explore top-enrolled classes and popular instructors.
- **AI-Powered Recommendations & Personalized Plans:** Receive personalized yoga plans and ranked class recommendations powered by a dynamic weighted-scoring engine that matches user goals, experience levels, preferred durations, BMI categories, and injury protection needs.
- **AI Chatbot & Wellness Tools:** Access an AI chatbot for instant yoga assistance, calendar-based adaptive session recommendations, and photo-based fitness assessments.
- **Cart & Stripe Checkout Workflow:** Add classes to a shopping cart and complete course purchases in INR using Stripe payment intents.
- **Course Access, Live Rooms & Offline Support:** Access enrolled courses, join authorized live class session rooms, download purchased videos, and utilize offline workout plans and free goal programs.
- **1-to-1 Appointments:** Book private one-to-one mentoring sessions and schedule appointments with instructors.
- **Payment History & Account Control:** View transaction history and manage or self-delete account profiles.
- **Instructor Application:** Apply to become an instructor, view application status, and re-apply if previously rejected.

### Instructor Module

- **Instructor Onboarding:** Apply for instructor access and transition roles automatically upon administrator approval.
- **Class Creation & Management:** Create, submit, update, and delete yoga classes with thumbnails, video links, seat limits, pricing, levels, and categories.
- **Live Session Hosting:** Manage live class statuses (`upcoming`, `live`, `ended`) and host dedicated live session rooms for enrolled students.
- **Private Coaching & Appointments:** Conduct private one-to-one yoga sessions and manage learner appointments.
- **Status & Earnings Tracking:** Track class approval status, view admin feedback on rejected classes, and monitor student payments and instructor earnings.

### Administrator Module

- **Platform Analytics:** View real-time dashboard statistics including approved classes, pending classes, active instructors, total classes, total enrollments, and pending/total instructor applications.
- **User & Role Management:** View all registered users, update user profiles and system roles (`user`, `instructor`, `admin`), and delete accounts.
- **Instructor Application Review:** Review pending instructor applications enriched with user profile details and approve or reject applicants with custom feedback.
- **Class Approval Pipeline:** Review instructor-submitted classes and approve or deny submissions with feedback reasons.
- **Payment Monitoring:** Oversee platform payment records and enrollment transactions.

---

## System Architecture & Database Design

Yoga Master follows a scalable **Three-Tier Architecture**:

| Tier | Technology | Responsibility |
| :--- | :--- | :--- |
| **Presentation Tier** | React.js, HTML, CSS, Tailwind CSS | Responsive user interfaces for Admin, Instructor, and User dashboards, form validation, and API integration. |
| **Application Tier** | Node.js, Express.js | REST APIs, business logic, JWT authentication, role verification, Stripe payment processing, and AI recommendation services. |
| **Data Tier** | MongoDB Atlas | Cloud NoSQL storage for users, classes, carts, enrollments, payments, instructor applications, reviews, appointments, and programs. |

### Core MongoDB Collections (`yoga-master` database)

- `users`: Stores user credentials, roles (`user`, `instructor`, `admin`), profile details, and nested `onboardingProfile` / BMI metrics.
- `classes`: Stores class metadata, instructor ownership, pricing, seat availability, total enrollments, live status, and approval status (`pending`, `approved`, `denied`).
- `cart`: Tracks classes selected by learners prior to checkout.
- `enrolled`: Maps paid learners and transaction IDs to their enrolled class IDs.
- `payments`: Logs Stripe payment transactions, amounts, dates, and enrolled class arrays.
- `applied`: Manages instructor applications, experience details, review timestamps, and approval statuses.
- `reviews`, `appointments`, `user_programs`: Support class reviews, 1-to-1 session scheduling, and structured yoga programs.

---

## Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, JavaScript, HTML5, CSS3, Axios, FontAwesome
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (MongoDB Node.js Driver)
- **Authentication & Security:** JSON Web Token (JWT), bcrypt, CORS, dotenv
- **Payment Integration:** Stripe API (`stripe` Payment Intents)
- **AI & Personalization:** Google Gemini API, Custom Weighted-Scoring Recommendation Engine
- **Development Tools:** Visual Studio Code, Git, GitHub, Windows 11

---

## Getting Started

### Prerequisites

- **Hardware:** Intel i5 / AMD equivalent processor (2.5 GHz+), 8 GB RAM, 256 GB SSD, and a stable internet connection (10 Mbps+).
- **Software:** Node.js, npm, Git, and a MongoDB Atlas cluster.

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/Rushermanz/Yoga-app.git](https://github.com/Rushermanz/Yoga-app.git)
   cd Yoga-app
   ```

2. **Install Frontend dependencies:**

   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend dependencies:**

   ```bash
   cd ../Backend
   npm install
   ```

4. **Configure Environment Variables:**

   Create a `.env` file inside the `Backend/` directory and configure your credentials:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.cbyvkrs.mongodb.net/yoga-master?retryWrites=true&w=majority
   ACCESS_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

5. **Start the Development Servers:**

   Run the backend and frontend servers in separate terminals:

   ```bash
   # Terminal 1: Start Backend
   cd Backend
   npm run dev

   # Terminal 2: Start Frontend
   cd Frontend
   npm run dev
   ```

---

## Application Workflow

1. **Authentication & Onboarding:** A user registers or logs in (receiving a 24-hour JWT token) and completes their wellness onboarding profile, which calculates their BMI and stores their fitness goals and injury history.
2. **AI Discovery & Recommendations:** The user browses approved classes or requests personalized recommendations scored dynamically against their onboarding profile, consults the AI chatbot, or uses calendar-based scheduling.
3. **Cart & Stripe Checkout:** The user adds classes to their cart and completes payment via Stripe (`inr`), which automatically records the transaction, clears the cart, updates class seat availability, and enrolls the user.
4. **Learning & Live Sessions:** The user accesses enrolled course videos, joins verified live class rooms (`YogaMaster-<ClassTitle>-<ID>`), or books 1-to-1 private instructor sessions.
5. **Instructor Application:** An aspiring instructor submits an application via `/as-instructor`, which an administrator reviews and approves to upgrade the user's role to `instructor`.
6. **Class Submission & Admin Review:** Instructors submit new classes (defaulting to `pending` status) and administrators approve or deny them with feedback.

---

## Project Structure

```text
Yoga-app/
├── Backend/                                                    # Node.js & Express.js API server
│   ├── data/programsData.js                                    # Free yoga programs data
│   └── index.js                                                # Main server, routes, JWT & MongoDB config
├── Frontend/                                                   # React.js & Vite client application
├── .gitattributes                                              # Git configuration
├── README.md                                                   # Project documentation
├── Yoga-Master-AI-Enhanced-Online-Yoga-Learning-Platform.pdf   # Full MCA Project Report
├── Yoga_Master_Feature_Set_Abstract.docx                       # Feature set and abstract
├── mca_Project.docx                                            # MCA project documentation
└── promt.docx                                                  # Supporting project document
```

---

## Security

- **JWT Authentication:** Protected API endpoints validate bearer tokens via `verifyJWT` middleware with 24-hour token expiration.
- **Role-Based Access Control (RBAC):** Dedicated `verifyAdmin` and `verifyInstructor` middlewares restrict sensitive operations (user deletion, class approval, instructor onboarding, live status updates) to authorized roles.
- **Password & Credential Security:** User passwords are hashed using `bcrypt`, and sensitive keys (`MONGODB_URI`, `ACCESS_SECRET`) are managed via `dotenv` environment variables.
- **Live Room & Payment Validation:** Live session endpoints verify student enrollment or instructor ownership before granting room access, and payments are processed through Stripe Payment Intents.

---

## Future Enhancements

While AI chatbot support, personalized yoga plan generation, calendar-based recommendations, and photo-based fitness assessments are integrated into the platform, planned future enhancements include:

- **AI-Based Posture Analysis:** Real-time camera-based posture correction and alignment feedback.
- **Wearable Device Integration:** Syncing with smartwatches and fitness bands to track heart rate, sleep patterns, and physical activity.
- **Mobile Application:** Dedicated cross-platform mobile app for iOS and Android.
- **Voice-Based AI Interaction:** Voice commands and spoken responses for hands-free interaction with the AI yoga assistant during practice.
- **Advanced Progress Analytics:** Detailed visual charts, streak analytics, and automated practice reminders.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## License

No license has been specified in this `README`. Add an appropriate license after confirming the project's intended usage and distribution terms.

---

## Contributors & Academic Credits

This project was developed in partial fulfillment of the **Master of Computer Applications (MCA)** degree at **MES Advanced Institute of Management and Technology (MES AIMAT), Marampally** (affiliated with **Mahatma Gandhi University, Kottayam**, 2025–2027):

- **Agnivesh R** (Reg. No: 253242210534) — [@Rushermanz](https://github.com/Rushermanz)
- **Sebin Babu** — [@sebinbabu5555](https://github.com/sebinbabu5555)
- **Project Guide:** Ms. Jaseena CY, Department of Computer Applications

---

**Yoga Master** — *Learn, practice, and grow through yoga.*
