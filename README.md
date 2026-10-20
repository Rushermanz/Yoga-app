# Yoga Master — AI-Enhanced Online Yoga Learning Platform[span_0](start_span)[span_0](end_span)

Yoga Master is a web-based, AI-enhanced online yoga learning and wellness platform developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js) with MongoDB Atlas as the cloud database[span_1](start_span)[span_1](end_span). The platform connects learners with certified yoga instructors across three role-based modules—User, Instructor, and Administrator—combining structured course management, secure payments, private one-to-one coaching, and AI-powered personalization[span_2](start_span)[span_2](end_span)[span_3](start_span)[span_3](end_span)[span_4](start_span)[span_4](end_span).

---

## Overview

Many online yoga platforms only host pre-recorded videos without personalized guidance, instructor interaction, or scheduling support[span_5](start_span)[span_5](end_span)[span_6](start_span)[span_6](end_span). Yoga Master addresses this by offering a centralized environment where learners can complete a wellness onboarding profile, receive AI-driven yoga plans and class recommendations, purchase and enroll in courses, join live class sessions, and book private one-to-one appointments with instructors[span_7](start_span)[span_7](end_span)[span_8](start_span)[span_8](end_span)[span_9](start_span)[span_9](end_span)[span_10](start_span)[span_10](end_span)[span_11](start_span)[span_11](end_span). Instructors can apply to teach, publish and manage classes, host live sessions, and track earnings, while administrators oversee user accounts, instructor applications, class approvals, and platform payments[span_12](start_span)[span_12](end_span)[span_13](start_span)[span_13](end_span)[span_14](start_span)[span_14](end_span)[span_15](start_span)[span_15](end_span).

---

## Features

### User Module

- **Wellness Onboarding & BMI Profiling:** Complete a personalized onboarding profile capturing age, gender, height, weight (with automatic BMI and category calculation), fitness level, primary wellness goals, preferred yoga styles, session duration, dietary habits, water intake, and injury history[span_16](start_span)[span_16](end_span)[span_17](start_span)[span_17](end_span)[span_18](start_span)[span_18](end_span)[span_19](start_span)[span_19](end_span).
- **Class & Instructor Discovery:** Browse approved yoga classes, filter by category and experience level, and explore top-enrolled classes and popular instructors[span_20](start_span)[span_20](end_span)[span_21](start_span)[span_21](end_span)[span_22](start_span)[span_22](end_span).
- **AI-Powered Recommendations & Personalized Plans:** Receive personalized yoga plans and ranked class recommendations powered by a dynamic weighted-scoring engine that matches user goals, experience levels, preferred durations, BMI categories, and injury protection needs[span_23](start_span)[span_23](end_span)[span_24](start_span)[span_24](end_span)[span_25](start_span)[span_25](end_span)[span_26](start_span)[span_26](end_span)[span_27](start_span)[span_27](end_span)[span_28](start_span)[span_28](end_span)[span_29](start_span)[span_29](end_span).
- **AI Chatbot & Wellness Tools:** Access an AI chatbot for instant yoga assistance, calendar-based adaptive session recommendations, and photo-based fitness assessments[span_30](start_span)[span_30](end_span)[span_31](start_span)[span_31](end_span)[span_32](start_span)[span_32](end_span).
- **Cart & Stripe Checkout Workflow:** Add classes to a shopping cart and complete course purchases in INR using Stripe payment intents[span_33](start_span)[span_33](end_span)[span_34](start_span)[span_34](end_span)[span_35](start_span)[span_35](end_span).
- **Course Access, Live Rooms & Offline Support:** Access enrolled courses, join authorized live class session rooms, download purchased videos, and utilize offline workout plans and free goal programs[span_36](start_span)[span_36](end_span)[span_37](start_span)[span_37](end_span)[span_38](start_span)[span_38](end_span)[span_39](start_span)[span_39](end_span).
- **1-to-1 Appointments:** Book private one-to-one mentoring sessions and schedule appointments with instructors[span_40](start_span)[span_40](end_span)[span_41](start_span)[span_41](end_span)[span_42](start_span)[span_42](end_span).
- **Payment History & Account Control:** View transaction history and manage or self-delete account profiles[span_43](start_span)[span_43](end_span)[span_44](start_span)[span_44](end_span)[span_45](start_span)[span_45](end_span).
- **Instructor Application:** Apply to become an instructor, view application status, and re-apply if previously rejected[span_46](start_span)[span_46](end_span)[span_47](start_span)[span_47](end_span).

### Instructor Module

