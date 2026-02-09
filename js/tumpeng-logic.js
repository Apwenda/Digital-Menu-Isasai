/**
 * ISASAI R & V - Tumpeng Custom Logic
 * File: js/tumpeng-logic.js
 */

// 1. DATA MASTER
const tumpengData = {
    lapisan: ["Keladi", "Ubi", "Singkong", "Pisang"],
    lauk: ["Ayam Bakar", "Ikan Goreng", "Daging Rica"],
    sayur: ["Urap", "Tumis Bunga Pepaya", "Kangkung"],
    olahan: ["Saus Asam Manis", "Goreng Tepung", "Kuah Kuning"]
};

// DATA PROMO GAMBAR (Carousel)
const promoImages = [
    "assets/tumpeng1.png", "assets/tumpeng2.png", "assets/tumpeng3.png",
    "assets/tumpeng4.png", "assets/tumpeng5.png", "assets/tumpeng6.png",
    "assets/tumpeng7.png", "assets/tumpeng8.png", "assets/tumpeng9.png",
    "assets/tumpeng7.png", "assets/tumpeng8.png", "assets/tumpeng9.png",
    "assets/tumpeng7.png", "assets/tumpeng8.png", "assets/tumpeng9.png",
    "assets/tumpeng7.png", "assets/tumpeng8.png", "assets/tumpeng9.png",
    "assets/tumpeng10.png"
];

// 2. STATE VARIABEL
let cartTumpeng = [];
let currentRandom = [];

// 3. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    renderPromo();
    renderOptions();
    renderCart(); // Render awal untuk status keranjang kosong
});

