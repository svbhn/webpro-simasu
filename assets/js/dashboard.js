// Ambil elemen penting
const navItems = document.querySelectorAll('.nav-item');
const logoutBtn = document.getElementById('logoutBtn');

//Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const targetPage = item.getAttribute('href');

        if (targetPage && targetPage !== '#') {
            window.location.href = targetPage;
        } else {
            const navText = item.querySelector('.nav-text').textContent;
            showNotification(`Halaman ${navText} akan segera tersedia`);
        }
    });
});


//Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // popup konfirmasi custom
        showConfirmPopup('Apakah Anda yakin ingin keluar?', () => {
            showNotification('Logout berhasil!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    });
}

//notifikasi
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #16a34a;
        color: white;
        padding: 14px 22px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

//animasi notif
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
}
`;
document.head.appendChild(style);

//popup logout
function showConfirmPopup(message, onConfirm) {
    // buat overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        background: white;
        padding: 24px 32px;
        border-radius: 12px;
        text-align: center;
        width: 300px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s ease;
    `;
    box.innerHTML = `
        <p style="font-size:16px; margin-bottom:20px; color:#333;">${message}</p>
        <div style="display:flex; justify-content:space-between; gap:10px;">
            <button id="yesBtn" style="flex:1; padding:10px; background:#16a34a; color:white; border:none; border-radius:8px; cursor:pointer;">Ya</button>
            <button id="noBtn" style="flex:1; padding:10px; background:#e5e7eb; color:#111; border:none; border-radius:8px; cursor:pointer;">Batal</button>
        </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // animasi hilang
    const fadeOut = () => {
        box.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    };

    box.querySelector('#yesBtn').addEventListener('click', () => {
        fadeOut();
        onConfirm();
    });
    box.querySelector('#noBtn').addEventListener('click', fadeOut);

    // animasi CSS
    const animStyle = document.createElement('style');
    animStyle.textContent = `
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }
    `;
    document.head.appendChild(animStyle);
}

console.log('SIMASU Dashboard aktif dan siap digunakan');