- **Instructor Onboarding:** Apply for instructor access and transition roles automatically upon administrator approval[span_48](start_span)[span_48](end_span)[span_49](start_span)[span_49](end_span)[span_50](start_span)[span_50](end_span).
- **Class Creation & Management:** Create, submit, update, and delete yoga classes with thumbnails, video links, seat limits, pricing, levels, and categories[span_51](start_span)[span_51](end_span)[span_52](start_span)[span_52](end_span)[span_53](start_span)[span_53](end_span)[span_54](start_span)[span_54](end_span).
- **Live Session Hosting:** Manage live class statuses (`upcoming`, `live`, `ended`) and host dedicated live session rooms for enrolled students[span_55](start_span)[span_55](end_span)[span_56](start_span)[span_56](end_span)[span_57](start_span)[span_57](end_span).
- **Private Coaching & Appointments:** Conduct private one-to-one yoga sessions and manage learner appointments[span_58](start_span)[span_58](end_span)[span_59](start_span)[span_59](end_span).
- **Status & Earnings Tracking:** Track class approval status, view admin feedback on rejected classes, and monitor student payments and instructor earnings[span_60](start_span)[span_60](end_span)[span_61](start_span)[span_61](end_span)[span_62](start_span)[span_62](end_span)[span_63](start_span)[span_63](end_span).

### Administrator Module

- **Platform Analytics:** View real-time dashboard statistics including approved classes, pending classes, active instructors, total classes, total enrollments, and pending/total instructor applications[span_64](start_span)[span_64](end_span).
- **User & Role Management:** View all registered users, update user profiles and system roles (`user`, `instructor`, `admin`), and delete accounts[span_65](start_span)[span_65](end_span)[span_66](start_span)[span_66](end_span)[span_67](start_span)[span_67](end_span)[span_68](start_span)[span_68](end_span).
- **Instructor Application Review:** Review pending instructor applications enriched with user profile details and approve or reject applicants with custom feedback[span_69](start_span)[span_69](end_span)[span_70](start_span)[span_70](end_span)[span_71](start_span)[span_71](end_span)[span_72](start_span)[span_72](end_span).
- **Class Approval Pipeline:** Review instructor-submitted classes and approve or deny submissions with feedback reasons[span_73](start_span)[span_73](end_span)[span_74](start_span)[span_74](end_span)[span_75](start_span)[span_75](end_span)[span_76](start_span)[span_76](end_span).
- **Payment Monitoring:** Oversee platform payment records and enrollment transactions[span_77](start_span)[span_77](end_span)[span_78](start_span)[span_78](end_span)[span_79](start_span)[span_79](end_span).

---

## System Architecture & Database Design

Yoga Master follows a scalable **Three-Tier Architecture**[span_80](start_span)[span_80](end_span)[span_81](start_span)[span_81](end_span):

| Tier | Technology | Responsibility |
| :--- | :--- | :--- |
| **Presentation Tier** | React.js, HTML, CSS, Tailwind CSS | Responsive user interfaces for Admin, Instructor, and User dashboards, form validation, and API integration[span_82](start_span)[span_82](end_span)[span_83](start_span)[span_83](end_span). |
| **Application Tier** | Node.js, Express.js | REST APIs, business logic, JWT authentication, role verification, Stripe payment processing, and AI recommendation services[span_84](start_span)[span_84](end_span)[span_85](start_span)[span_85](end_span)[span_86](start_span)[span_86](end_span)[span_87](start_span)[span_87](end_span). |
| **Data Tier** | MongoDB Atlas | Cloud NoSQL storage for users, classes, carts, enrollments, payments, instructor applications, reviews, appointments, and programs[span_88](start_span)[span_88](end_span)[span_89](start_span)[span_89](end_span). |

### Core MongoDB Collections (`yoga-master` database)

