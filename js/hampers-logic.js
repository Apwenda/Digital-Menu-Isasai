/* ===============================
    DATA HAMPERS FINAL
================================ */
const hampersData = {
    karbo_mix: "Mix Karbo (Ubi Rebus, Pisang, Papeda Bungkus, Keladi/Ubi Tumbuk)",
    sayur: [
        "Bunga Pepaya Tumis",
        "Kacang Bunga Pepaya",
        "Kangkung Bunga Pepaya"
    ],
    lauk: [
        "Ayam Asap Utuh",
        "Ikan Gabus Sedang Saos"
    ],
    harga: 350000
};

const promoImagesHampers = [
    "assets/images/Menu-Isasai/Makanan/Hamprs-isasai/Hampers-isasai (1).jpeg",
    "assets/images/Menu-Isasai/Makanan/Hamprs-isasai/Hampers-isasai (2).jpeg",
    "assets/images/Menu-Isasai/Makanan/Hamprs-isasai/Hampers-isasai (3).jpeg",
    "assets/images/Menu-Isasai/Makanan/Hamprs-isasai/Hampers-isasai (4).jpeg",
    "assets/images/Menu-Isasai/Makanan/Hamprs-isasai/Hampers-isasai (5).jpeg"
];

/* ===============================
    STORAGE & INIT
================================ */
let cartHampers = JSON.parse(localStorage.getItem('isasai_cart_hampers')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderPromoHampers();
    renderOptionsHampers();
    renderCartHampers();
});

function saveHampersLocal() {
    localStorage.setItem('isasai_cart_hampers', JSON.stringify(cartHampers));
}

