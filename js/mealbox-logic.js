/* ===============================
    DATA MEALBOX
================================ */
const mealboxData = {
    karbo: ["Nasi Putih", "Nasi Kuning", "Papeda"],
    sayur: ["Tumis Kangkung", "Sayur Asem", "Bunga Pepaya"],
    lauk: ["Ayam Goreng", "Ikan Kuah Kuning", "Daging Sapi Asap"],
    harga: 45000 // Contoh Harga per box
};

const promoImagesMealbox = [
    "assets/images/mealbox-1.jpg",
    "assets/images/mealbox-2.jpg"
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
    RENDER OPTIONS
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
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check chk-${type}" name="${type}-radio" id="${type}-${i}" value="${val}" onchange="validateMealboxForm()">
                    <label class="btn btn-outline-success w-100 text-center mb-2 small py-2" for="${type}-${i}">${val}</label>
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
    CART LOGIC
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

function renderCartMealbox() {
    const cont = document.getElementById('mealbox-cart-items');
    const info = document.getElementById('customer-info-form');
    const addMore = document.getElementById('add-more-container');

    if (!cont) return;

    if (cartMealbox.length === 0) {
        cont.innerHTML = `<div class="text-center p-4 bg-white rounded-4 border">Keranjang Kosong</div>`;
        if(info) info.classList.add('d-none');
        if(addMore) addMore.classList.add('d-none');
        updateMealboxCheckout();
        return;
    }

    if(info) info.classList.remove('d-none');
    if(addMore) addMore.classList.remove('d-none');

    cont.innerHTML = "";
    cartMealbox.forEach((item, i) => {
        cont.innerHTML += `
            <div class="cart-item-pro mb-3 p-3 bg-white rounded-4 border shadow-sm">
                <div class="d-flex justify-content-between">
                    <span class="badge bg-success mb-2">MEALBOX #${i+1}</span>
                    <i class="bi bi-trash text-danger" onclick="removeMealboxItem(${i})"></i>
                </div>
                <div class="small">
                    ${item.karbo} | ${item.lauk} | ${item.sayur}<br>
                    <span class="text-muted small">Note: ${item.note}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-light border" onclick="updateMealboxQty(${i},-1)">-</button>
                        <span class="btn btn-light border disabled">${item.qty}</span>
                        <button class="btn btn-light border" onclick="updateMealboxQty(${i},1)">+</button>
                    </div>
                    <div class="fw-bold text-success">Rp ${(item.harga * item.qty).toLocaleString()}</div>
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
    if(confirm("Hapus item?")) {
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

/* ===============================
    WA CHECKOUT
================================ */
function checkoutMealboxWA() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const addr = document.getElementById('cust-address').value.trim();
    const maps = document.getElementById('cust-maps').value.trim();
    const payment = document.getElementById('cust-payment').value;

    if(!name || !phone || !addr || !payment) {
        alert("Mohon lengkapi data!"); return;
    }

    const total = cartMealbox.reduce((s, i) => s + (i.harga * i.qty), 0);
    const dp = total * 0.5;

    let msg = "*👋 Hallo ISASAI R & V. PESANAN MEALBOX*\n\n";
    msg += `👤 Nama: ${name}\n📞 HP: ${phone}\n📍 Alamat: ${addr}\n🔗 Maps: ${maps || '-'}\n💳 Pembayaran: ${payment}\n\n`;

    msg += `*Detail Pesanan:*\n`;
    cartMealbox.forEach((it, i) => {
        msg += `*${i+1}. Mealbox (x${it.qty})*\n- ${it.karbo}, ${it.lauk}, ${it.sayur}\n- Note: ${it.note}\n\n`;
    });

    msg += `--------------------------\n`;
    msg += `*Total: Rp ${total.toLocaleString()}*\n`;
    msg += `*DP Wajib (50%): Rp ${dp.toLocaleString()}*\n`;
    msg += `--------------------------\n\n`;
    msg += `⚠️ Pesanan diproses setelah DP masuk.\n_Mohon konfirmasi instruksi pembayaran via ${payment}._ 🙏`;

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
        inner.innerHTML += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><img src="${img}" class="d-block w-100" style="height:250px; object-fit:contain; background:#f8f9fa;"></div>`;
        ind.innerHTML += `<button type="button" data-bs-target="#carouselMealbox" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}"></button>`;
    });
}