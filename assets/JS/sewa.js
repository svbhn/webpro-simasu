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

function closeModal(event) {
    if (event && event.target.className !== 'modal-overlay') return;
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

document.getElementById('btnTambahRuangan').addEventListener('click', () => {
    alert('Fitur tambah ruangan akan segera hadir!');
});

document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
});