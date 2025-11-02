let bookings = [
    {
        id: 1,
        type: 'peminjaman',
        title: 'Aula Utama',
        subtitle: 'Acara Walimah - Keluarga Budi',
        startDate: '2025-10-09',
        endDate: '2025-10-10'
    }
];

let currentMonth = 9;
let currentYear = 2025;

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function renderCalendar() {
    const hariPertama = new Date(currentYear, currentMonth, 1).getDay();
    const hariTerakhir = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    let htmlKalender = '<tr>';
    
    for (let i = 0; i < hariPertama; i++) {
        htmlKalender += '<td><div class="day-cell empty"></div></td>';
    }
    
    for (let hari = 1; hari <= hariTerakhir; hari++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(hari).padStart(2, '0')}`;
        
        const hasPeminjaman = bookings.some(b => 
            b.type === 'peminjaman' && dateStr >= b.startDate && dateStr <= b.endDate
        );
        
        const hasSewa = bookings.some(b => 
            b.type === 'sewa' && dateStr >= b.startDate && dateStr <= b.endDate
        );
        
        let indicators = '';
        if (hasPeminjaman) {
            indicators += '<div class="indicator peminjaman"></div>';
        }
        if (hasSewa) {
            indicators += '<div class="indicator sewa"></div>';
        }
        
        htmlKalender += `
            <td>
                <div class="day-cell" onclick="openModal('${dateStr}')">
                    <div class="day-number">${hari}</div>
                    ${indicators ? '<div class="indicators">' + indicators + '</div>' : ''}
                </div>
            </td>
        `;
        
        if ((hari + hariPertama) % 7 === 0) {
            htmlKalender += '</tr><tr>';
        }
    }
    
    htmlKalender += '</tr>';
    
    document.getElementById('calendarDays').innerHTML = htmlKalender;
    renderList();
}

function renderList() {
    const monthBookings = bookings.filter(b => {
        const month = parseInt(b.startDate.split('-')[1]) - 1;
        const year = parseInt(b.startDate.split('-')[0]);
        return month === currentMonth && year === currentYear;
    });

    let htmlList = '';
    
    if (monthBookings.length === 0) {
        htmlList = '<p style="color: #999; text-align: center; padding: 20px; font-size: 13px;">Tidak ada peminjaman bulan ini</p>';
    } else {
        monthBookings.forEach(b => {
            htmlList += `
                <div class="item-card ${b.type}">
                    <div class="item-title">${b.title}</div>
                    <div class="item-subtitle">${b.subtitle}</div>
                    <div class="item-dates">
                        Mulai: ${formatDate(b.startDate)}<br>
                        Selesai: ${formatDate(b.endDate)}
                    </div>
                </div>
            `;
        });
    }
    
    document.getElementById('itemsList').innerHTML = htmlList;
}

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
}

function openModal(date) {
    document.getElementById('startDate').value = date;
    document.getElementById('endDate').value = date;
    document.getElementById('bookingModal').classList.add('active');
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.getElementById('bookingForm').reset();
}

document.getElementById('prevMonth').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
};

document.getElementById('nextMonth').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
};

document.getElementById('cancelBtn').onclick = closeModal;

document.getElementById('bookingModal').onclick = (e) => {
    if (e.target.id === 'bookingModal') {
        closeModal();
    }
};

document.getElementById('bookingForm').onsubmit = (e) => {
    e.preventDefault();
    
    const newBooking = {
        id: bookings.length + 1,
        type: document.getElementById('bookingType').value,
        title: document.getElementById('itemName').value,
        subtitle: document.getElementById('borrower').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };

    bookings.push(newBooking);
    closeModal();
    renderCalendar();
    alert('Peminjaman/Sewa berhasil ditambahkan!');
};

renderCalendar();