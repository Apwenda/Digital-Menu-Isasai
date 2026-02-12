/* ===============================
    DATA MEALBOX ISASAI
================================ */
const mealboxData = {
    karbo: [
        "Nasi Putih",
        "Ubi Kuning",
        "Ubi Ungu",
        "Keladi",
        "Pisang",
        "Mix Karbo (Ubi + Keladi + Pisang)"
    ],
    sayur: [
        "Kangkung Tumis",
        "Bunga Pepaya Tumis",
        "Kangkung + Bunga Pepaya Tumis"
    ],
    lauk: [
        "Ayam Kecap",
        "Ayam Bumbu Kuning",
        "Ayam Bakar",
        "Ikan Tuna Asar Suir",
        "Ikan Tuna Bumbu Kuning",
        "Ikan Tuna Goreng Saos"
    ],
    harga: 65000
};

const promoImagesMealbox = [
    "assets/images/Menu-Isasai/Makanan/Mealbox-isasai/Mealbox (1).png",
    "assets/images/Menu-Isasai/Makanan/Mealbox-isasai/Mealbox (2).png",
    "assets/images/Menu-Isasai/Makanan/Mealbox-isasai/Mealbox (3).png"
];

/* ===============================
    STORAGE & INIT
================================ */
let cartMealbox = JSON.parse(localStorage.getItem('isasai_cart_mealbox')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderPromoMealbox();
    renderOptionsMealbox();
    renderCartMealbox();
});

function saveMealboxLocal() {
    localStorage.setItem('isasai_cart_mealbox', JSON.stringify(cartMealbox));
}

/* ===============================
    RENDER FORM OPTIONS
================================ */
function renderOptionsMealbox() {
    const containers = {
        karbo: document.getElementById('karbo-container'),
        sayur: document.getElementById('sayur-container'),
        lauk: document.getElementById('lauk-container')
    };
    if(!containers.karbo) return;

    ['karbo', 'sayur', 'lauk'].forEach(type => {
        containers[type].innerHTML = '';
        mealboxData[type].forEach((val, i) => {
            containers[type].innerHTML += `
                <div class="col-6">
                    <input type="radio" class="btn-check chk-${type}" name="${type}-radio" id="${type}-${i}" value="${val}" onchange="validateMealboxForm()">
                    <label class="btn btn-outline-success w-100 text-center mb-2 small py-2 fw-bold d-flex align-items-center justify-content-center" style="min-height: 50px; font-size: 11px;" for="${type}-${i}">
                        ${val}
                    </label>
                </div>`;
        });
    });
}

function validateMealboxForm() {
    const k = document.querySelector('.chk-karbo:checked');
    const s = document.querySelector('.chk-sayur:checked');
    const l = document.querySelector('.chk-lauk:checked');
    const btn = document.getElementById('btn-add');
    if(btn) btn.disabled = !(k && s && l);
}

/* ===============================
    LOGIKA KERANJANG
================================ */
function addToMealboxCart() {
    const k = document.querySelector('.chk-karbo:checked').value;
    const s = document.querySelector('.chk-sayur:checked').value;
    const l = document.querySelector('.chk-lauk:checked').value;
    const n = document.getElementById('catatan-khusus').value.trim();

    cartMealbox.push({
        id: Date.now(),
        karbo: k, sayur: s, lauk: l,
        note: n || "Tidak ada catatan",
        qty: 1,
        harga: mealboxData.harga
    });

    saveMealboxLocal();
    renderCartMealbox();
    document.getElementById('mealbox-form').reset();
    validateMealboxForm();
    document.getElementById('mealbox-cart-view').scrollIntoView({ behavior: 'smooth' });
}

