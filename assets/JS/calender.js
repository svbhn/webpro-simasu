// Data peminjaman dan sewa
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
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const tbody = document.getElementById('calendarDays');
    tbody.innerHTML = '';

    let day = 1;
    let rows = Math.ceil((firstDay + daysInMonth) / 7);

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            const cellIndex = i * 7 + j;
            
            if (cellIndex < firstDay || day > daysInMonth) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'day-cell empty';
                cell.appendChild(emptyDiv);
            } else {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day-cell';
                
                const dayNum = document.createElement('div');
                dayNum.className = 'day-number';
                dayNum.textContent = day;
                dayDiv.appendChild(dayNum);

                const hasPeminjaman = bookings.some(b => 
                    b.type === 'peminjaman' && dateStr >= b.startDate && dateStr <= b.endDate
                );
                
                const hasSewa = bookings.some(b => 
                    b.type === 'sewa' && dateStr >= b.startDate && dateStr <= b.endDate
                );

                if (hasPeminjaman || hasSewa) {
                    const indicators = document.createElement('div');
                    indicators.className = 'indicators';
                    
                    if (hasPeminjaman) {
                        const dot = document.createElement('div');
                        dot.className = 'indicator peminjaman';
                        indicators.appendChild(dot);
                    }
                    
                    if (hasSewa) {
                        const dot = document.createElement('div');
                        dot.className = 'indicator sewa';
                        indicators.appendChild(dot);
                    }
                    
                    dayDiv.appendChild(indicators);
                }

                dayDiv.onclick = () => openModal(dateStr);
                cell.appendChild(dayDiv);
                day++;
            }
            
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
    }

    renderList();
}

function renderList() {
    const list = document.getElementById('itemsList');
    list.innerHTML = '';

    const monthBookings = bookings.filter(b => {
        const month = parseInt(b.startDate.split('-')[1]) - 1;
        const year = parseInt(b.startDate.split('-')[0]);
        return month === currentMonth && year === currentYear;
    });

    if (monthBookings.length === 0) {
        list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px; font-size: 13px;">Tidak ada peminjaman bulan ini</p>';
        return;
    }

    monthBookings.forEach(b => {
        const card = document.createElement('div');
        card.className = `item-card ${b.type}`;
        
        card.innerHTML = `
            <div class="item-title">${b.title}</div>
            <div class="item-subtitle">${b.subtitle}</div>
            <div class="item-dates">
                Mulai: ${formatDate(b.startDate)}<br>
                Selesai: ${formatDate(b.endDate)}
            </div>
        `;
        
        list.appendChild(card);
    });
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