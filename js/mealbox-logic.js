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
    harga: 65000 // Harga per box sesuai permintaan

};

const promoImagesMealbox = [
    "assets/images/Menu-Isasai/Makanan/Mealbox-isasai/Mealbox (1).png",
    "assets/images/Menu-Isasai/Makanan/Mealbox-isasai/Mealbox (2).png",
    "assets/images/Menu-Isasai/Makanan/Mealbox-isasai/Mealbox (3).png"
];


let cartMealbox = JSON.parse(localStorage.getItem('isasai_cart_mealbox')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderPromoMealbox();
    renderOptionsMealbox();
    renderCartMealbox();
});

function saveMealboxLocal() {
    localStorage.setItem('isasai_cart_mealbox', JSON.stringify(cartMealbox));
}

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
            // Kita gunakan col-6 agar 2 pilihan per baris, sangat pas untuk daftar yang panjang
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
}

function renderCartMealbox() {
    const cont = document.getElementById('mealbox-cart-items');
    const info = document.getElementById('customer-info-form');
    const addMore = document.getElementById('add-more-container');

    if (!cont) return;

    if (cartMealbox.length === 0) {
        cont.innerHTML = `<div class="text-center p-5 bg-white rounded-4 border">Belum ada pesanan mealbox</div>`;
        if(info) info.classList.add('d-none');
        if(addMore) addMore.classList.add('d-none');
        updateMealboxCheckout();
        return;
    }

    if(info) info.classList.remove('d-none');
    if(addMore) addMore.classList.remove('d-none');

    cont.innerHTML = "";
    cartMealbox.forEach((item, i) => {
        // RENDERING MENGGUNAKAN CLASS CSS BARU ANDA
        cont.innerHTML += `
            <div class="cart-item-pro">
                <div class="cart-header-pro">
                    <span class="badge-racikan">RACIKAN MEALBOX #${i+1}</span>
                    <button class="btn-delete-pro" onclick="removeMealboxItem(${i})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
                <div class="cart-body-pro">
                    <div class="detail-block"><span class="label">PILIHAN KARBO</span><span class="value">${item.karbo}</span></div>
                    <div class="detail-block"><span class="label">PILIHAN SAYUR</span><span class="value">${item.sayur}</span></div>
                    <div class="detail-block"><span class="label">LAUK UTAMA</span><span class="value">${item.lauk}</span></div>
                    <div class="note-box-pro">Note: ${item.note}</div>
                </div>
                <div class="cart-footer-pro">
                    <div class="qty-control-pro">
                        <button onclick="updateMealboxQty(${i},-1)">-</button>
                        <span class="fw-bold px-2">${item.qty}</span>
                        <button onclick="updateMealboxQty(${i},1)">+</button>
                    </div>
                    <div class="price-pro">
                        <span>Rp ${(item.harga * item.qty).toLocaleString()}</span>
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
    if(confirm("Hapus item ini?")) {
        cartMealbox.splice(i,1);
        saveMealboxLocal();
        renderCartMealbox();
    }
}

function updateMealboxCheckout() {
    const btn = document.getElementById('btn-checkout-wa');
    if(!btn) return;
    const total = cartMealbox.reduce((s, i) => s + (i.harga * i.qty), 0);
    btn.style.display = cartMealbox.length > 0 ? 'block' : 'none';
    btn.innerHTML = `<i class="bi bi-whatsapp me-2"></i>Kirim Pesanan (Rp ${total.toLocaleString()})`;
}

function scrollToForm() {
    document.getElementById('mealbox-form').scrollIntoView({ behavior: 'smooth' });
}

function checkoutMealboxWA() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const addr = document.getElementById('cust-address').value.trim();
    const maps = document.getElementById('cust-maps').value.trim();
    const payment = document.getElementById('cust-payment').value;

    if(!name || !phone || !addr || !payment) {
        alert("Mohon lengkapi Data Pelanggan!"); return;
    }

    const total = cartMealbox.reduce((s, i) => s + (i.harga * i.qty), 0);
    const dp = total * 0.5;

    let msg = "*👋Hallo ISASAI R & V. PESANAN MEALBOX ISASAI*\n\n";
    msg += `*Data Pelanggan:*\n👤 Nama: ${name}\n📞 HP: ${phone}\n📍 Alamat: ${addr}\n🔗 Maps: ${maps || '-'}\n💳 Pembayaran: ${payment}\n\n`;

    msg += `*Detail Pesanan:*\n`;
    cartMealbox.forEach((it, i) => {
        msg += `*${i+1}. Mealbox (x${it.qty})*\n- Karbo: ${it.karbo}\n- Lauk: ${it.lauk}\n- Sayur: ${it.sayur}\n- Note: ${it.note}\n\n`;
    });

    msg += `--------------------------\n`;
    msg += `*Total Pesanan: Rp ${total.toLocaleString()}*\n`;
    msg += `*Kami Ingin DP (50%): Rp ${dp.toLocaleString()}*\n`;
    msg += `--------------------------\n\n`;
    msg += `⚠️ *PENTING*\nSebelum pesanan diposes kami ingin DP 50% dahulu.\n\n`;
    msg += `_Mohon konfirmasi admin untuk instruksi pembayaran via ${payment}. selanjutnya_ 🙏`;

    window.open(`https://wa.me/628114814415?text=${encodeURIComponent(msg)}`, "_blank");
    localStorage.removeItem('isasai_cart_mealbox');
    cartMealbox = [];
    setTimeout(() => { window.location.reload(); }, 800);
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