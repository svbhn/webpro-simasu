const navItems = document.querySelectorAll('.nav-item');
const logoutBtn = document.getElementById('logoutBtn');

const currentPath = location.pathname.split('/').pop().toLowerCase() || 'profile.html';
navItems.forEach(item => {
  const href = (item.getAttribute('href') || '').toLowerCase();
  if (href === currentPath) item.classList.add('active');
});

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const target = item.getAttribute('href');
    if (!target || target === '#') {
      e.preventDefault();
      const navText = item.querySelector('.nav-text')?.textContent || 'Halaman';
      showNotification(`Halaman ${navText} akan segera tersedia`);
    }
  });
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    showConfirmPopup('Apakah Anda yakin ingin keluar?', () => {
      showNotification('Logout berhasil!');
      setTimeout(() => { window.location.href = 'index.html'; }, 900);
    });
  });
}

function showNotification(message, type = 'success') {
  const bg = type === 'error' ? '#dc2626' : '#16a34a';
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background-color: ${bg}; color: white;
    padding: 14px 22px; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000; animation: slideIn 0.25s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.25s ease';
    setTimeout(() => notification.remove(), 250);
  }, 2500);
}

const notifStyle = document.createElement('style');
notifStyle.textContent = `
@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
`;
document.head.appendChild(notifStyle);

function showConfirmPopup(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; align-items: center; z-index: 9999;
  `;
  const box = document.createElement('div');
  box.style.cssText = `
    background: white; padding: 24px 32px; border-radius: 12px; text-align: center; width: 300px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: fadeIn 0.2s ease;
  `;
  box.innerHTML = `
    <p style="font-size:16px; margin-bottom:20px; color:#333;">${message}</p>
    <div style="display:flex; justify-content:space-between; gap:10px;">
      <button id="yesBtn" style="flex:1; padding:10px; background:#16a34a; color:#fff; border:none; border-radius:8px; cursor:pointer;">Ya</button>
      <button id="noBtn" style="flex:1; padding:10px; background:#e5e7eb; color:#111; border:none; border-radius:8px; cursor:pointer;">Batal</button>
    </div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const fadeOut = () => { box.style.animation = 'fadeOut 0.2s ease'; setTimeout(() => overlay.remove(), 200); };
  box.querySelector('#yesBtn').addEventListener('click', () => { fadeOut(); onConfirm && onConfirm(); });
  box.querySelector('#noBtn').addEventListener('click', fadeOut);

  const animStyle = document.createElement('style');
  animStyle.textContent = `
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
  `;
  document.head.appendChild(animStyle);
}

(function () {
  const LS_USER_KEY = 'simasuUser';
  const LS_PASS_KEY = 'simasuPassword';

  if (!localStorage.getItem(LS_PASS_KEY)) {
    localStorage.setItem(LS_PASS_KEY, 'admin123');
  }

  const nameEl   = document.querySelector('.profile-card h3');
  const roleEl   = document.querySelector('.profile-card .role');
  const joinedEl = document.querySelector('.profile-card .joined');
  const avatarEl = document.querySelector('.profile-card .avatar');

  const defaultUser = {
    fullName: nameEl?.textContent?.trim() || 'Pengguna',
    role:     roleEl?.textContent?.trim() || 'Administrator',
    email:    '',
    phone:    '',
    address:  '',
    joined:   joinedEl?.textContent?.trim() || 'Terdaftar'
  };

  const saveUser = (obj) => localStorage.setItem(LS_USER_KEY, JSON.stringify(obj));
  const loadUser = () => { try { return JSON.parse(localStorage.getItem(LS_USER_KEY)) || null; } catch { return null; } };
  const getInitials = (name = '') => (name.trim().split(/\s+/).map(p => p[0]).join('').slice(0,2) || 'U').toUpperCase();
  const emailValid  = (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const phoneClean  = (val) => val.replace(/[^\d+]/g, '');
  const strongPassword = (p='') => p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);

  const user = loadUser() || defaultUser;

  if (nameEl)   nameEl.textContent   = user.fullName;
  if (roleEl)   roleEl.textContent   = user.role;
  if (joinedEl) joinedEl.textContent = user.joined;
  if (avatarEl) avatarEl.textContent = getInitials(user.fullName);

  const infoForm   = document.getElementById('infoForm');
  const fullNameIn = document.getElementById('fullName');
  const roleIn     = document.getElementById('roleInput');
  const emailIn    = document.getElementById('email');
  const phoneIn    = document.getElementById('phone');
  const addressIn  = document.getElementById('address');

  if (fullNameIn) fullNameIn.value = user.fullName || '';
  if (roleIn)     roleIn.value     = user.role || '';
  if (emailIn)    emailIn.value    = user.email || '';
  if (phoneIn)    phoneIn.value    = user.phone || '';
  if (addressIn)  addressIn.value  = user.address || '';

  infoForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const updated = {
      ...user,
      fullName: (fullNameIn?.value || '').trim(),
      role:     (roleIn?.value     || '').trim(),
      email:    (emailIn?.value    || '').trim(),
      phone:    phoneClean((phoneIn?.value || '').trim()),
      address:  (addressIn?.value  || '').trim()
    };

    if (!updated.fullName || !updated.role) {
      showNotification('Nama dan Jabatan wajib diisi.');
      return;
    }
    if (!emailValid(updated.email)) {
      showNotification('Format email tidak valid.');
      return;
    }

    saveUser(updated);

    if (nameEl) nameEl.textContent = updated.fullName;
    if (roleEl) roleEl.textContent = updated.role;
    if (avatarEl) avatarEl.textContent = getInitials(updated.fullName);

    showNotification('Perubahan profil berhasil disimpan.');
  });

  const passwordForm   = document.getElementById('passwordForm');
  const currentPassIn  = document.getElementById('currentPassword');
  const newPassIn      = document.getElementById('newPassword');
  const confirmPassIn  = document.getElementById('confirmPassword');

  passwordForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const current = currentPassIn?.value || '';
    const next    = newPassIn?.value     || '';
    const confirm = confirmPassIn?.value || '';
    const stored  = localStorage.getItem(LS_PASS_KEY) || '';

    if (current !== stored) {
      showNotification('Kata sandi saat ini salah.');
      return;
    }
    if (next !== confirm) {
      showNotification('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (next === stored) {
      showNotification('Kata sandi baru tidak boleh sama dengan yang lama.');
      return;
    }
    if (!strongPassword(next)) {
      showNotification('Minimal 6 karakter, wajib ada huruf BESAR, huruf kecil, dan angka.');
      return;
    }

    localStorage.setItem(LS_PASS_KEY, next);

    if (currentPassIn) currentPassIn.value = '';
    if (newPassIn)     newPassIn.value     = '';
    if (confirmPassIn) confirmPassIn.value = '';

    showNotification('Kata sandi berhasil diubah.');
  });
})();