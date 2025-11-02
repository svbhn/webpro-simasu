function notify(msg, type) {
  var bg = type === 'error' ? '#dc2626' : '#16a34a';
  var $n = $('<div class="notification"/>').text(msg).css({
    position:'fixed', top:20, right:20, background:bg, color:'#fff',
    padding:'12px 16px', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,.15)', zIndex:10000
  }).appendTo('body');
  setTimeout(function(){ $n.fadeOut(200, function(){ $n.remove(); }); }, 2200);
}
function confirmAsk(msg, onYes){
  if (window.confirm(msg)) { onYes && onYes(); }
}

$(function () {
  var $navItems = $('.nav-item');
  var $logoutBtn = $('#logoutBtn');

  var current = (location.pathname.split('/').pop() || 'profile.html').toLowerCase();
  $navItems.each(function(){
    var href = (($(this).attr('href')) || '').toLowerCase();
    if (href === current) $(this).addClass('active');
  });

  $navItems.on('click', function(e){
    var target = $(this).attr('href');
    if (!target || target === '#') {
      e.preventDefault();
      var label = $(this).find('.nav-text').text() || 'Halaman';
      notify('Halaman ' + label + ' akan segera tersedia');
    }
  });

  if ($logoutBtn.length) {
    $logoutBtn.on('click', function(){
      confirmAsk('Apakah Anda yakin ingin keluar?', function(){
        notify('Logout berhasil!');
        setTimeout(function(){ location.href = 'index.html'; }, 900);
      });
    });
  }

  var KEY_USER = 'simasuUser';
  var KEY_PASS = 'simasuPassword';

  if (!localStorage.getItem(KEY_PASS)) localStorage.setItem(KEY_PASS, 'admin123');

  var $nameEl = $('.profile-card h3');
  var $roleEl = $('.profile-card .role');
  var $joinedEl = $('.profile-card .joined');
  var $avatarEl = $('.profile-card .avatar');

  var user = (function(){
    try { return JSON.parse(localStorage.getItem(KEY_USER)); } catch(e){ return null; }
  })() || {
    fullName: $.trim($nameEl.text()) || 'Pengguna',
    role: $.trim($roleEl.text()) || 'Administrator',
    email: '', phone: '', address: '',
    joined: $.trim($joinedEl.text()) || 'Terdaftar'
  };

  function saveUser(u){ localStorage.setItem(KEY_USER, JSON.stringify(u)); }
  function initials(name){
    var s = (name||'').trim().split(/\s+/).map(function(p){ return p[0]; }).join('');
    return (s.slice(0,2) || 'U').toUpperCase();
  }
  function emailOK(v){ return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function cleanPhone(v){ return (v||'').replace(/[^\d+]/g,''); }
  function strongPass(p){ return p.length>=8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p); }

  if ($nameEl.length)   $nameEl.text(user.fullName);
  if ($roleEl.length)   $roleEl.text(user.role);
  if ($joinedEl.length) $joinedEl.text(user.joined);
  if ($avatarEl.length) $avatarEl.text(initials(user.fullName));

  var $infoForm = $('#infoForm');
  var $fullName = $('#fullName');
  var $roleIn   = $('#roleInput');
  var $email    = $('#email');
  var $phone    = $('#phone');
  var $address  = $('#address');

  if ($fullName.length) $fullName.val(user.fullName);
  if ($roleIn.length)   $roleIn.val(user.role);
  if ($email.length)    $email.val(user.email);
  if ($phone.length)    $phone.val(user.phone);
  if ($address.length)  $address.val(user.address);

  $infoForm.on('submit', function(e){
    e.preventDefault();
    var updated = {
      fullName: $.trim($fullName.val()||''),
      role:     $.trim($roleIn.val()||''),
      email:    $.trim($email.val()||''),
      phone:    cleanPhone($.trim($phone.val()||'')),
      address:  $.trim($address.val()||''),
      joined:   user.joined
    };

    if (!updated.fullName || !updated.role) { notify('Nama dan Jabatan wajib diisi.', 'error'); return; }
    if (!emailOK(updated.email)) { notify('Format email tidak valid.', 'error'); return; }

    saveUser(updated);
    user = updated; 

    $nameEl.text(updated.fullName);
    $roleEl.text(updated.role);
    $avatarEl.text(initials(updated.fullName));

    notify('Perubahan profil berhasil disimpan.');
  });

  var $pwdForm = $('#passwordForm');
  var $cur = $('#currentPassword');
  var $new = $('#newPassword');
  var $cfm = $('#confirmPassword');

  $pwdForm.on('submit', function(e){
    e.preventDefault();
    var stored  = localStorage.getItem(KEY_PASS) || '';
    var current = $cur.val() || '';
    var next    = $new.val() || '';
    var confirm = $cfm.val() || '';

    if (current !== stored) { notify('Kata sandi saat ini salah.', 'error'); return; }
    if (next !== confirm)   { notify('Konfirmasi kata sandi tidak cocok.', 'error'); return; }
    if (next === stored)    { notify('Kata sandi baru tidak boleh sama dengan yang lama.', 'error'); return; }
    if (!strongPass(next))  { notify('Minimal 8 karakter, wajib ada huruf BESAR, huruf kecil, dan angka.', 'error'); return; }

    localStorage.setItem(KEY_PASS, next);
    $cur.val(''); $new.val(''); $cfm.val('');

    notify('Kata sandi berhasil diubah.');
  });

});