- `users`: Stores user credentials, roles (`user`, `instructor`, `admin`), profile details, and nested `onboardingProfile` / BMI metrics[span_90](start_span)[span_90](end_span)[span_91](start_span)[span_91](end_span)[span_92](start_span)[span_92](end_span).
- `classes`: Stores class metadata, instructor ownership, pricing, seat availability, total enrollments, live status, and approval status (`pending`, `approved`, `denied`)[span_93](start_span)[span_93](end_span)[span_94](start_span)[span_94](end_span)[span_95](start_span)[span_95](end_span).
- `cart`: Tracks classes selected by learners prior to checkout[span_96](start_span)[span_96](end_span)[span_97](start_span)[span_97](end_span).
- `enrolled`: Maps paid learners and transaction IDs to their enrolled class IDs[span_98](start_span)[span_98](end_span)[span_99](start_span)[span_99](end_span)[span_100](start_span)[span_100](end_span).
- `payments`: Logs Stripe payment transactions, amounts, dates, and enrolled class arrays[span_101](start_span)[span_101](end_span)[span_102](start_span)[span_102](end_span)[span_103](start_span)[span_103](end_span)[span_104](start_span)[span_104](end_span).
- `applied`: Manages instructor applications, experience details, review timestamps, and approval statuses[span_105](start_span)[span_105](end_span)[span_106](start_span)[span_106](end_span)[span_107](start_span)[span_107](end_span)[span_108](start_span)[span_108](end_span).
- `reviews`, `appointments`, `user_programs`: Support class reviews, 1-to-1 session scheduling, and structured yoga programs[span_109](start_span)[span_109](end_span).

---

## Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, JavaScript, HTML5, CSS3, Axios, FontAwesome[span_110](start_span)[span_110](end_span)[span_111](start_span)[span_111](end_span)
- **Backend:** Node.js, Express.js[span_112](start_span)[span_112](end_span)[span_113](start_span)[span_113](end_span)
- **Database:** MongoDB Atlas (MongoDB Node.js Driver)[span_114](start_span)[span_114](end_span)[span_115](start_span)[span_115](end_span)
- **Authentication & Security:** JSON Web Token (JWT), bcrypt, CORS, dotenv[span_116](start_span)[span_116](end_span)[span_117](start_span)[span_117](end_span)[span_118](start_span)[span_118](end_span)
- **Payment Integration:** Stripe API (`stripe` Payment Intents)[span_119](start_span)[span_119](end_span)[span_120](start_span)[span_120](end_span)
- **AI & Personalization:** Google Gemini API, Custom Weighted-Scoring Recommendation Engine[span_121](start_span)[span_121](end_span)[span_122](start_span)[span_122](end_span)
- **Development Tools:** Visual Studio Code, Git, GitHub, Windows 11[span_123](start_span)[span_123](end_span)[span_124](start_span)[span_124](end_span)[span_125](start_span)[span_125](end_span)

---

## Getting Started

### Prerequisites

- **Hardware:** Intel i5 / AMD equivalent processor (2.5 GHz+), 8 GB RAM, 256 GB SSD, and a stable internet connection (10 Mbps+)[span_126](start_span)[span_126](end_span)[span_127](start_span)[span_127](end_span).
- **Software:** Node.js, npm, Git, and a MongoDB Atlas cluster[span_128](start_span)[span_128](end_span)[span_129](start_span)[span_129](end_span)[span_130](start_span)[span_130](end_span).

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

   Create a `.env` file inside the `Backend/` directory and configure your credentials[span_131](start_span)[span_131](end_span)[span_132](start_span)[span_132](end_span):

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

1. **Authentication & Onboarding:** A user registers or logs in (receiving a 24-hour JWT token) and completes their wellness onboarding profile, which calculates their BMI and stores their fitness goals and injury history[span_133](start_span)[span_133](end_span)[span_134](start_span)[span_134](end_span)[span_135](start_span)[span_135](end_span)[span_136](start_span)[span_136](end_span).
2. **AI Discovery & Recommendations:** The user browses approved classes or requests personalized recommendations scored dynamically against their onboarding profile, consults the AI chatbot, or uses calendar-based scheduling[span_137](start_span)[span_137](end_span)[span_138](start_span)[span_138](end_span)[span_139](start_span)[span_139](end_span)[span_140](start_span)[span_140](end_span).
3. **Cart & Stripe Checkout:** The user adds classes to their cart and completes payment via Stripe (`inr`), which automatically records the transaction, clears the cart, updates class seat availability, and enrolls the user[span_141](start_span)[span_141](end_span)[span_142](start_span)[span_142](end_span)[span_143](start_span)[span_143](end_span).
4. **Learning & Live Sessions:** The user accesses enrolled course videos, joins verified live class rooms (`YogaMaster-<ClassTitle>-<ID>`), or books 1-to-1 private instructor sessions[span_144](start_span)[span_144](end_span)[span_145](start_span)[span_145](end_span).
5. **Instructor Application:** An aspiring instructor submits an application via `/as-instructor`, which an administrator reviews and approves to upgrade the user's role to `instructor`[span_146](start_span)[span_146](end_span)[span_147](start_span)[span_147](end_span)[span_148](start_span)[span_148](end_span).
6. **Class Submission & Admin Review:** Instructors submit new classes (defaulting to `pending` status) and administrators approve or deny them with feedback[span_149](start_span)[span_149](end_span)[span_150](start_span)[span_150](end_span)[span_151](start_span)[span_151](end_span)[span_152](start_span)[span_152](end_span).