/* ===============================
    PROMO SLIDER
================================ */
function renderPromoHampers() {
    const inner = document.getElementById('carousel-inner-promo');
    const ind = document.getElementById('carousel-indicators');
    if(!inner || !ind) return;

    inner.innerHTML = "";
    ind.innerHTML = "";

    promoImagesHampers.forEach((img, i) => {
        inner.innerHTML += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <img src="${img}" class="d-block w-100">
            </div>`;

        ind.innerHTML += `
            <button type="button" data-bs-target="#carouselPromo" data-bs-slide-to="${i}"
                class="${i === 0 ? 'active' : ''}">
            </button>`;
    });
}

/* ===============================
    RENDER PILIHAN FORM
================================ */
function renderOptionsHampers() {
    const karboCont = document.getElementById('karbo-container');
    const sayurCont = document.getElementById('sayur-container');
    const laukCont  = document.getElementById('lauk-container');

    if(!karboCont || !sayurCont || !laukCont) return;

    karboCont.innerHTML = `
        <div class="col-12">
            <div class="alert alert-light border fw-semibold text-center">${hampersData.karbo_mix}</div>
        </div>`;

    hampersData.sayur.forEach((val, i) => {
        sayurCont.innerHTML += `
            <div class="col-md-6 col-12">
                <input type="radio" class="btn-check chk-sy" name="sayur-radio" id="sayur-${i}" value="${val}" onchange="validateHampersForm()">
                <label class="btn btn-outline-success w-100 text-start mb-2" for="sayur-${i}">${val}</label>
            </div>`;
    });

    hampersData.lauk.forEach((val, i) => {
        laukCont.innerHTML += `
            <div class="col-md-6 col-12">
                <input type="radio" class="btn-check chk-lk" name="lauk-radio" id="lauk-${i}" value="${val}" onchange="validateHampersForm()">
                <label class="btn btn-outline-success w-100 text-start mb-2" for="lauk-${i}">${val}</label>
            </div>`;
    });
}

function validateHampersForm() {
    const sy = document.querySelector('.chk-sy:checked');
    const lk = document.querySelector('.chk-lk:checked');
    const btnAdd = document.getElementById('btn-add');
    if(btnAdd) btnAdd.disabled = !(sy && lk);
}

/* ===============================
    LOGIKA KERANJANG
================================ */
function addToHampersCart() {
    const syEl = document.querySelector('.chk-sy:checked');
    const lkEl = document.querySelector('.chk-lk:checked');
    const noteEl = document.getElementById('catatan-khusus');

    if(!syEl || !lkEl) {
        alert("Pilih Sayur dan Lauk dulu!");
        return;
    }

    cartHampers.push({
        id: Date.now(),
        karbo: hampersData.karbo_mix,
        lauk: lkEl.value,
        sayur: syEl.value,
        note: noteEl ? noteEl.value.trim() : "",
        qty: 1,
        harga: hampersData.harga
    });

    saveHampersLocal();
    renderCartHampers();

    // Reset Form
    const form = document.getElementById('hampers-form');
    if(form) form.reset();
    validateHampersForm();

    // Scroll ke tampilan pesanan
    document.getElementById('hampers-cart-view').scrollIntoView({ behavior: 'smooth' });
}

function renderCartHampers() {
    // DISINKRONKAN DENGAN ID HTML ANDA
    const cont = document.getElementById('hampers-cart-items');
    const infoForm = document.getElementById('customer-info-form');
    const addMoreBtn = document.getElementById('add-more-container');

    if (!cont) return;

    if (cartHampers.length === 0) {
        cont.innerHTML = `
            <div class="text-center p-5 bg-white rounded-4 border shadow-sm">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <p class="mt-2 text-secondary fw-semibold">Belum ada racikan hampers</p>
            </div>`;
        if(infoForm) infoForm.classList.add('d-none');
        if(addMoreBtn) addMoreBtn.classList.add('d-none');
        updateHampersCheckout();
        return;
    }

    // Munculkan Form Pelanggan & Tombol Tambah Lagi
    if(infoForm) infoForm.classList.remove('d-none');
    if(addMoreBtn) addMoreBtn.classList.remove('d-none');

    cont.innerHTML = "";
    cartHampers.forEach((item, i) => {
        cont.innerHTML += `
            <div class="cart-item-pro mb-3 p-3 bg-white rounded-4 border shadow-sm">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-success rounded-pill">HAMPERS #${i + 1}</span>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeHampersItem(${i})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
                <div class="small text-secondary mb-2">
                    <div><strong>Karbo:</strong> ${item.karbo}</div>
                    <div><strong>Lauk:</strong> ${item.lauk}</div>
                    <div><strong>Sayur:</strong> ${item.sayur}</div>
                    ${item.note ? `<div class="mt-1"><strong>Note:</strong> ${item.note}</div>` : ''}
                </div>
                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-light border" onclick="updateHampersQty(${i},-1)">-</button>
                        <span class="btn btn-light border disabled fw-bold">${item.qty}</span>
                        <button class="btn btn-light border" onclick="updateHampersQty(${i},1)">+</button>
                    </div>
                    <div class="fw-bold text-success">
                        Rp ${(item.harga * item.qty).toLocaleString()}
                    </div>
                </div>
            </div>`;
    });

    updateHampersCheckout();
}

function updateHampersQty(i, v) {
    cartHampers[i].qty += v;
    if(cartHampers[i].qty < 1) cartHampers[i].qty = 1;
    saveHampersLocal();
    renderCartHampers();
}

function removeHampersItem(i) {
    if(confirm("Hapus pesanan ini?")) {
        cartHampers.splice(i,1);
        saveHampersLocal();
        renderCartHampers();
    }
}

function updateHampersCheckout() {
    const btn = document.getElementById('btn-checkout-wa');
    if(!btn) return;
    const total = cartHampers.reduce((s, i) => s + (i.harga * i.qty), 0);
    btn.style.display = cartHampers.length > 0 ? 'block' : 'none';
    btn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan (Rp ${total.toLocaleString()})`;
}

function scrollToForm() {
    document.getElementById('hampers-form').scrollIntoView({ behavior: 'smooth' });
}

/* ===============================
    CHECKOUT WHATSAPP
================================ */
function checkoutHampersWA() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const addr = document.getElementById('cust-address').value.trim();
    const maps = document.getElementById('cust-maps').value.trim();
    const payment = document.getElementById('cust-payment').value;

    // 1. Validasi input
    if(!name || !phone || !addr || !payment) {
        alert("Mohon lengkapi Data Pelanggan dan Pilih Metode Pembayaran!");
        return;
    }

    const total = cartHampers.reduce((s, i) => s + (i.harga * i.qty), 0);
    const dpAmount = total * 0.5; // DP 50%

    // 2. Susun Pesan dengan Icon Lengkap
    let msg = "*👋Hallo ISASAI R & V. PESANAN HAMPERS ISASAI*\n\n";

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
    msg += `*DP (50%): Rp ${dpAmount.toLocaleString()}*\n`;
    msg += `--------------------------\n\n`;

    msg += `⚠️ *PENTING*\n`;
    msg += `Sebelum pesanan diposes kami ingin DP 50% dibayarkan.\n\n`;
    msg += `_Mohon konfirmasi admin untuk instruksi pembayaran via ${payment}. selanjutnya_ 🙏`;

    // 3. Eksekusi Kirim ke WhatsApp (URL Encoded untuk menjaga emoji)
    const adminPhone = "628114814415";
    const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    // 4. BERSIHKAN KERANJANG (Hapus data lokal)
    localStorage.removeItem('isasai_cart_hampers');
    cartHampers = [];

    // 5. Beri notifikasi dan segarkan halaman
    setTimeout(() => {
        alert("Pesanan Anda sedang dikirim ke WhatsApp! 🙏\nHalaman akan dimuat ulang untuk membersihkan keranjang.");
        window.location.reload();
    }, 800);
}