const tumpengData = {
    lapisan: [
        { name: "Keladi(Putih)", color: "#ede6e2" },
        { name: "Ubi Putih (Putih)", color: "#ede6e2" },
        { name: "Bete (Putih)", color: "#ede6e2" },
        { name: "Ubi Kuning (Kuning)", color: "#FFCC00" },
        { name: "Ubi Madu (Kuning)", color: "#FFCC00" },
        { name: "Pisang (Kuning)", color: "#F4D03F" },
        { name: "Singkong (Kuning)", color: "#FEFAE0" },
        { name: "Ubi Ungu", color: "#6A0DAD" }
    ],
    karbo: ["Ou Afelea/Sinole", "Jagung", "Suamening/Swotpun(Gedi Gulung)", "Ubi Ungu", "Ubi Kuning", "Pisang", "Keladi", "Papeda Bungkus"],
    lauk: ["Ayam Bakar","Ayam Goreng", "Ayam Bumbu Kuning","Ayam Kecap", "Ikan Tuna Saos", "Ikan Goreng", "IKan Asar Suir", "Sate Ayam", "Sate Ikan Tuna"],
    sayur: ["Kacang Bunga Pepaya", "Tumis Bunga Pepaya", "Kangkung Bunga Pepaya", "Kangkung Tumis", "Daun Singkong", "Daun Ubi + Daun Pepaya", "Tumis Daun Labu", "Tumis Daun Pakis"]
};

const promoImages = [
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (1).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (2).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (3).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (4).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (5).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (6).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (7).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (8).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (9).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (10).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (11).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (12).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (13).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (14).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (15).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (16).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (17).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (18).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (19).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (20).jpg",

];
// Load data dari Local Storage atau buat array kosong
let cartTumpeng = JSON.parse(localStorage.getItem('isasai_cart_tumpeng')) || [];
let currentRandom = [];

document.addEventListener('DOMContentLoaded', () => {
    renderPromo();
    renderOptions();
    renderCart();
});

function saveToLocal() {
    localStorage.setItem('isasai_cart_tumpeng', JSON.stringify(cartTumpeng));
}

