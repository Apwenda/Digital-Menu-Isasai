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
                <img src="${img}" class="d-block w-100" style="object-fit: contain; max-height: 400px; background: #eee;">
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
                <label class="btn btn-outline-success w-100 text-start mb-2 py-3" for="sayur-${i}">${val}</label>
            </div>`;
    });

    hampersData.lauk.forEach((val, i) => {
        laukCont.innerHTML += `
            <div class="col-md-6 col-12">
                <input type="radio" class="btn-check chk-lk" name="lauk-radio" id="lauk-${i}" value="${val}" onchange="validateHampersForm()">
                <label class="btn btn-outline-success w-100 text-start mb-2 py-3" for="lauk-${i}">${val}</label>
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
    LOGIKA KERANJANG & TAMPILAN
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
        note: noteEl ? noteEl.value.trim() : "Tidak ada catatan",
        qty: 1,
        harga: hampersData.harga
    });

    saveHampersLocal();
    renderCartHampers();

    const form = document.getElementById('hampers-form');
    if(form) form.reset();
    validateHampersForm();

    document.getElementById('hampers-cart-view').scrollIntoView({ behavior: 'smooth' });
}

function handleServiceSelection() {
    const isDineIn = document.getElementById('type-dinein').checked;
    const infoForm = document.getElementById('customer-info-form');
    const deliveryFields = document.getElementById('delivery-fields');
    const dpAlert = document.getElementById('dp-alert');
    const btnCheckout = document.getElementById('btn-checkout-wa');

    // Target kolom No WA (kita ambil input dan pembungkusnya)
    const phoneInput = document.getElementById('cust-phone');
    const phoneContainer = phoneInput.closest('.mb-3');

    if (infoForm) {
        infoForm.classList.remove('d-none');
        btnCheckout.style.display = 'block';

        if (isDineIn) {
            // Sembunyikan Alamat, DP Alert, dan No WA
            deliveryFields.classList.add('d-none');
            dpAlert.classList.add('d-none');
            phoneContainer.classList.add('d-none');
        } else {
            // Munculkan semua untuk Jarak Jauh
            deliveryFields.classList.remove('d-none');
            dpAlert.classList.remove('d-none');
            phoneContainer.classList.remove('d-none');
        }
        infoForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function renderCartHampers() {
    const cont = document.getElementById('hampers-cart-items');
    const infoForm = document.getElementById('customer-info-form');
    const addMoreBtn = document.getElementById('add-more-container');
    const serviceType = document.getElementById('service-type-container');

    if (!cont) return;

    if (cartHampers.length === 0) {
        cont.innerHTML = `
            <div class="text-center p-4 bg-white rounded-4 border shadow-sm">
                <p class="text-muted mb-0">Keranjang masih kosong</p>
            </div>`;
        if(serviceType) serviceType.classList.add('d-none');
        if(infoForm) infoForm.classList.add('d-none');
        if(addMoreBtn) addMoreBtn.classList.add('d-none');
    } else {
        if(serviceType) serviceType.classList.remove('d-none');
        if(addMoreBtn) addMoreBtn.classList.remove('d-none');

        cont.innerHTML = "";
        cartHampers.forEach((item, i) => {
            cont.innerHTML += `
                <div class="cart-item-pro mb-3 p-3 bg-white rounded-4 border shadow-sm animate__animated animate__fadeInLeft">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-success rounded-pill">HAMPERS #${i + 1}</span>
                        <button class="btn btn-sm text-danger border-0" onclick="removeHampersItem(${i})">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                    <div class="small text-secondary text-start">
                        <div class="mb-1"><strong>Karbo:</strong><br>${item.karbo}</div>
                        <div class="mb-1"><strong>Lauk:</strong> ${item.lauk}</div>
                        <div class="mb-1"><strong>Sayur:</strong> ${item.sayur}</div>
                        <div class="p-2 bg-light rounded mt-2"><strong>Catatan:</strong> ${item.note}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-3 mt-2 border-top">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-light border" onclick="updateHampersQty(${i},-1)">-</button>
                            <span class="btn btn-sm btn-light border disabled fw-bold">${item.qty}</span>
                            <button class="btn btn-sm btn-light border" onclick="updateHampersQty(${i},1)">+</button>
                        </div>
                        <div class="fw-bold text-success">
                            Rp ${(item.harga * item.qty).toLocaleString()}
                        </div>
                    </div>
                </div>`;
        });
    }
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
    btn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan (Rp ${total.toLocaleString()})`;
}

function scrollToForm() {
    document.getElementById('hampers-form').scrollIntoView({ behavior: 'smooth' });
}

/* ===============================
    CHECKOUT WHATSAPP (FINAL VERSION)
================================ */
function checkoutHampersWA() {
    const serviceNode = document.querySelector('input[name="service-type"]:checked');
    if(!serviceNode) { alert("Pilih tipe layanan dulu!"); return; }

    const serviceType = serviceNode.value;
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const payment = document.getElementById('cust-payment').value;
    const addr = document.getElementById('cust-address').value.trim();

    if(!name || !payment) {
        alert("Mohon lengkapi Nama dan Metode Pembayaran!");
        return;
    }

    if(serviceType === "Delivery" && (!phone || !addr)) {
        alert("Mohon lengkapi No. WhatsApp dan Alamat untuk pengiriman!");
        return;
    }

    const total = cartHampers.reduce((s, i) => s + (i.harga * i.qty), 0);

    let msg = `*👋Hallo ISASAI R & V. Pesanan Hampers ${serviceType.toUpperCase()}*\n\n`;
    msg += `👤 Nama: ${name}\n`;

    if(serviceType === "Delivery") {
        msg += `📞 HP: ${phone}\n`;
        msg += `📍 Alamat: ${addr}\n`;
    } else {
        msg += `🍴 *Layanan: Makan di Tempat*\n`;
    }

    msg += `💳 Pembayaran: ${payment}\n\n`;
    msg += `*Detail Pesanan:*\n`;

    cartHampers.forEach((it, i) => {
        msg += `*${i+1}. Hampers (x${it.qty})*\n- ${it.karbo}\n- ${it.lauk}, ${it.sayur}\n\n`;
    });

    msg += `--------------------------\n`;
    msg += `*Total: Rp ${total.toLocaleString()}*\n`;

    // --- LOGIKA PESAN DINAMIS ---
    if(serviceType === "Delivery") {
        msg += `*DP (50%): Rp ${(total * 0.5).toLocaleString()}*\n`;
        msg += `--------------------------\n`;

        if(payment.toLowerCase().includes("tunai") || payment.toLowerCase().includes("cash")) {
            msg += `⚠️ Pesanan *Jarak Jauh* dengan bayar *Tunai*. Mohon instruksi admin untuk pembayaran uang DP agar pesanan bisa diproses.\n\n`;
        } else {
            msg += `⚠️ Kami akan segera transfer DP, mohon kirimkan instruksi pembayaran via *${payment}* agar pesanan bisa segera diproses.\n\n`;
        }
    } else {
        msg += `--------------------------\n`;
    }

    // --- PENUTUP WAJIB ---
    msg += `Terima Kasih, ISASAI ~ R & V.`;

    const adminPhone = "628114814415";
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, "_blank");

    // Reset keranjang setelah checkout
    localStorage.removeItem('isasai_cart_hampers');
    cartHampers = [];

    setTimeout(() => {
        alert("Pesanan terkirim! Keranjang akan dikosongkan.");
        window.location.reload();
    }, 1000);
}