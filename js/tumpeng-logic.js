/* ===============================
    DATA TUMPENG ISASAI
================================ */
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
    sayur: ["Kacang Bunga Pepaya", "Tumis Bunga Pepaya", "Kangkung Bunga Pepaya", "Kangkung Tumis", "Daun Singkong", "Daun Ubi + Daun Pepaya", "Tumis Daun Labu", "Tumis Daun Pakis"],
    harga: 750000
};

const promoImages = [
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (1).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (2).jpg",
    "assets/images/Menu-Isasai/Tumpeng-pangan-lokal/TPL  (3).jpg"
];

let cartTumpeng = JSON.parse(localStorage.getItem('isasai_cart_tumpeng')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderPromo();
    renderOptions();
    renderCart();
});

function saveToLocal() {
    localStorage.setItem('isasai_cart_tumpeng', JSON.stringify(cartTumpeng));
}

/* ===============================
    LOGIKA FORM & RENDER
================================ */
function renderOptions() {
    const lpC = document.getElementById('lapisan-container');
    if(!lpC) return;

    tumpengData.lapisan.forEach(item => {
        lpC.innerHTML += `
            <div class="col-4 text-center mb-3">
                <input type="radio" class="btn-check chk-lp" name="lapisan-radio" id="lp-${item.name}" value="${item.name}" onchange="validateForm()">
                <label class="btn p-2 w-100 h-100 rounded-3 color-option-label" for="lp-${item.name}">
                    <div class="color-circle shadow-sm" style="background:${item.color}; width:45px; height:45px; border-radius:50%; margin:0 auto 8px; border:3px solid white;"></div>
                    <div style="font-size:10px; font-weight:700; line-height:1.2; color:#333;">${item.name}</div>
                </label>
            </div>`;
    });

    const renderGroup = (id, data, cls, limit) => {
        const cont = document.getElementById(id);
        data.forEach(val => {
            cont.innerHTML += `
                <div class="col-6">
                    <input type="checkbox" class="btn-check ${cls}" id="${id}-${val}" value="${val}" onchange="checkLimit(this, '.${cls}', ${limit})">
                    <label class="btn btn-outline-success btn-sm w-100 text-start py-2 mb-2" style="font-size:11px;" for="${id}-${val}">${val}</label>
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
        alert(`Untuk kategori ini, maksimal pilih ${max} Menu.`);
    }
    validateForm();
}

function validateForm() {
    const lp = document.querySelector('.chk-lp:checked');
    const kb = document.querySelectorAll('.chk-kb:checked').length;
    const lk = document.querySelectorAll('.chk-lk:checked').length;
    const sy = document.querySelectorAll('.chk-sy:checked').length;

    const btnAdd = document.getElementById('btn-add');
    const isValid = (lp && kb > 0 && lk === 2 && sy > 0);

    btnAdd.disabled = !isValid;

    // Opsional: Beri warna orange mencolok jika sudah valid
    if(isValid) {
        btnAdd.classList.add('animate__pulse');
    } else {
        btnAdd.classList.remove('animate__pulse');
    }
}

/* ===============================
    MANAJEMEN KERANJANG
================================ */
function addToTumpengCart() {
    const lp = document.querySelector('.chk-lp:checked').value;
    const kb = Array.from(document.querySelectorAll('.chk-kb:checked')).map(c => c.value);
    const lk = Array.from(document.querySelectorAll('.chk-lk:checked')).map(c => c.value);
    const sy = Array.from(document.querySelectorAll('.chk-sy:checked')).map(c => c.value);
    const note = document.getElementById('catatan-khusus').value.trim();

    cartTumpeng.push({
        id: Date.now(),
        lapisan: lp,
        karbo: kb.join(", "),
        lauk: lk.join(" & "),
        sayur: sy.join(", "),
        note: note || "Tidak ada catatan",
        qty: 1,
        harga: tumpengData.harga
    });

    saveToLocal();
    renderCart();
    document.getElementById('tumpeng-form').reset();
    validateForm();
    document.getElementById('tumpeng-cart-view').scrollIntoView({ behavior: 'smooth' });
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

function renderCart() {
    const cont = document.getElementById('tumpeng-cart-items');
    const serviceTypeCont = document.getElementById('service-type-container');
    const infoForm = document.getElementById('customer-info-form');
    const addMoreBtn = document.getElementById('add-more-container');

    if (!cont) return;

    if (cartTumpeng.length === 0) {
        cont.innerHTML = `<div class="text-center p-5 bg-white rounded-4 border shadow-sm">Belum ada racikan tumpeng</div>`;
        if(serviceTypeCont) serviceTypeCont.classList.add('d-none');
        if(infoForm) infoForm.classList.add('d-none');
        if(addMoreBtn) addMoreBtn.classList.add('d-none');
        updateCheckout();
        return;
    }

    if(serviceTypeCont) serviceTypeCont.classList.remove('d-none');
    if(addMoreBtn) addMoreBtn.classList.remove('d-none');

    cont.innerHTML = "";
    cartTumpeng.forEach((item, i) => {
        cont.innerHTML += `
            <div class="cart-item-pro mb-3 shadow-sm border-0">
                <div class="cart-header-pro">
                    <span class="badge-racikan">TUMPENG #${i + 1}</span>
                    <button class="btn-delete-pro" onclick="removeItem(${i})"><i class="bi bi-trash3"></i></button>
                </div>
                <div class="cart-body-pro p-3 text-start">
                    <div class="detail-block"><span class="label">LAPISAN:</span> <span class="value">${item.lapisan}</span></div>
                    <div class="detail-block"><span class="label">KARBO:</span> <span class="value">${item.karbo}</span></div>
                    <div class="detail-block"><span class="label">LAUK:</span> <span class="value">${item.lauk}</span></div>
                    <div class="detail-block"><span class="label">SAYUR:</span> <span class="value">${item.sayur}</span></div>
                    <div class="note-box-pro mt-2">Note: ${item.note}</div>
                </div>
                <div class="cart-footer-pro p-3 border-top d-flex justify-content-between align-items-center">
                    <div class="qty-control-pro">
                        <button onclick="updateQty(${i},-1)">-</button>
                        <span class="fw-bold px-2">${item.qty}</span>
                        <button onclick="updateQty(${i},1)">+</button>
                    </div>
                    <div class="price-pro text-success fw-bold">Rp ${(item.harga * item.qty).toLocaleString()}</div>
                </div>
            </div>`;
    });
    updateCheckout();
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
    if(!btn) return;
    const total = cartTumpeng.reduce((s, i) => s + (i.harga * i.qty), 0);
    btn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan (Rp ${total.toLocaleString()})`;
}

function scrollToForm() {
    document.getElementById('tumpeng-form').scrollIntoView({ behavior: 'smooth' });
}

/* ===============================
    CHECKOUT WHATSAPP FINAL
================================ */
function checkoutTumpengWA() {
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

    const total = cartTumpeng.reduce((s, i) => s + (i.harga * i.qty), 0);

    let msg = `*👋Hallo ISASAI R & V. Pesanan Tumpeng ${serviceType.toUpperCase()}*\n\n`;
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

    cartTumpeng.forEach((it, i) => {
        msg += `*${i+1}. Tumpeng (x${it.qty})*\n`;
        msg += `- Lapisan: ${it.lapisan}\n`;
        msg += `- Karbo: ${it.karbo}\n`;
        msg += `- Lauk: ${it.lauk}\n`;
        msg += `- Sayur: ${it.sayur}\n`;
        msg += `- Note: ${it.note}\n\n`;
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

    localStorage.removeItem('isasai_cart_tumpeng');
    cartTumpeng = [];
    setTimeout(() => { window.location.reload(); }, 1000);
}

function renderPromo() {
    const inner = document.getElementById('carousel-inner-promo');
    const ind = document.getElementById('carousel-indicators');
    if(!inner || !ind) return;
    promoImages.forEach((img, i) => {
        inner.innerHTML += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><img src="${img}" class="d-block w-100"></div>`;
        ind.innerHTML += `<button type="button" data-bs-target="#carouselPromo" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}"></button>`;
    });
}