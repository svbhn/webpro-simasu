let roomsData = [];

async function loadRooms() {
    try {
        const response = await fetch('assets/list_rooms.json');
        const data = await response.json();
        roomsData = data.rooms;
        displayRooms(roomsData);
    } catch (error) {
        console.error('Error loading rooms:', error);
        roomsData = getRoomsData();
        displayRooms(roomsData);
    }
}

function getRoomsData() {
    return [
        {
            id: 1,
            name: "Aula Utama",
            floor: "Lantai 1",
            description: "Ruang utama untuk acara besar dan pengajian",
            capacity: 200,
            status: "tersedia"
        },
        {
            id: 2,
            name: "Ruang Pertemuan",
            floor: "Lantai 2",
            description: "Ruang pertemuan dengan AC dan proyektor",
            capacity: 50,
            status: "disewa"
        },
        {
            id: 3,
            name: "Kamar Tidur Jamaah",
            floor: "Lantai 2",
            description: "Kamar tidur untuk jamaah yang menginap",
            capacity: 20,
            status: "tersedia"
        },
        {
            id: 4,
            name: "Dapur Masjid",
            floor: "Lantai 1",
            description: "Dapur lengkap dengan peralatan memasak",
            capacity: 0,
            status: "pemeliharaan"
        },
        {
            id: 5,
            name: "Ruang Anak-anak",
            floor: "Lantai 1",
            description: "Ruang bermain dan belajar untuk anak-anak",
            capacity: 30,
            status: "tersedia"
        },
        {
            id: 6,
            name: "Perpustakaan",
            floor: "Lantai 2",
            description: "Perpustakaan dengan koleksi buku islami",
            capacity: 25,
            status: "tersedia"
        }
    ];
}

function displayRooms(rooms) {
    const roomGrid = document.getElementById('roomGrid');
    roomGrid.innerHTML = '';
    rooms.forEach(room => {
        const roomCard = createRoomCard(room);
        roomGrid.appendChild(roomCard);
    });
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';
    const statusBadgeClass = `badge-${room.status}`;
    const statusText = getStatusText(room.status);
    card.innerHTML = `
        <div class="room-header">
            <div>
                <h3 class="room-title">${room.name}</h3>
            </div>
            <span class="room-badge ${statusBadgeClass}">${statusText}</span>
        </div>
        <div class="room-location">
            <span>${room.floor}</span>
        </div>
        <p class="room-description">${room.description}</p>
        <div class="room-info">
            <div class="info-item">
                <span class="info-text">Kapasitas: ${room.capacity} orang</span>
            </div>
        </div>
        <div class="room-actions">
            <button class="btn btn-outline" onclick="pesanRuangan(${room.id})">
                <span>Pesan</span>
            </button>
            <button class="btn btn-secondary" onclick="lihatDetail(${room.id})">
                Detail
            </button>
        </div>
    `;
    return card;
}

function getStatusText(status) {
    const statusMap = {
        'tersedia': 'Tersedia',
        'disewa': 'Disewa',
        'pemeliharaan': 'Pemeliharaan'
    };
    return statusMap[status] || status;
}

function pesanRuangan(roomId) {
    alert(`Memproses pemesanan untuk ruangan ID: ${roomId}`);
}

function lihatDetail(roomId) {
    const room = roomsData.find(r => r.id === roomId);
    if (room) {
        showDetailModal(room);
    }
}