/* ===============================
    LOGIKA LAYANAN (DINE-IN / DELIVERY)
================================ */
function handleServiceSelection() {
    const isDineIn = document.getElementById('type-dinein').checked;
    const infoForm = document.getElementById('customer-info-form');
    const deliveryFields = document.getElementById('delivery-fields');
    const phoneContainer = document.getElementById('phone-container');
    const dpAlert = document.getElementById('dp-alert');
    const btnCheckout = document.getElementById('btn-checkout-wa');

    if (infoForm) {
        infoForm.classList.remove('d-none');
        btnCheckout.style.display = 'block';

        if (isDineIn) {
            deliveryFields.classList.add('d-none');
            dpAlert.classList.add('d-none');
            if(phoneContainer) phoneContainer.classList.add('d-none');
        } else {
            deliveryFields.classList.remove('d-none');
            dpAlert.classList.remove('d-none');
            if(phoneContainer) phoneContainer.classList.remove('d-none');
        }
        infoForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function renderCartMealbox() {
    const cont = document.getElementById('mealbox-cart-items');
    const serviceTypeCont = document.getElementById('service-type-container');
    const infoForm = document.getElementById('customer-info-form');
    const addMore = document.getElementById('add-more-container');

    if (!cont) return;

    if (cartMealbox.length === 0) {
        cont.innerHTML = `<div class="text-center p-5 bg-white rounded-4 border shadow-sm text-muted small">Belum ada pesanan mealbox</div>`;
        if(serviceTypeCont) serviceTypeCont.classList.add('d-none');
        if(infoForm) infoForm.classList.add('d-none');
        if(addMore) addMore.classList.add('d-none');
        updateMealboxCheckout();
        return;
    }

    if(serviceTypeCont) serviceTypeCont.classList.remove('d-none');
    if(addMore) addMore.classList.remove('d-none');

    cont.innerHTML = "";
    cartMealbox.forEach((item, i) => {
        cont.innerHTML += `
            <div class="cart-item-pro mb-3 animate__animated animate__fadeInLeft">
                <div class="cart-header-pro">
                    <span class="badge-racikan">RACIKAN MEALBOX #${i+1}</span>
                    <button class="btn-delete-pro" onclick="removeMealboxItem(${i})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
                <div class="cart-body-pro text-start">
                    <div class="detail-block"><span class="label">KARBO:</span> <span class="value">${item.karbo}</span></div>
                    <div class="detail-block"><span class="label">SAYUR:</span> <span class="value">${item.sayur}</span></div>
                    <div class="detail-block"><span class="label">LAUK:</span> <span class="value">${item.lauk}</span></div>
                    <div class="note-box-pro mt-2">Note: ${item.note}</div>
                </div>
                <div class="cart-footer-pro">
                    <div class="qty-control-pro">
                        <button onclick="updateMealboxQty(${i},-1)">-</button>
                        <span class="fw-bold px-2">${item.qty}</span>
                        <button onclick="updateMealboxQty(${i},1)">+</button>
                    </div>
                    <div class="price-pro text-success fw-bold">
                        Rp ${(item.harga * item.qty).toLocaleString()}
                    </div>
                </div>
            </div>`;
    });
    updateMealboxCheckout();
}

function updateMealboxQty(i, v) {
    cartMealbox[i].qty += v;
    if(cartMealbox[i].qty < 1) cartMealbox[i].qty = 1;
    saveMealboxLocal();
    renderCartMealbox();
}

function removeMealboxItem(i) {
    if(confirm("Hapus pesanan ini?")) {
        cartMealbox.splice(i,1);
        saveMealboxLocal();
        renderCartMealbox();
    }
}

function updateMealboxCheckout() {
    const btn = document.getElementById('btn-checkout-wa');
    if(!btn) return;
    const total = cartMealbox.reduce((s, i) => s + (i.harga * i.qty), 0);
    btn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan (Rp ${total.toLocaleString()})`;
}

function scrollToForm() {
    document.getElementById('mealbox-form').scrollIntoView({ behavior: 'smooth' });
}

/* ===============================
    CHECKOUT WHATSAPP
================================ */
function checkoutMealboxWA() {
    const serviceNode = document.querySelector('input[name="service-type"]:checked');
    if(!serviceNode) { alert("Pilih tipe layanan dulu!"); return; }

    const serviceType = serviceNode.value;
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const payment = document.getElementById('cust-payment').value;
    const addr = document.getElementById('cust-address').value.trim();
    const maps = document.getElementById('cust-maps').value.trim();

    if(!name || !payment) {
        alert("Mohon lengkapi Nama dan Metode Pembayaran!"); return;
    }

    if(serviceType === "Delivery" && (!phone || !addr)) {
        alert("Mohon lengkapi No. WhatsApp dan Alamat untuk pengiriman!"); return;
    }

    const total = cartMealbox.reduce((s, i) => s + (i.harga * i.qty), 0);

    let msg = `*👋Hallo ISASAI R & V. Pesanan Mealbox ${serviceType.toUpperCase()}*\n\n`;
    msg += `👤 Nama: ${name}\n`;

    if(serviceType === "Delivery") {
        msg += `📞 HP: ${phone}\n`;
        msg += `📍 Alamat: ${addr}\n`;
        msg += `🔗 Maps: ${maps || '-'}\n`;
    } else {
        msg += `🍴 *Layanan: Makan di Tempat*\n`;
    }

    msg += `💳 Pembayaran: ${payment}\n\n`;
    msg += `*Detail Pesanan:*\n`;

    cartMealbox.forEach((it, i) => {
        msg += `*${i+1}. Mealbox (x${it.qty})*\n- ${it.karbo}, ${it.lauk}, ${it.sayur}\n- Note: ${it.note}\n\n`;
    });

    msg += `--------------------------\n`;
    msg += `*Total: Rp ${total.toLocaleString()}*\n`;

    if(serviceType === "Delivery") {
        msg += `*DP (50%): Rp ${(total * 0.5).toLocaleString()}*\n`;
        msg += `--------------------------\n`;
        if(payment.toLowerCase().includes("tunai") || payment.toLowerCase().includes("cash")) {
            msg += `⚠️ Pesanan *Jarak Jauh* via *Tunai*. Mohon instruksi admin untuk pembayaran DP agar pesanan bisa diproses.\n\n`;
        } else {
            msg += `⚠️ Kami akan segera transfer DP, mohon kirimkan instruksi pembayaran via *${payment}* agar pesanan segera diproses.\n\n`;
        }
    } else {
        msg += `--------------------------\n`;
    }

    msg += `Terima Kasih, ISASAI ~ R & V.`;

    const adminPhone = "628114814415";
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, "_blank");

    // Reset keranjang & UI
    localStorage.removeItem('isasai_cart_mealbox');
    cartMealbox = [];
    setTimeout(() => {
        alert("Pesanan Mealbox terkirim!");
        window.location.reload();
    }, 1000);
}

function renderPromoMealbox() {
    const inner = document.getElementById('carousel-inner-promo');
    const ind = document.getElementById('carousel-indicators');
    if(!inner || !ind) return;
    promoImagesMealbox.forEach((img, i) => {
        inner.innerHTML += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><img src="${img}" class="d-block w-100"></div>`;
        ind.innerHTML += `<button type="button" data-bs-target="#carouselPromo" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}"></button>`;
    });
}