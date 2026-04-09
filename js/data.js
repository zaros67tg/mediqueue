// ============================================================
//  MEDIQUEUE — MOCK DATABASE GENERATOR
// ============================================================

const DEPARTMENTS = [
  { id: "DEPT-001", name: "Cardiology",       icon: "❤️",  color: "#e05555", prefix: "CARD" },
  { id: "DEPT-002", name: "Neurology",        icon: "🧠",  color: "#5b9bd5", prefix: "NEUR" },
  { id: "DEPT-003", name: "General Medicine", icon: "🩺",  color: "#4caf88", prefix: "GENM" },
  { id: "DEPT-004", name: "Dermatology",      icon: "✨",  color: "#c9933a", prefix: "DERM" },
  { id: "DEPT-005", name: "Orthopedics",      icon: "🦴",  color: "#a07030", prefix: "ORTH" },
  { id: "DEPT-006", name: "Gynecology",       icon: "🌸",  color: "#c45e8a", prefix: "GYNE" },
  { id: "DEPT-007", name: "Pediatrics",       icon: "👶",  color: "#9c27b0", prefix: "PEDI" },
  { id: "DEPT-008", name: "Ophthalmology",    icon: "👁️", color: "#00bcd4", prefix: "EYES" }
];

const DOCTOR_NAMES = [
  "Dr. Anjali Kapoor","Dr. Vikram Nair","Dr. Ramesh Singh","Dr. Sneha Patel",
  "Dr. Arjun Bose","Dr. Meera Krishnan","Dr. Rohan Sharma","Dr. Kavita Desai",
  "Dr. Sameer Reddy","Dr. Priya Iyer"
];
const DOCTOR_SPECS = [
  "Cardiology","Neurology","General Medicine","Dermatology","Orthopedics",
  "Gynecology","Pediatrics","Ophthalmology","General Medicine","Cardiology"
];

const DOCTORS = DOCTOR_NAMES.map((name, i) => {
  const currentQueueSize = Math.floor(Math.random() * 20);
  const avgConsultationTime = 10 + Math.floor(Math.random() * 10);
  const department = DOCTOR_SPECS[i];
  return {
    id: `DOC-${String(i+1).padStart(3,'0')}`,
    name, specialty: department, department,
    qualification: "MBBS, MD, FRCP",
    experience: 10 + (i % 15),
    hospital: "MediQueue General Hospital",
    rating: +(4.0 + Math.random()).toFixed(1),
    reviewsCount: 100 + Math.floor(Math.random() * 500),
    consultationFee: 500 + Math.floor(Math.random() * 10) * 100,
    avgConsultationTime,
    availableDays: ["Mon","Tue","Wed","Thu","Fri","Sat"].filter(() => Math.random() > 0.3),
    currentQueueSize,
    waitTime: `${currentQueueSize * avgConsultationTime} mins`,
    languages: ["English","Hindi"],
    about: "Experienced specialist with years of medical practice.",
    isAvailable: Math.random() > 0.2,
    password: "doc",
    roomNo: `OPD-${i+1}${String.fromCharCode(65 + (i%5))}`,
    initials: name.replace('Dr. ','').split(' ').map(n=>n[0]).join(''),
    color: DEPARTMENTS.find(d => d.name === department)?.color || "#5b9bd5"
  };
});

const PATIENT_FIRST_NAMES = ["Amit","Rahul","Priya","Neha","Rohan","Sneha","Karan","Pooja","Vikram","Anjali","Sameer","Kavita","Arjun","Meera","Suresh","Ramesh","Deepa","Divya","Sanjay","Anita","Sunil","Geeta","Ajay","Rekha","Vijay"];
const PATIENT_LAST_NAMES  = ["Sharma","Patel","Singh","Kumar","Desai","Reddy","Iyer","Nair","Bose","Kapoor","Mehta","Chopra","Joshi","Gupta","Das","Rao","Verma","Chauhan","Sen","Yadav"];

const PATIENTS = Array.from({length: 50}, (_, i) => {
  const fName = PATIENT_FIRST_NAMES[Math.floor(Math.random() * PATIENT_FIRST_NAMES.length)];
  const lName = PATIENT_LAST_NAMES[Math.floor(Math.random() * PATIENT_LAST_NAMES.length)];
  const age   = 18 + Math.floor(Math.random() * 60);
  const doc   = DOCTORS[Math.floor(Math.random() * DOCTORS.length)];
  const appointments = [];
  if (Math.random() > 0.4) {
    const queuePos = doc.currentQueueSize > 0 ? Math.floor(Math.random() * doc.currentQueueSize) + 1 : 1;
    const deptPrefix = DEPARTMENTS.find(d => d.name === doc.specialty)?.prefix || 'GENM';
    appointments.push({
      id: `APT-${1000 + i}`,
      doctorId: doc.id, doctorName: doc.name, department: doc.specialty,
      date: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
      time: "10:00 AM",
      token: `${deptPrefix}-${String(Math.floor(Math.random()*50)+1).padStart(3,'0')}`,
      consultationCode: `C-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
      queuePosition: queuePos,
      estimatedWait: `${queuePos * doc.avgConsultationTime} mins`,
      status: "upcoming", roomNo: doc.roomNo,
      symptoms: "Headache and fever",
      priority: { level:'Medium', color:'warning', icon:'🟡', score:2 }
    });
  }
  return {
    id: `PAT-2026-${String(i+1).padStart(3,'0')}`,
    name: `${fName} ${lName}`,
    dob: new Date(new Date().getFullYear()-age, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toISOString().split('T')[0],
    age, gender: Math.random()>0.5?"Male":"Female",
    bloodGroup: ["A+","O+","B+","AB+","A-","O-"][Math.floor(Math.random()*6)],
    phone: `+91 98${Math.floor(10000000+Math.random()*90000000)}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`,
    address: "Pune, Maharashtra, India",
    emergencyContact: `+91 99${Math.floor(10000000+Math.random()*90000000)}`,
    allergies: Math.random()>0.7?["Dust","Pollen"]:["None"],
    password: "pat",
    joinedOn: "2024-01-15",
    appointments, diagnoses: [], medications: [], testResults: []
  };
});

const DEFAULT_DB = { patients: PATIENTS, doctors: DOCTORS, departments: DEPARTMENTS };

function initDB() {
  if (!localStorage.getItem('mq_db')) {
    localStorage.setItem('mq_db', JSON.stringify(DEFAULT_DB));
  }
}
function getDB() {
  const stored = localStorage.getItem('mq_db');
  if (stored) { try { return JSON.parse(stored); } catch(e) { return DEFAULT_DB; } }
  return DEFAULT_DB;
}
function saveDB(db) { localStorage.setItem('mq_db', JSON.stringify(db)); }
function resetDB()  { localStorage.removeItem('mq_db'); initDB(); }

initDB();