function showDetailModal(room) {
    const statusText = getStatusText(room.status); 
    const modalHTML = `
        <div class="modal-overlay" id="detailModal" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title">Detail Ruangan</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="detail-row">
                        <span class="detail-label">Nama Ruangan:</span>
                        <span class="detail-value">${room.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Lokasi:</span>
                        <span class="detail-value">${room.floor}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="room-badge badge-${room.status}">${statusText}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Kapasitas:</span>
                        <span class="detail-value">${room.capacity} orang</span>
                    </div>
                    <div class="detail-row full">
                        <span class="detail-label">Deskripsi:</span>
                        <p class="detail-description">${room.description}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Tutup</button>
                    <button class="btn btn-primary" onclick="pesanRuangan(${room.id}); closeModal();">
                        Pesan Ruangan
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function showAddRoomModal() {
    const modalHTML = `
        <div class="modal-overlay" id="addRoomModal" onclick="closeAddModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title">Tambah Ruangan Baru</h2>
                    <button class="modal-close" onclick="closeAddModal()">&times;</button>
                </div>
                <form id="addRoomForm" onsubmit="handleAddRoom(event)">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Nama Ruangan <span class="required">*</span></label>
                            <input type="text" id="roomName" class="form-input" placeholder="Contoh: Aula Serbaguna" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Lantai <span class="required">*</span></label>
                            <select id="roomFloor" class="form-input" required>
                                <option value="">Pilih Lantai</option>
                                <option value="Lantai 1">Lantai 1</option>
                                <option value="Lantai 2">Lantai 2</option>
                                <option value="Lantai 3">Lantai 3</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Deskripsi <span class="required">*</span></label>
                            <textarea id="roomDescription" class="form-input" rows="3" placeholder="Deskripsi ruangan..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Kapasitas (orang) <span class="required">*</span></label>
                            <input type="number" id="roomCapacity" class="form-input" min="0" placeholder="0" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status <span class="required">*</span></label>
                            <select id="roomStatus" class="form-input" required>
                                <option value="">Pilih Status</option>
                                <option value="tersedia">Tersedia</option>
                                <option value="disewa">Disewa</option>
                                <option value="pemeliharaan">Pemeliharaan</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeAddModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan Ruangan</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function handleAddRoom(event) {
    event.preventDefault();
    
    const newRoom = {
        id: roomsData.length > 0 ? Math.max(...roomsData.map(r => r.id)) + 1 : 1,
        name: document.getElementById('roomName').value,
        floor: document.getElementById('roomFloor').value,
        description: document.getElementById('roomDescription').value,
        capacity: parseInt(document.getElementById('roomCapacity').value),
        status: document.getElementById('roomStatus').value
    };
    
    roomsData.push(newRoom);
    displayRooms(roomsData);
    saveRoomsToJSON();
    closeAddModal();
    
    // Tampilin notifikasi sukses
    showNotification('Ruangan berhasil ditambahkan!');
}

async function saveRoomsToJSON() {
    const dataToSave = {
        rooms: roomsData
    };
    
    // Untuk simulasi penyimpanan (karena browser tidak bisa menulis file langsung)
    // Data bkal disimpan di localStorage trus bisa didownload
    localStorage.setItem('roomsData', JSON.stringify(dataToSave));
    
    // ngebuat file JSON untuk didownload
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Auto download (opsional)
    const a = document.createElement('a');
    a.href = url;
    a.download = 'list_rooms.json';
    
    console.log('Data ruangan telah diperbarui. Download file JSON untuk menyimpan perubahan.');
    console.log('Data tersimpan di localStorage dengan key: roomsData');
    
    // Tampilin opsi download
    showDownloadOption(url);
}

function showDownloadOption(url) {
    const existingDownload = document.getElementById('downloadNotification');
    if (existingDownload) {
        existingDownload.remove();
    }
    
    const downloadHTML = `
        <div class="download-notification" id="downloadNotification">
            <div class="download-content">
                <span>💾 Data berhasil disimpan!</span>
                <a href="${url}" download="list_rooms.json" class="btn-download">Download JSON</a>
                <button onclick="closeDownloadNotification()" class="btn-close-notif">×</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', downloadHTML);
    
    setTimeout(() => {
        const notif = document.getElementById('downloadNotification');
        if (notif) notif.remove();
    }, 10000);
}

function closeDownloadNotification() {
    const notif = document.getElementById('downloadNotification');
    if (notif) notif.remove();
}

function showNotification(message) {
    const notificationHTML = `
        <div class="notification" id="notification">
            <span>✓ ${message}</span>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    
    setTimeout(() => {
        const notif = document.getElementById('notification');
        if (notif) {
            notif.classList.add('fade-out');
            setTimeout(() => notif.remove(), 300);
        }
    }, 3000);
}

function closeModal(event) {
    if (event && event.target.className !== 'modal-overlay') return;
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function closeAddModal(event) {
    if (event && event.target.className !== 'modal-overlay') return;
    const modal = document.getElementById('addRoomModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Event listener buat tombol tambah ruangan
document.getElementById('btnTambahRuangan').addEventListener('click', () => {
    showAddRoomModal();
});

// Load data pas halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cek apa ada data di localStorage
    const savedData = localStorage.getItem('roomsData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        roomsData = parsed.rooms;
        displayRooms(roomsData);
        console.log('Data dimuat dari localStorage');
    } else {
        loadRooms();
    }
});

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        showConfirmPopup('Apakah Anda yakin ingin keluar?', () => {
            showNotification('Logout berhasil!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    });
}

// Popup konfirmasi logout
function showConfirmPopup(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';

    const box = document.createElement('div');
    box.className = 'confirm-box';
    box.innerHTML = `
        <p class="confirm-message">${message}</p>
        <div class="confirm-buttons">
            <button id="yesBtn" class="confirm-btn confirm-btn-yes">Ya</button>
            <button id="noBtn" class="confirm-btn confirm-btn-no">Batal</button>
        </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const fadeOut = () => {
        box.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 300);
    };

    box.querySelector('#yesBtn').addEventListener('click', () => {
        fadeOut();
        onConfirm();
    });
    box.querySelector('#noBtn').addEventListener('click', fadeOut);
}

// Load data pas halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cek apa ada data di localStorage
    const savedData = localStorage.getItem('roomsData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        roomsData = parsed.rooms;
        displayRooms(roomsData);
        console.log('Data dimuat dari localStorage');
    } else {
        loadRooms();
    }
});