---

## Project Structure

```text
Yoga-app/
├── Backend/                                                    # Node.js & Express.js API server[span_153](start_span)[span_153](end_span)
│   ├── data/programsData.js                                    # Free yoga programs data[span_154](start_span)[span_154](end_span)
│   └── index.js                                                # Main server, routes, JWT & MongoDB config[span_155](start_span)[span_155](end_span)[span_156](start_span)[span_156](end_span)
├── Frontend/                                                   # React.js & Vite client application[span_157](start_span)[span_157](end_span)
├── .gitattributes                                              # Git configuration
├── README.md                                                   # Project documentation
├── Yoga-Master-AI-Enhanced-Online-Yoga-Learning-Platform.pdf   # Full MCA Project Report[span_158](start_span)[span_158](end_span)
├── Yoga_Master_Feature_Set_Abstract.docx                       # Feature set and abstract
├── mca_Project.docx                                            # MCA project documentation
└── promt.docx                                                  # Supporting project document
```

---

## Security

- **JWT Authentication:** Protected API endpoints validate bearer tokens via `verifyJWT` middleware with 24-hour token expiration[span_159](start_span)[span_159](end_span)[span_160](start_span)[span_160](end_span).
- **Role-Based Access Control (RBAC):** Dedicated `verifyAdmin` and `verifyInstructor` middlewares restrict sensitive operations (user deletion, class approval, instructor onboarding, live status updates) to authorized roles[span_161](start_span)[span_161](end_span)[span_162](start_span)[span_162](end_span)[span_163](start_span)[span_163](end_span)[span_164](start_span)[span_164](end_span)[span_165](start_span)[span_165](end_span).
- **Password & Credential Security:** User passwords are hashed using `bcrypt`, and sensitive keys (`MONGODB_URI`, `ACCESS_SECRET`) are managed via `dotenv` environment variables[span_166](start_span)[span_166](end_span)[span_167](start_span)[span_167](end_span)[span_168](start_span)[span_168](end_span)[span_169](start_span)[span_169](end_span).
- **Live Room & Payment Validation:** Live session endpoints verify student enrollment or instructor ownership before granting room access, and payments are processed through Stripe Payment Intents[span_170](start_span)[span_170](end_span)[span_171](start_span)[span_171](end_span).

---

## Future Enhancements

While AI chatbot support, personalized yoga plan generation, calendar-based recommendations, and photo-based fitness assessments are integrated into the platform[span_172](start_span)[span_172](end_span)[span_173](start_span)[span_173](end_span), planned future enhancements include:

- **AI-Based Posture Analysis:** Real-time camera-based posture correction and alignment feedback[span_174](start_span)[span_174](end_span)[span_175](start_span)[span_175](end_span).
- **Wearable Device Integration:** Syncing with smartwatches and fitness bands to track heart rate, sleep patterns, and physical activity[span_176](start_span)[span_176](end_span).
- **Mobile Application:** Dedicated cross-platform mobile app for iOS and Android[span_177](start_span)[span_177](end_span).
- **Voice-Based AI Interaction:** Voice commands and spoken responses for hands-free interaction with the AI yoga assistant during practice[span_178](start_span)[span_178](end_span).
- **Advanced Progress Analytics:** Detailed visual charts, streak analytics, and automated practice reminders[span_179](start_span)[span_179](end_span).

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

This project was developed in partial fulfillment of the **Master of Computer Applications (MCA)** degree at **MES Advanced Institute of Management and Technology (MES AIMAT), Marampally** (affiliated with **Mahatma Gandhi University, Kottayam**, 2025–2027)[span_180](start_span)[span_180](end_span)[span_181](start_span)[span_181](end_span):

- **Agnivesh R** (Reg. No: 253242210534) — [@Rushermanz](https://github.com/Rushermanz)[span_182](start_span)[span_182](end_span)
- **Sebin Babu** — [@sebinbabu5555](https://github.com/sebinbabu5555)[span_183](start_span)[span_183](end_span)
- **Project Guide:** Ms. Jaseena CY, Department of Computer Applications[span_184](start_span)[span_184](end_span)[span_185](start_span)[span_185](end_span)

---

**Yoga Master** — *Learn, practice, and grow through yoga.*
