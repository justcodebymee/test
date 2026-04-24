// ===== INISIALISASI =====
document.addEventListener('DOMContentLoaded', () => {
  // Load daily tip
  loadDailyTip();
  
  // Load compliance from localStorage
  const savedCompliance = localStorage.getItem('nurvaCompliance');
  if (savedCompliance) {
    document.getElementById('complianceValue').textContent = `${savedCompliance}%`;
  }
  
  // Gender selector
  document.querySelectorAll('.gender-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.gender-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });
  
  // Slider updaters
  const sliders = ['tiktokSlider', 'youtubeSlider', 'instagramSlider'];
  sliders.forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.addEventListener('input', function() {
        document.getElementById(`${id.replace('Slider', 'Time')}`).textContent = this.value;
      });
    }
  });
  
  // Set default reminder
  setReminder(60);
});

// ===== DAILY TIPS (FITUR BARU) =====
const dailyTips = [
  "💡 Batasi waktu layar 1 jam sebelum tidur untuk kualitas tidur yang lebih baik",
  "💡 Matikan notifikasi media sosial saat jam belajar",
  "💡 Ajak anak diskusi tentang konten yang mereka tonton",
  "💡 Gunakan fitur 'Screen Time' untuk membatasi aplikasi tertentu",
  "💡 Buat kesepakatan: 'PR selesai baru boleh main HP'",
  "💡 Cek riwayat pencarian anak seminggu sekali",
  "💡 Ajarkan anak untuk tidak membagikan lokasi real-time",
  "💡 Gunakan password yang kuat untuk akun anak",
  "💡 Pasang aplikasi kontrol orang tua sejak dini",
  "💡 Luangkan waktu 15 menit setiap hari untuk mengecek aktivitas online anak"
];

function loadDailyTip() {
  const randomIndex = Math.floor(Math.random() * dailyTips.length);
  const tipText = dailyTips[randomIndex];
  document.getElementById('dailyTipText').textContent = tipText;
}

// ===== NOTIFIKASI PENGINGAT =====
let reminderInterval = null;
let lastReminderTime = null;

function setReminder(minutes) {
  // Clear previous reminder
  if (reminderInterval) clearInterval(reminderInterval);
  
  // Set new interval (convert minutes to milliseconds)
  const intervalMs = minutes * 60 * 1000;
  reminderInterval = setInterval(() => {
    showParentReminder();
  }, intervalMs);
  
  // Update UI
  lastReminderTime = new Date();
  document.getElementById('reminderStatus').innerHTML = `
    <strong>Aktif</strong> • Terakhir: ${formatTime(lastReminderTime)}<br>
    <small>Berikutnya dalam ${minutes} menit</small>
  `;
  
  // Show immediate reminder for demo
  setTimeout(showParentReminder, 3000);
}

