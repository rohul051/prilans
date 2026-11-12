# Prilans - University Student Freelance Platform
### Daffodil International University • Dept. of Software Engineering
**Course Code:** SE331 | **Title:** Software Engineering Design Capstone Project (Assessment 2)

---

## 📌 Project Overview
**Prilans** is a modern freelance marketplace designed to connect university students with small businesses and individuals who need affordable services such as website development, graphic design, content writing, and programming.

The platform is built with **Next.js (App Router, TSX)** on the frontend and **Firebase Firestore** on the database layer, with full fallback support for offline/demo evaluation.

---

## 📊 Marksheet & Feature Implementation Coverage (Total: 88 Marks)

### 1. Required Features (63 Marks)
| Feature | Marks | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **Student registration / login** | **8** | ✅ Complete | Role switcher built into sidebar profile card allowing instant toggle between **Student** (`Akmal Nasrullah`), **Client** (`HAV Digital GmbH`), and **Admin**. Full authentication data models. |
| **Create student skill profile** | **8** | ✅ Complete | Interactive modal allowing students to update their University (DIU), Major, Bio, Hourly Rate, Experience Level, and manage skill tags with autocomplete suggestions. |
| **Publish a project / job request** | **8** | ✅ Complete | Accessible via header "+ Publish Project" or "Companies & Jobs". Employers specify title, category, experience requirements, budget (hourly/fixed), and required skill tags. |
| **Browse available projects** | **7** | ✅ Complete | Faithful replica of the assessment UI mockup (`prilans.com`), displaying client verification badges, country flags, rates, proposals count, and relative timestamps. |
| **Search / filter projects** | **7** | ✅ Complete | Left sidebar filters supporting categories, experience levels (Entry, Intermediate, Expert), project type (Hourly vs Fixed Price), budget ranges, and proposal counts. |
| **Apply for a project** | **8** | ✅ Complete | Students click "Apply Now" to open a proposal drawer with proposed rate/bid, estimated delivery time, cover letter, and portfolio/GitHub links. |
| **View application status** | **7** | ✅ Complete | "My Proposals" tab tracks real-time progress: `Pending`, `Under Review`, `Shortlisted`, `Accepted`, `Rejected`, and `Completed` with client feedback. |
| **Admin dashboard** | **10** | ✅ Complete | Dedicated Admin portal featuring KPI analytics, student credential verification system, project moderation/deletion, and real-time audit logs. |

---

### 2. Advanced Features (20 Marks)
| Advanced Feature | Marks | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **Skill-based project recommendations** | **5** | ✅ Complete | Calculates exact skill overlap percentage between the student's profile and each project. Features a "My Skill Matches" filter toggle in the header. |
| **Student portfolio management** | **5** | ✅ Complete | "My Portfolio" tab where students can add, showcase, and delete projects with preview mockups, tech badges, and live demo / GitHub repo links. |
| **Project application status updates** | **5** | ✅ Complete | In the "Companies & Jobs" tab, clients can view applicants and update proposal status to Under Review, Shortlisted, Accepted, or Rejected with real-time student notifications. |
| **Rating and review system** | **5** | ✅ Complete | Interactive 5-star rating and written review modal accessible once a proposal is Accepted or Completed, updating user public average score. |

---

### 3. Bonus Challenge (5 Marks)
| Bonus Challenge | Marks | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **Student-to-Project Matching Engine** | **5** | ✅ Complete | Intelligent algorithm weighing: <br>• **70%**: Skill overlap with project requirements <br>• **15%**: Experience level compatibility <br>• **15%**: Student average star rating and review history <br>Clients can view ranked student candidates and invite them directly. |

---

## 🚀 Running the Project

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm start
```

---

## 🔥 Firebase Configuration
The application is pre-configured with a hybrid data service:
1. **Out of the box**: Works immediately with rich seed data matching the exam screenshots (`Let's Collaborate on HAV's Website Redesign`, `Build/Edit Landing Page for Online Course`, `Web Designer for E-Commerce Website`, and `Website Designer`).
2. **Connecting Live Firebase**:
   - Create a project on [Firebase Console](https://console.firebase.google.com).
   - Enable **Firestore Database**.
   - Copy `.env.example` to `.env.local` and add your keys, or click the **Firebase Database icon** in the sidebar to paste your Firebase config in the modal and click **"Seed Firestore"**!
"# prilans" 
