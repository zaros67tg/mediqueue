// ============================================================
//  MEDIQUEUE — IMPROVED QUEUE ENGINE
// ============================================================

const QUEUE = {

  DEPT_PREFIX: {
    'Cardiology': 'CARD',
    'Neurology': 'NEUR',
    'General Medicine': 'GENM',
    'Dermatology': 'DERM',
    'Orthopedics': 'ORTH',
    'Gynecology': 'GYNE',
    'Pediatrics': 'PEDI',
    'Ophthalmology': 'EYES'
  },

  // ---- Token (UNIQUE) ----
  generateToken(department) {
    const prefix = this.DEPT_PREFIX[department] || department.slice(0, 4).toUpperCase();
    const unique = Date.now().toString().slice(-4); // time entropy
    return `${prefix}-${unique}`;
  },

  // ---- Wait Time ----
  calculateWaitTime(doctor, position) {
    return position * doctor.avgConsultationTime;
  },

  formatWaitTime(minutes) {
    if (minutes <= 0) return 'Next';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  },

  // ---- Priority ----
  getPriority(symptoms) {
    const text = (symptoms || '').toLowerCase();

    const HIGH = ['chest pain','breathing','stroke','unconscious','seizure','bleeding'];
    const MED  = ['fever','vomiting','fracture','pain','dizziness'];

    if (HIGH.some(k => text.includes(k))) return { level:'High', score:1 };
    if (MED.some(k => text.includes(k)))  return { level:'Medium', score:2 };
    return { level:'Low', score:3 };
  },

  // ---- Get Queue (IMPORTANT CORE) ----
  getDoctorQueue(db, doctorId) {
    return db.patients
      .flatMap(p => p.appointments.map(a => ({...a, patientId: p.id})))
      .filter(a => a.doctorId === doctorId && a.status === 'upcoming')
      .sort((a, b) => {
        // Priority first, then booking time
        if (a.priority.score !== b.priority.score) {
          return a.priority.score - b.priority.score;
        }
        return new Date(a.bookedAt) - new Date(b.bookedAt);
      });
  },

  // ---- Recalculate Queue Positions ----
  syncQueue(db, doctorId) {
    const queue = this.getDoctorQueue(db, doctorId);

    queue.forEach((appt, index) => {
      const patient = db.patients.find(p => p.id === appt.patientId);
      const target = patient.appointments.find(a => a.id === appt.id);

      target.queuePosition = index + 1;

      const doctor = db.doctors.find(d => d.id === doctorId);
      target.estimatedWait = this.formatWaitTime(
        this.calculateWaitTime(doctor, index)
      );
    });

    const doctor = db.doctors.find(d => d.id === doctorId);
    doctor.currentQueueSize = queue.length;
  },

  // ---- Book Appointment ----
  bookAppointment(patientId, doctorId, timeSlot, symptoms) {
    const db = getDB();

    const doctor = db.doctors.find(d => d.id === doctorId);
    if (!doctor || !doctor.isAvailable) {
      return { success:false, error:'Doctor unavailable' };
    }

    const patient = db.patients.find(p => p.id === patientId);
    if (!patient) return { success:false, error:'Patient not found' };

    const duplicate = patient.appointments.find(
      a => a.doctorId === doctorId && a.status === 'upcoming'
    );
    if (duplicate) {
      return { success:false, error:'Already booked' };
    }

    const appointment = {
      id: `APT-${Date.now()}`,
      doctorId,
      doctorName: doctor.name,
      department: doctor.specialty,
      date: new Date().toLocaleDateString('en-IN'),
      time: timeSlot || 'Today',
      token: this.generateToken(doctor.specialty),
      status: 'upcoming',
      roomNo: doctor.roomNo,
      bookedAt: new Date().toISOString(),
      priority: this.getPriority(symptoms),
      symptoms: symptoms || '',
      queuePosition: null,
      estimatedWait: null
    };

    patient.appointments.unshift(appointment);

    // 🔥 Sync queue properly
    this.syncQueue(db, doctorId);

    saveDB(db);

    return { success:true, appointment };
  },

  // ---- Complete ----
  markCompleted(doctorId, appointmentId, patientId) {
    const db = getDB();

    const patient = db.patients.find(p => p.id === patientId);
    if (!patient) return false;

    const appt = patient.appointments.find(a => a.id === appointmentId);
    if (appt) {
      appt.status = 'completed';
    }

    // 🔥 Re-sync queue after removal
    this.syncQueue(db, doctorId);

    saveDB(db);
    return true;
  },

  // ---- Tick (REALISTIC) ----
  tick() {
    const db = getDB();

    db.doctors.forEach(doctor => {
      if (!doctor.isAvailable) return;

      const queue = this.getDoctorQueue(db, doctor.id);

      if (queue.length === 0) return;

      const first = queue[0];

      // Simulate consultation completion
      if (Math.random() < 0.2) {
        const patient = db.patients.find(p => p.id === first.patientId);
        const appt = patient.appointments.find(a => a.id === first.id);

        appt.status = 'completed';

        this.syncQueue(db, doctor.id);
      }
    });

    saveDB(db);
  }
};