// 4. FUNGSI RENDER PROMO (CAROUSEL)
function renderPromo() {
    const inner = document.getElementById('carousel-inner-promo');
    const indicators = document.getElementById('carousel-indicators');

    if (!inner || !indicators) return;

    inner.innerHTML = "";
    indicators.innerHTML = "";

    promoImages.forEach((img, index) => {
        inner.innerHTML += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${img}" class="d-block w-100" style="height: 250px; object-fit: cover; border-radius: 15px;" alt="Promo Tumpeng">
            </div>`;

        indicators.innerHTML += `
            <button type="button" data-bs-target="#carouselPromo" data-bs-slide-to="${index}"
                class="${index === 0 ? 'active' : ''}"></button>`;
    });
}

// 5. FUNGSI RENDER OPSI FORM
function renderOptions() {
    const renderGroup = (containerId, data, name, type) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";
        data.forEach(item => {
            const html = type === 'checkbox'
                ? `<div class="col-6 mb-2">
                    <input type="checkbox" class="btn-check chk-item" id="t-${item}" value="${item}" name="${name}" onchange="validateForm()">
                    <label class="btn btn-outline-success btn-sm w-100" for="t-${item}">${item}</label>
                   </div>`
                : `<div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="${name}" value="${item}" id="${item}" required onchange="validateForm()">
                    <label class="form-check-label small" for="${item}">${item}</label>
                   </div>`;
            container.innerHTML += html;
        });
    };

    renderGroup('lapisan-container', tumpengData.lapisan, 'lapisan', 'checkbox');
    renderGroup('lauk-container', tumpengData.lauk, 'lauk', 'radio');
    renderGroup('sayur-container', tumpengData.sayur, 'sayur', 'radio');
    renderGroup('olahan-container', tumpengData.olahan, 'olahan', 'radio');
}

// 6. LOGIKA ACAK & VALIDASI
function generateRandom() {
    currentRandom = [...tumpengData.lapisan].sort(() => 0.5 - Math.random()).slice(0, 2);
    const display = document.getElementById('random-display');
    if (display) display.innerText = "Terpilih Acak: " + currentRandom.join(" & ");

    // Uncheck semua manual jika tombol acak ditekan
    document.querySelectorAll('.chk-item').forEach(c => c.checked = false);
    validateForm();
}

function validateForm() {
    const form = document.getElementById('tumpeng-form');
    const manualItems = document.querySelectorAll('.chk-item:checked');
    const hasManual = manualItems.length > 0;
    const hasLapisan = hasManual || currentRandom.length > 0;

    const btnAdd = document.getElementById('btn-add');
    if (btnAdd) btnAdd.disabled = !(form.checkValidity() && hasLapisan);

    // Jika user memilih manual, hapus data acak
    if (hasManual) {
        currentRandom = [];
        const display = document.getElementById('random-display');
        if (display) display.innerText = "";
    }
}

// 7. LOGIKA KERANJANG
function addToTumpengCart() {
    const formElement = document.getElementById('tumpeng-form');
    const formData = new FormData(formElement);
    const manual = Array.from(document.querySelectorAll('.chk-item:checked')).map(c => c.value);

    const newItem = {
        id: Date.now(),
        lapisan: manual.length > 0 ? manual.join("+") : currentRandom.join("+"),
        lauk: formData.get('lauk'),
        sayur: formData.get('sayur'),
        olahan: formData.get('olahan'),
        qty: 1,
        harga: 75000
    };

    cartTumpeng.push(newItem);
    renderCart();

    // Reset Form setelah berhasil tambah
    formElement.reset();
    currentRandom = [];
    const display = document.getElementById('random-display');
    if (display) display.innerText = "";
    validateForm();

    alert("Racikan tumpeng ditambahkan ke keranjang khusus!");
}

function renderCart() {
    const container = document.getElementById('tumpeng-cart-items');
    if (!container) return;

    container.innerHTML = "";

    if (cartTumpeng.length === 0) {
        container.innerHTML = `<div class="text-center text-muted py-4"><i class="bi bi-cart-x fs-1 d-block mb-2"></i>Belum ada pesanan tumpeng</div>`;
    }

    cartTumpeng.forEach((item, index) => {
        container.innerHTML += `
            <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 border-start border-4 border-success">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold text-success mb-1">Racikan Tumpeng #${index + 1}</h6>
                        <div class="small text-muted mb-2">
                            <div><i class="bi bi-layers-fill me-1"></i> ${item.lapisan}</div>
                            <div><i class="bi bi-egg-fried me-1"></i> ${item.lauk} (${item.olahan})</div>
                            <div><i class="bi bi-flower1 me-1"></i> ${item.sayur}</div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeItem(${index})">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                    <div class="qty-control d-flex align-items-center bg-light rounded-pill px-2">
                        <button class="btn btn-sm text-success fw-bold" onclick="updateQty(${index}, -1)">-</button>
                        <span class="mx-3 fw-bold small">${item.qty}</span>
                        <button class="btn btn-sm text-success fw-bold" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <div class="text-end">
                        <span class="fw-bold text-orange">Rp ${(item.harga * item.qty).toLocaleString()}</span>
                    </div>
                </div>
            </div>`;
    });

    // Update Tombol WhatsApp
    const btnCheckout = document.getElementById('btn-checkout-wa');
    if (btnCheckout) {
        btnCheckout.style.display = cartTumpeng.length > 0 ? 'block' : 'none';
        const totalSemua = cartTumpeng.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        btnCheckout.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan Tumpeng (Rp ${totalSemua.toLocaleString()})`;
    }
}

function removeItem(index) {
    if(confirm("Hapus racikan tumpeng ini?")) {
        cartTumpeng.splice(index, 1);
        renderCart();
    }
}

function updateQty(index, change) {
    cartTumpeng[index].qty += change;
    if (cartTumpeng[index].qty < 1) cartTumpeng[index].qty = 1;
    renderCart();
}

// 8. WHATSAPP INTEGRATION
function checkoutTumpengWA() {
    let text = "Halo Isasai R & V, saya mau pesan Tumpeng Custom:\n\n";

    cartTumpeng.forEach((item, i) => {
        text += `*Tumpeng #${i+1}* (x${item.qty})\n`;
        text += `- Lapisan: ${item.lapisan}\n`;
        text += `- Lauk: ${item.lauk} (${item.olahan})\n`;
        text += `- Sayur: ${item.sayur}\n`;
        text += `- Subtotal: Rp ${(item.harga * item.qty).toLocaleString()}\n\n`;
    });

    const total = cartTumpeng.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    text += `*Total Akhir: Rp ${total.toLocaleString()}*`;

    const waLink = `https://wa.me/628114814415?text=${encodeURIComponent(text)}`;
    window.open(waLink, '_blank');
}