function showParentReminder() {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const ageInput = document.getElementById('ageInput');
  const age = ageInput.value ? parseInt(ageInput.value) : null;
  
  let message = "🔔 Pengingat NURVA\n\n";
  
  if (age && age >= 1 && age <= 17) {
    if (gender === 'P') {
      message += `Hai Ayah/Bunda! Sudahkah Anda mengecek aktivitas online anak perempuan ${age} tahun hari ini?\n\n⚠️ Anak perempuan lebih rentan terhadap predator online. Pastikan:\n• Tidak ada permintaan foto pribadi\n• Akun media sosial dalam mode privat\n• Tidak menerima DM dari orang tidak dikenal`;
    } else {
      message += `Hai Ayah/Bunda! Sudahkah Anda mengecek aktivitas online anak laki-laki ${age} tahun hari ini?\n\n⚠️ Anak laki-laki lebih rentan terhadap cyberbullying & kecanduan game. Pastikan:\n• Waktu bermain game tidak melebihi batas\n• Tidak ada komentar negatif di media sosial\n• Komunikasi terbuka tentang pengalaman online`;
    }
  } else {
    message += "Hai Ayah/Bunda! Sudahkah Anda mengecek aktivitas online anak hari ini?\n\n💡 Tips: Luangkan 5 menit untuk bertanya:\n\"Hari ini ada konten menarik yang kamu tonton?\"\n\"Ada yang mengganggu kamu di media sosial?\"";
  }
  
  message += "\n\n✅ Klik 'OK' jika sudah memeriksa";
  
  if (confirm(message)) {
    lastReminderTime = new Date();
    document.getElementById('reminderStatus').innerHTML = `
      <strong>Terkini</strong> • Dicek pada ${formatTime(lastReminderTime)}<br>
      <small>Berikutnya dalam ${document.querySelector('.btn-outline-primary.active').textContent}</small>
    `;
    
    // Update compliance score
    updateCompliance(5);
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

// ===== PROGRESS BAR VISUAL (FITUR BARU) =====
function applyScreenTime() {
  const tiktok = document.getElementById('tiktokSlider').value;
  const youtube = document.getElementById('youtubeSlider').value;
  const instagram = document.getElementById('instagramSlider').value;
  
  const successMsg = document.getElementById('successMessage');
  successMsg.style.display = 'block';
  
  // Progress bar visual
  const tiktokPercent = (tiktok / 120) * 100;
  const youtubePercent = (youtube / 120) * 100;
  const instagramPercent = (instagram / 90) * 100;
  
  successMsg.innerHTML = `
    <strong>✅ Batasan berhasil diterapkan!</strong><br><br>
    
    <div class="progress-item">
      <div class="progress-label">📱 TikTok: ${tiktok}/120 menit</div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${tiktokPercent}%; background: linear-gradient(to right, #ff4081, #e91e63);"></div>
      </div>
      <div class="progress-text">${Math.round(tiktokPercent)}%</div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">📺 YouTube: ${youtube}/120 menit</div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${youtubePercent}%; background: linear-gradient(to right, #f44336, #d32f2f);"></div>
      </div>
      <div class="progress-text">${Math.round(youtubePercent)}%</div>
    </div>
    
    <div class="progress-item">
      <div class="progress-label">📸 Instagram: ${instagram}/90 menit</div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${instagramPercent}%; background: linear-gradient(to right, #2196f3, #1976d2);"></div>
      </div>
      <div class="progress-text">${Math.round(instagramPercent)}%</div>
    </div>
    
    <small class="mt-3 d-block">Sesuai PP Tunas 2025 Pasal 8: Anak usia 13-15 tahun maksimal 2 jam/hari di media sosial</small>
  `;
  
  // Update stats
  updateStats(tiktok, youtube, instagram);
  
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 8000);
  
  console.log("Screen time limits applied:", { tiktok, youtube, instagram });
}

// Update stats card
function updateStats(tiktok, youtube, instagram) {
  // Total screen time
  const totalMinutes = parseInt(tiktok) + parseInt(youtube) + parseInt(instagram);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  document.getElementById('screenTimeValue').textContent = `${hours}h ${minutes}m`;
  
  // Top app
  const apps = [
    { name: 'TikTok', value: parseInt(tiktok) },
    { name: 'YouTube', value: parseInt(youtube) },
    { name: 'Instagram', value: parseInt(instagram) }
  ];
  const topApp = apps.reduce((max, app) => app.value > max.value ? app : max);
  document.getElementById('topAppValue').textContent = topApp.name;
}

// Update compliance score
function updateCompliance(change) {
  let compliance = parseInt(document.getElementById('complianceValue').textContent);
  compliance = Math.max(0, Math.min(100, compliance + change));
  document.getElementById('complianceValue').textContent = `${compliance}%`;
  localStorage.setItem('nurvaCompliance', compliance);
}

// ===== AGE CHECKER DENGAN GENDER =====
function checkAge() {
  const ageInput = document.getElementById("ageInput");
  const resultDiv = document.getElementById("result");
  
  if (!ageInput || !resultDiv) return;
  
  const age = parseInt(ageInput.value);
  const gender = document.querySelector('input[name="gender"]:checked').value;
  
  // Validasi input
  if (isNaN(age) || age < 1 || age > 17) {
    resultDiv.innerHTML = `<div class="alert alert-danger text-center p-3">⚠️ Masukkan usia 1–17 tahun sesuai aturan PP Tunas 2025</div>`;
    return;
  }
  
  // Tentukan kategori usia
  let category = "";
  if (age < 13) category = "di bawah 13 tahun";
  else if (age <= 15) category = "13–15 tahun";
  else category = "16–17 tahun";
  
  // Bangun hasil
  let result = `
    <div class="text-center mt-4">
      <div class="badge-age">Usia: ${age} tahun (${category}) • Jenis Kelamin: ${gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
      <h3 class="mt-3 mb-4">✅ Rekomendasi Personal Sesuai PP Tunas 2025</h3>
    </div>
  `;
  
  // Rekomendasi berdasarkan usia & gender
  if (age < 13) {
    result += `
      <div class="result-item">
        <h4>🔒 YouTube Kids Wajib</h4>
        <p>• Anak <span class="highlight">hanya boleh akses YouTube Kids</span> (bukan YouTube biasa)</p>
        <p>• Aktifkan "Timer" untuk batasi waktu menonton maksimal <span class="highlight">1 jam/hari</span></p>
        
        <div class="visual-guide" onclick="showGuide('youtube-kids')">
          📱 Lihat panduan setting YouTube Kids
        </div>
      </div>
      
      <div class="result-item">
        <h4>📱 Kontrol Orang Tua Wajib</h4>
        <p>• Pasang aplikasi <span class="highlight">Family Link (Android)</span> atau <span class="highlight">Screen Time (iPhone)</span></p>
        <p>• Orang tua harus memberikan izin setiap kali anak mau install aplikasi baru</p>
      </div>
    `;
    
    // Rekomendasi gender spesifik
    if (gender === 'P') {
      result += `
        <div class="result-item warning-box">
          <h4>🌸 Khusus Anak Perempuan</h4>
          <p>• Ajarkan untuk <span class="highlight">tidak menerima permintaan video call dari orang tidak dikenal</span></p>
          <p>• Pastikan foto profil tidak menunjukkan lokasi sekolah/rumah</p>
          <p>• Gunakan bahasa: "Badanmu istimewa, hanya boleh dilihat oleh orang yang kamu percaya"</p>
        </div>
      `;
    } else {
      result += `
        <div class="result-item info-box">
          <h4>👦 Khusus Anak Laki-laki</h4>
          <p>• Waspadai ajakan bermain game online dari orang tidak dikenal</p>
          <p>• Ajarkan untuk <span class="highlight">tidak membagikan informasi pribadi</span> (nama sekolah, alamat) saat live stream</p>
          <p>• Batasi waktu bermain game maksimal 1 jam/hari</p>
        </div>
      `;
    }
  } 
  else if (age >= 13 && age <= 15) {
    result += `
      <div class="result-item">
        <h4>🔒 YouTube Restricted Mode</h4>
        <p>• Aktifkan <span class="highlight">"Restricted Mode"</span> untuk blokir konten dewasa</p>
        <p>• Nonaktifkan fitur komentar di video yang ditonton anak</p>
      </div>
      
      <div class="result-item">
        <h4>⏱️ TikTok Screen Time</h4>
        <p>• Batasi waktu pakai TikTok maksimal <span class="highlight">2 jam/hari</span></p>
        <p>• Aktifkan "Restricted Mode" untuk filter konten sensitif</p>
      </div>
    `;
    
    // Rekomendasi gender spesifik
    if (gender === 'P') {
      result += `
        <div class="result-item warning-box">
          <h4>🌸 Khusus Remaja Perempuan</h4>
          <p>⚠️ <span class="highlight">Predator online sering menyamar sebagai remaja sebaya</span></p>
          <p>• Ajarkan untuk tidak menerima DM dari akun tanpa foto profil</p>
          <p>• Waspadai pujian berlebihan: "Kamu cantik banget, mau kenalan?"</p>
          <p>• Gunakan kalimat: "Kalau ada yang minta foto badan, bilang TIDAK dan cerita ke orang tua"</p>
        </div>
      `;
    } else {
      result += `
        <div class="result-item info-box">
          <h4>👦 Khusus Remaja Laki-laki</h4>
          <p>⚠️ <span class="highlight">Cyberbullying lebih sering dialami remaja laki-laki</span> di game online</p>
          <p>• Ajarkan untuk tidak membalas komentar negatif</p>
          <p>• Simpan bukti screenshot jika ada yang mengancam</p>
          <p>• Gunakan kalimat: "Kalau ada yang bully, langsung block dan cerita ke orang tua"</p>
        </div>
      `;
    }
  }
  else {
    result += `
      <div class="result-item">
        <h4>💬 Media Sosial Penuh dengan Syarat</h4>
        <p>• Anak wajib laporkan akun yang diikuti setiap minggu</p>
        <p>• Orang tua harus follow akun anak untuk memantau konten</p>
      </div>
      
      <div class="result-item">
        <h4>🤝 Modul Dialog Orang Tua-Anak</h4>
        <p>Berdasarkan jurnal Sofyetin (2024):</p>
        <ol>
          <li>Tanyakan konten favorit sebelum memberi batasan</li>
          <li>Jelaskan dengan kalimat <span class="highlight">"Aku khawatir..."</span> bukan "Dilarang!"</li>
          <li>Buat kesepakatan: <span class="highlight">"Boleh 3 jam, tapi PR harus selesai dulu"</span></li>
        </ol>
      </div>
    `;
    
    // Rekomendasi gender spesifik
    if (gender === 'P') {
      result += `
        <div class="result-item warning-box">
          <h4>🌸 Khusus Remaja Perempuan (16-17 th)</h4>
          <p>⚠️ <span class="highlight">Sextortion (pemerasan seksual) meningkat 40% pada remaja perempuan</span></p>
          <p>• Jangan pernah mengirim foto/video tidak pantas meskipun diminta pacar</p>
          <p>• Simpan bukti jika ada yang mengancam sebarkan foto pribadi</p>
          <p>• Laporkan ke orang tua atau ke <a href="https://patrolisiber.id" target="_blank" style="color:#1e5f8c;text-decoration:underline">Patroli Siber BSSN</a></p>
        </div>
      `;
    } else {
      result += `
        <div class="result-item info-box">
          <h4>👦 Khusus Remaja Laki-laki (16-17 th)</h4>
          <p>⚠️ <span class="highlight">Kecanduan game online & judi online meningkat pada remaja laki-laki</span></p>
          <p>• Batasi waktu bermain game maksimal 2 jam/hari</p>
          <p>• Waspadai ajakan "investasi game" yang berujung pada judi online</p>
          <p>• Gunakan fitur "Screen Time" untuk membatasi akses aplikasi tertentu</p>
        </div>
      `;
    }
  }
  
  // Penutup
  result += `
    <div class="text-center mt-4 p-3 bg-light rounded">
      <h4 class="text-primary mb-2">🌟 Orang Tua Hebat!</h4>
      <p class="mb-1">Kamu telah mengambil langkah proaktif melindungi anak dari risiko digital.</p>
      <p class="mb-0 fw-bold" style="color: #d32f2f;">
        PP Tunas 2025 • Pasal 8 Ayat (2): Orang tua wajib mendampingi anak usia 13–15 tahun dalam penggunaan media sosial.
      </p>
    </div>
    
    <div class="reminder-section mt-4 p-3 bg-light rounded">
      <h5 class="text-center mb-2">🔔 Aktifkan Pengingat Harian</h5>
      <p class="text-center mb-2">NURVA akan mengingatkan Anda untuk mengecek aktivitas anak:</p>
      <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-sm btn-outline-primary" onclick="setReminder(30)">30 Menit</button>
        <button class="btn btn-sm btn-outline-primary active" onclick="setReminder(60)">1 Jam</button>
        <button class="btn btn-sm btn-outline-primary" onclick="setReminder(120)">2 Jam</button>
      </div>
    </div>
  `;
  
  resultDiv.innerHTML = result;
}

// ===== FUNGSI PANDUAN =====
function showGuide(type) {
  const guides = {
    "youtube-kids": "Panduan YouTube Kids:\n1. Install YouTube Kids dari Play Store/App Store\n2. Buat profil anak dengan usia yang sesuai\n3. Aktifkan timer harian di menu Settings > Timer",
    "family-link": "Langkah setting Family Link:\n1. Install 'Google Family Link' di HP orang tua\n2. Buat akun Google untuk anak\n3. Atur batas waktu & daftar aplikasi yang diizinkan",
    "youtube-restricted": "Cara aktifkan Restricted Mode:\n1. Buka YouTube → Klik foto profil\n2. Scroll ke bawah → aktifkan 'Restricted Mode'\n3. Klik 'Lock' dan masukkan password",
    "tiktok": "Setting Screen Time TikTok:\n1. Profil → ⋮ → Settings\n2. Digital Wellbeing → Screen Time Management\n3. Set batas waktu + aktifkan Restricted Mode"
  };
  
  alert(guides[type] || "Panduan lengkap tersedia di aplikasi NURVA versi mobile!");
}