function renderPromo() {
    const inner = document.getElementById('carousel-inner-promo');
    const ind = document.getElementById('carousel-indicators');
    if(!inner || !ind) return;

    inner.innerHTML = "";
    ind.innerHTML = "";

    promoImages.forEach((img, i) => {
        inner.innerHTML += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <img src="${img}" class="d-block w-100" alt="Promo Isasai">
            </div>`;

        ind.innerHTML += `
            <button type="button" data-bs-target="#carouselPromo" data-bs-slide-to="${i}"
                class="${i === 0 ? 'active' : ''}" aria-label="Slide ${i + 1}">
            </button>`;
    });
}

function renderOptions() {
    const lpC = document.getElementById('lapisan-container');
    // Lapisan diubah jadi Radio Button (Hanya bisa pilih 1)
    tumpengData.lapisan.forEach(item => {
        lpC.innerHTML += `
            <div class="col-4 text-center">
                <input type="radio" class="btn-check chk-lp" name="lapisan-radio" id="lp-${item.name}" value="${item.name}" onchange="validateForm()">
                <label class="btn border-0 w-100 p-1" for="lp-${item.name}">
                    <div class="color-circle" style="background:${item.color}"></div>
                    <div style="font-size:10px; font-weight:700;">${item.name}</div>
                </label>
            </div>`;
    });

    const renderGroup = (id, data, cls, limit) => {
        const cont = document.getElementById(id);
        data.forEach(val => {
            cont.innerHTML += `
                <div class="col-6">
                    <input type="checkbox" class="btn-check ${cls}" id="${id}-${val}" value="${val}" onchange="checkLimit(this, '.${cls}', ${limit})">
                    <label class="btn btn-outline-success btn-sm w-100 text-start" for="${id}-${val}">${val}</label>
                </div>`;
        });
    };

    renderGroup('karbo-container', tumpengData.karbo, 'chk-kb', 3);
    renderGroup('lauk-container', tumpengData.lauk, 'chk-lk', 2);
    renderGroup('sayur-container', tumpengData.sayur, 'chk-sy', 2);
}

function checkLimit(el, selector, max) {
    if (document.querySelectorAll(`${selector}:checked`).length > max) {
        el.checked = false;
        alert(`Maksimal pilih ${max} Menu.`);
    }
    validateForm();
}

function validateForm() {
    const lp = document.querySelector('.chk-lp:checked') || currentRandom.length > 0;
    const kb = document.querySelectorAll('.chk-kb:checked').length;
    const lk = document.querySelectorAll('.chk-lk:checked').length;
    const sy = document.querySelectorAll('.chk-sy:checked').length;

    if (document.querySelector('.chk-lp:checked')) {
        currentRandom = []; document.getElementById('random-display').innerText = "";
    }
    document.getElementById('btn-add').disabled = !(lp && kb > 0 && lk === 2 && sy > 0);
}

function addToTumpengCart() {
    const lpSelect = document.querySelector('.chk-lp:checked');
    const lp = lpSelect ? lpSelect.value : currentRandom.join("+");

    // PERBAIKAN DI SINI: Sesuaikan selector dengan class di HTML
    const kb = Array.from(document.querySelectorAll('.chk-kb:checked')).map(c => c.value);
    const lk = Array.from(document.querySelectorAll('.chk-lk:checked')).map(c => c.value); // Gunakan .chk-lk
    const sy = Array.from(document.querySelectorAll('.chk-sy:checked')).map(c => c.value); // Gunakan .chk-sy

    const note = document.getElementById('catatan-khusus').value.trim();

    cartTumpeng.push({
        id: Date.now(),
        lapisan: lp,
        karbo: kb.join(", "),
        lauk: lk.join(" & "),
        sayur: sy.join(", "),
        note: note || "Tidak ada catatan",
        qty: 1,
        harga: 750000
    });

    saveToLocal();
    renderCart();
    document.getElementById('tumpeng-form').reset();
    validateForm();
    document.getElementById('tumpeng-cart-view').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('tumpeng-form').reset();
    currentRandom = []; document.getElementById('random-display').innerText = "";
    validateForm();
}

function renderCart() {
    const cont = document.getElementById('tumpeng-cart-items');
    const infoForm = document.getElementById('customer-info-form');
    const addMoreBtn = document.getElementById('add-more-container');

    if (cartTumpeng.length === 0) {
        cont.innerHTML = `
            <div class="text-center p-5 bg-white rounded-4 border shadow-sm">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <p class="mt-2 text-secondary fw-semibold">Belum ada racikan tumpeng</p>
            </div>`;
        infoForm.classList.add('d-none');
        addMoreBtn.classList.add('d-none');
    } else {
        infoForm.classList.remove('d-none');
        addMoreBtn.classList.remove('d-none');
        cont.innerHTML = "";

        cartTumpeng.forEach((item, i) => {
            cont.innerHTML += `
                <div class="cart-item-pro mb-3 animate__animated animate__fadeInUp">
                    <div class="cart-header-pro">
                        <span class="badge-racikan">TUMPENG #${i + 1}</span>
                        <button class="btn-delete-pro" onclick="removeItem(${i})">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                    <div class="cart-body-pro">
                        <div class="detail-block">
                            <span class="label">WARNA LAPISAN DOMINAN:</span>
                            <span class="value text-capitalize">${item.lapisan}</span>
                        </div>
                        <div class="detail-block">
                            <span class="label">Karbo:</span>
                            <span class="value">${item.karbo}</span>
                        </div>
                        <div class="detail-block">
                            <span class="label">Lauk Utama:</span>
                            <span class="value">${item.lauk}</span>
                        </div>
                        <div class="detail-block">
                            <span class="label">Sayur:</span>
                            <span class="value">${item.sayur}</span>
                        </div>
                        <div class="note-box-pro">
                            <i class="bi bi-chat-left-dots me-1"></i> Catatan: ${item.note}
                        </div>
                    </div>
                    <div class="cart-footer-pro">
                        <div class="qty-control-pro">
                            <button onclick="updateQty(${i},-1)">-</button>
                            <span class="qty-num">${item.qty}</span>
                            <button onclick="updateQty(${i},1)">+</button>
                        </div>
                        <div class="price-pro text-end">
                            <small class="d-block text-muted" style="font-size: 10px;">Subtotal</small>
                            <span>Rp ${(item.harga * item.qty).toLocaleString()}</span>
                        </div>
                    </div>
                </div>`;
        });
    }
    updateCheckout();
}

// Fungsi untuk kembali ke atas/form racikan
function scrollToForm() {
    document.getElementById('tumpeng-form').scrollIntoView({ behavior: 'smooth' });
    // Beri sedikit efek highlight pada label pertama agar user tahu mereka sudah di atas
    const firstLabel = document.querySelector('.section-label');
    firstLabel.style.transition = "0.5s";
    firstLabel.style.transform = "scale(1.05)";
    setTimeout(() => firstLabel.style.transform = "scale(1)", 500);
}

function updateQty(i, v) {
    cartTumpeng[i].qty += v;
    if(cartTumpeng[i].qty < 1) cartTumpeng[i].qty = 1;
    saveToLocal();
    renderCart();
}

function removeItem(i) {
    if(confirm("Hapus pesanan ini?")) {
        cartTumpeng.splice(i,1);
        saveToLocal();
        renderCart();
    }
}

function updateCheckout() {
    const btn = document.getElementById('btn-checkout-wa');
    const total = cartTumpeng.reduce((s, i) => s + (i.harga * i.qty), 0);
    btn.style.display = cartTumpeng.length > 0 ? 'block' : 'none';
    btn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan (Rp ${total.toLocaleString()})`;
}

/* ===============================
    CHECKOUT WHATSAPP (PERMINTAAN USER)
================================ */
function checkoutHampersWA() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const addr = document.getElementById('cust-address').value.trim();
    const maps = document.getElementById('cust-maps').value.trim();
    const payment = document.getElementById('cust-payment').value;

    // Validasi input
    if(!name || !phone || !addr || !payment) {
        alert("Mohon lengkapi Data Pelanggan dan Pilih Metode Pembayaran!");
        return;
    }

    const total = cartHampers.reduce((s, i) => s + (i.harga * i.qty), 0);
    const dpAmount = total * 0.5; // DP 50%

    let msg = "*👋Hallo ISASAI R & V. PESANAN TUMPENG ISASAI*\n\n";

    msg += `*Data Pelanggan:*\n`;
    msg += `👤 Nama: ${name}\n`;
    msg += `📞 HP: ${phone}\n`;
    msg += `📍 Alamat: ${addr}\n`;
    msg += `🔗 Maps: ${maps || '-'}\n`;
    msg += `💳 Pembayaran: ${payment}\n\n`;

    msg += `*Detail Pesanan:*\n`;
    cartHampers.forEach((it, i) => {
        msg += `*${i+1}. Hampers (x${it.qty})*\n`;
        msg += `- Karbo: ${it.karbo}\n`;
        msg += `- Lauk: ${it.lauk}\n`;
        msg += `- Sayur: ${it.sayur}\n`;
        msg += `- Note: ${it.note}\n\n`;
    });

    msg += `--------------------------\n`;
    msg += `*Total Pesanan: Rp ${total.toLocaleString()}*\n`;
    msg += `*DP Wajib (50%): Rp ${dpAmount.toLocaleString()}*\n`;
    msg += `--------------------------\n\n`;

    msg += `⚠️ *PENTING*\n`;
    msg += `Sebelum pesanan diposes kami ingin DP 50% dahulu.\n`;
    msg += `Tanpa DP, pesanan tidak masuk antrian produksi.\n\n`;

    msg += `_Mohon konfirmasi admin untuk instruksi pembayaran via ${payment}. selanjutnya_ 🙏`;

    // Kirim ke nomor WhatsApp yang diminta
    window.open(`https://wa.me/628114814415?text=${encodeURIComponent(msg)}`);
}
