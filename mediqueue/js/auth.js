// ============================================================
//  MEDIQUEUE — AUTH MODULE
// ============================================================
const AUTH = {
  _getStorage() {
    try {
      if (typeof getDB === 'function') return getDB();
      return { patients: [], doctors: [] };
    } catch(e) { return { patients: [], doctors: [] }; }
  },
  login(role, id, password) {
    const db = this._getStorage();
    const userList = role === 'patient' ? db.patients : db.doctors;
    if (!userList) return { success:false, error:"System error: role not found." };
    const user = userList.find(u => u.id === id && u.password === password);
    if (user) {
      localStorage.setItem('mq_role', role);
      localStorage.setItem('mq_user_id', user.id);
      localStorage.setItem('mq_user_name', user.name);
      return { success:true, user };
    }
    return { success:false, error:`Invalid ${role.charAt(0).toUpperCase()+role.slice(1)} ID or password.` };
  },
  logout() {
    ['mq_role','mq_user_id','mq_user_name'].forEach(k => localStorage.removeItem(k));
    window.location.href = 'index.html';
  },
  getCurrentUser() {
    const role = localStorage.getItem('mq_role');
    const id   = localStorage.getItem('mq_user_id');
    if (!role || !id) return null;
    const db = this._getStorage();
    const list = role === 'patient' ? db.patients : db.doctors;
    const user = list.find(u => u.id === id);
    return user ? { ...user, role } : null;
  },
  requireAuth(expectedRole) {
    const user = this.getCurrentUser();
    if (!user || user.role !== expectedRole) {
      window.location.href = expectedRole === 'patient' ? 'patient-login.html' : 'doctor-login.html';
      return null;
    }
    return user;
  }
};
