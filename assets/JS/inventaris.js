let inventoryData = [
    { id: 1, nama: 'Mukena', kategori: 'Pakaian Ibadah', jumlah: 45, tanggal: '2024-12-10' },
    { id: 2, nama: 'Sarung', kategori: 'Pakaian Ibadah', jumlah: 12, tanggal: '2024-12-10' },
    { id: 3, nama: 'Kursi Plastik Putih', kategori: 'Furniture', jumlah: 0, tanggal: '2024-12-09' },
    { id: 4, nama: 'Mukena Anak-anak', kategori: 'Pakaian Ibadah', jumlah: 28, tanggal: '2024-12-08' },
    { id: 5, nama: 'Alat Pukul Bedug', kategori: 'Alat Musik', jumlah: 2, tanggal: '2024-12-07' },
    { id: 6, nama: 'Meja Kayu', kategori: 'Furniture', jumlah: 8, tanggal: '2024-12-06' }
];
let editingId = null;

function getStatus(jumlah) {
    if (jumlah === 0) return { text: 'Habis', class: 'status-habis' };
    if (jumlah <= 10) return { text: 'Terbatas', class: 'status-terbatas' };
    return { text: 'Tersedia', class: 'status-tersedia' };
}

function renderTable(data = inventoryData) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const status = getStatus(item.jumlah);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.kategori}</td>
            <td>${item.jumlah}</td>
            <td><span class="status-badge ${status.class}">${status.text}</span></td>
            <td>${item.tanggal}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editItem(${item.id})">Edit</button>
                    <button class="btn-icon btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('itemCount').textContent = data.length;
    document.getElementById('totalCount').textContent = inventoryData.length;
}

document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filtered = inventoryData.filter(item =>
        item.nama.toLowerCase().includes(searchTerm) ||
        item.kategori.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
});

document.getElementById('btnTambah').addEventListener('click', function () {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Barang';
    document.getElementById('formBarang').reset();
    document.getElementById('modal').classList.add('active');
});

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

document.getElementById('btnCloseModal').addEventListener('click', closeModal);
document.getElementById('btnBatal').addEventListener('click', closeModal);

document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

document.getElementById('formBarang').addEventListener('submit', function (e) {
    e.preventDefault();

    const item = {
        nama: document.getElementById('namaBarang').value,
        kategori: document.getElementById('kategori').value,
        jumlah: parseInt(document.getElementById('jumlah').value),
        tanggal: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
        const index = inventoryData.findIndex(i => i.id === editingId);
        inventoryData[index] = { ...inventoryData[index], ...item };
    } else {
        item.id = inventoryData.length > 0 ? Math.max(...inventoryData.map(i => i.id)) + 1 : 1;
        inventoryData.push(item);
    }

    renderTable();
    closeModal();
});

window.editItem = function (id) {
    editingId = id;
    const item = inventoryData.find(i => i.id === id);
    document.getElementById('modalTitle').textContent = 'Edit Barang';
    document.getElementById('namaBarang').value = item.nama;
    document.getElementById('kategori').value = item.kategori;
    document.getElementById('jumlah').value = item.jumlah;
    document.getElementById('modal').classList.add('active');
};

window.deleteItem = function (id) {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        inventoryData = inventoryData.filter(i => i.id !== id);
        renderTable();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    renderTable();
});