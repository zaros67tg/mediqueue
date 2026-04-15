🏥 MediQueue — Smart Healthcare Queue Management
Medicine Without The Wait. MediQueue is a high-fidelity 
healthcare portal designed to eliminate long waiting times in 
hospitals through real-time queue tracking and AI-driven triage.

🌟 Key Features
Problem Desk (AI Triage): Patients describe symptoms in natural language. 
The system calculates an urgency score and automatically routes them to the correct department (e.g., Cardiology, Neurology).

Live Queue Tracking: Real-time visualization of queue position, 
estimated wait times, and progress bars for both patients and doctors.

Doctor Console: A clinical dashboard for specialists to manage 
their live queue, view patient medical history, and input digital prescriptions.

Patient Health Dossier: A comprehensive view of medical records,
including diagnoses, active medications, and lab test results.

Doctor Comparison: A tool for patients to compare 
specialists based on experience, fees, ratings, and real-time availability.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Custom Tokens & Glassmorphism)

Logic: Vanilla JavaScript (ES6+)

Data Persistence: Browser localStorage (Mock Database Architecture)

Design: Playfair Display (Serif) & Inter (Sans) typography with a Luxury Navy & Gold theme.

🚀 Quick Start
Clone the repository:

Bash
git clone https://github.com/zaros67tg/mediqueue.git
Run with Live Server:
Open index.html using the VS Code Live Server extension or any local web server.

🔑 Demo Credentials
Patient Portal:

ID: PAT-2026-001

Password: pat

Doctor Portal:

ID: DOC-001

Password: doc

🧠 System Logic
The engine uses a Weighted Priority Algorithm. Appointments are sequenced based on 
a combination of booking time and the severity of symptoms (High, Medium, Low triage levels). As doctors mark 
consultations as complete, the system dynamically recalculates wait times for all remaining patients in the queue.
