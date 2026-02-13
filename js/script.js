// 1. STATE & KONFIGURASI
let menuData = [];
// State untuk menyimpan filter yang sedang aktif agar tidak reset saat tambah/kurang item
let currentDisplayMenu = [];
let cart = JSON.parse(localStorage.getItem("isasai_cart")) || [];
const ADMIN_WA = "628114814415";

// 2. INISIALISASI DATA
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    menuData = data;
    currentDisplayMenu = data; // Inisialisasi awal dengan semua menu
    syncCart();
  })
  .catch((err) => console.error("Gagal memuat data menu:", err));

/* ===============================
   HERO NAVIGATION
================================ */
function goToHero() {
  const mainApp = document.getElementById("main-app");
  const hero = document.getElementById("hero-view");

  if (mainApp) mainApp.style.display = "none";
  if (hero) {
    hero.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function goToHomeView() {
    document.getElementById("hero-view").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    showPage('home-view');
}

/* ===============================
   MOBILE BOTTOM NAV HANDLER
================================ */
function navigateMobile(target) {
  const navItems = document.querySelectorAll(".mobile-bottom-nav .nav-item");
  const mainApp = document.getElementById("main-app");
  const hero = document.getElementById("hero-view");

  // reset active state
  navItems.forEach((item) => item.classList.remove("active"));

  // set active sesuai target
  navItems.forEach((item) => {
    if (item.dataset.target === target) {
      item.classList.add("active");
    }
  });

  // ===== HERO =====
  if (target === "hero") {
    // tampilkan hero
    if (hero) hero.style.display = "block";

    // sembunyikan app
    if (mainApp) mainApp.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // ===== HOME / CART =====
  if (hero) hero.style.display = "none";
  if (mainApp) mainApp.style.display = "block";

  // gunakan sistem navigasi asli
  if (typeof showPage === "function") {
    showPage(target); // 'home' atau 'cart'
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 3. FUNGSI RENDER MENU UTAMA
function renderMenu(items) {
  const container = document.getElementById("menu-container");
  if (!container) return;

  container.innerHTML = items
    .map((item) => {
      const itemInCart = cart.find((c) => c.id === item.id);
      const carouselId = `slider-${item.id}`;
      const collapseId = `detail-${item.id}`;

      // Logika Tombol
      const buttonHTML = itemInCart
        ? `
            <div class="d-flex align-items-center justify-content-between bg-light rounded-pill p-1 border shadow-sm mt-auto">
                <button class="btn btn-sm text-dark p-0 px-2" onclick="updateQty(event, ${item.id}, -1)">
                    <i class="bi bi-dash-circle-fill fs-5 text-danger"></i>
                </button>
                <span id="qty-menu-${item.id}" class="fw-bold">${itemInCart.qty}</span>
                <button class="btn btn-sm text-dark p-0 px-2" onclick="updateQty(event, ${item.id}, 1)">
                    <i class="bi bi-plus-circle-fill fs-5 text-success"></i>
                </button>
            </div>`
        : `
              <button onclick="validateAndAdd(event, ${item.id})"
                      class="btn btn-add-to-cart w-100 py-2 shadow-sm text-uppercase d-flex align-items-center justify-content-center gap-2 mt-auto">
                  <span class="add-icon">+</span> Tambah
              </button>
            `;

      // === KONDISI KHUSUS UNTUK KATEGORI EXTRA ===
      if (item.kategori === "Extra") {
        return `
          <div class="col-6 col-md-4 col-lg-3 mb-3">
              <div class="card h-100 border-0 shadow-sm rounded-3">
                  <div class="card-body d-flex flex-column p-3">
                      <h6 class="fw-bold text-dark mb-1 small">${item.nama}</h6>
                      <div class="text-success fw-bold small mb-3">Rp ${item.harga.toLocaleString()}</div>
                      <div onclick="event.stopPropagation()" class="mt-auto">
                          ${buttonHTML}
                      </div>
                  </div>
              </div>
          </div>`;
      }

      // === KONDISI NORMAL UNTUK MENU LAINNYA ===
      const bestSellerTag = item.isBestSeller
        ? `<div class="position-absolute top-0 end-0 badge-best-seller shadow-sm text-uppercase" style="z-index:3"><i class="bi bi-fire me-1"></i>Best Seller</div>`
        : "";

      const indicators = item.gambar
        .map(
          (_, i) =>
            `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}"></button>`,
        )
        .join("");

      const images = item.gambar
        .map(
          (img, i) => `
        <div class="carousel-item ${i === 0 ? "active" : ""}" data-bs-interval="10000">
            <img src="${img}" class="d-block w-100" style="height: 180px; object-fit: cover;">
        </div>`,
        )
        .join("");

      const detailPaketHTML = item.items
        ? `
          <div class="mt-2" onclick="event.stopPropagation()">
              <button class="btn btn-outline-success btn-sm w-100 mb-2 fw-bold"
                      type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                  <i class="bi bi-list-check me-1"></i>
                  ${item.isPaket ? "Isi Paket" : "Pilihan Menu"}
              </button>
              <div class="collapse" id="${collapseId}">
                  <ul class="paket-detail-list list-unstyled shadow-sm">
                      ${item.items.map((p) => `<li><span><i class="bi bi-check-circle-fill text-success me-2"></i>${p.name}</span><span class="badge bg-warning text-dark rounded-pill">${p.qty}</span></li>`).join("")}
                  </ul>
              </div>
          </div>`
        : "";

      // PERBAIKAN: Deskripsi sekarang muncul selama datanya ada di JSON
      const deskripsiHTML = item.deskripsi
        ? `<p class="small text-muted mb-2 text-truncate-2">${item.deskripsi}</p>`
        : "";

      return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card card-menu h-100 position-relative shadow-sm border-0"
                 onclick="showProductDetail(${item.id})" style="cursor: pointer;">
                ${bestSellerTag}

                <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">${indicators}</div>
                    <div class="carousel-inner rounded-top-3">${images}</div>

                    <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" onclick="event.stopPropagation()">
                        <span class="carousel-control-prev-icon" aria-hidden="true" style="width: 20px; height: 20px;"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" onclick="event.stopPropagation()">
                        <span class="carousel-control-next-icon" aria-hidden="true" style="width: 20px; height: 20px;"></span>
                    </button>
                </div>

                <div class="card-body d-flex flex-column p-3">
                    <h6 class="fw-bold text-dark mb-1 text-truncate">${item.nama}</h6>
                    <div class="price-tag mb-2">Rp ${item.harga.toLocaleString()}</div>
                    <div class="flex-grow-1">
                        ${deskripsiHTML}
                        ${detailPaketHTML}
                    </div>
                    <div onclick="event.stopPropagation()">
                        ${buttonHTML}
                    </div>
                </div>
            </div>
        </div>`;
    })
    .join("");

  // Inisialisasi ulang carousel
  const allCarousels = container.querySelectorAll(".carousel");
  allCarousels.forEach((c) => new bootstrap.Carousel(c));
}

// Mengurutkan menu berdasarkan harga dari termurah ke termahal
const menuUrut = menuData.sort((a, b) => a.harga - b.harga);

// Setelah diurutkan, baru panggil fungsi render/tampil menu
renderMenu(menuUrut);

// Update SyncCart untuk Floating Bar
function syncCart() {
  localStorage.setItem("isasai_cart", JSON.stringify(cart));

  const totalQty = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.harga * b.qty, 0);

  // Update Badge Nav
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.innerText = totalQty;
    countEl.style.display = totalQty > 0 ? "block" : "none";
  }

  // Update Floating Bar
  const floatingBar = document.getElementById("floating-cart-bar");
  const homeView = document.getElementById("home-view");
  const isHome = homeView && homeView.style.display !== "none";

  if (floatingBar) {
    if (totalQty > 0 && isHome) {
      floatingBar.classList.remove("d-none");
      document.getElementById("floating-count").innerText = totalQty;
      document.getElementById("floating-total").innerText =
        `Rp ${totalPrice.toLocaleString()}`;
    } else {
      floatingBar.classList.add("d-none");
    }
  }

  // --- Update angka di kartu menu ---
  // Reset semua ke 0
  document
    .querySelectorAll('[id^="qty-menu-"]')
    .forEach((el) => (el.innerText = "0"));

  // Isi kembali jumlah berdasarkan ID produk
  // Catatan: Di kartu menu, kita menjumlahkan total Qty ID yang sama
  // (meskipun beda pilihan kuah) agar angka di kartu tetap akurat secara total.
  cart.forEach((item) => {
    const el = document.getElementById(`qty-menu-${item.id}`);
    if (el) {
      const currentVal = parseInt(el.innerText) || 0;
      el.innerText = currentVal + item.qty;
    }
  });

  // Render ulang daftar di halaman keranjang
  if (typeof renderCartList === "function") {
    renderCartList();
  }
}

function validateAndAdd(event, id) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const item = menuData.find((m) => m.id === id);

    // Cek apakah ada item di dalam paket yang memiliki properti 'options'
    const butuhPilihan = item.items && item.items.some(p => p.options && p.options.length > 0);

    if (butuhPilihan) {
        // Jika butuh pilihan, arahkan user untuk buka pop-up detail
        alert("Menu ini memiliki pilihan opsi (seperti jenis kuah). Silakan pilih opsi di dalam detail menu.");
        showProductDetail(id); // Memaksa pop-up terbuka
    } else {
        // Jika menu satuan biasa atau paket tanpa opsi, langsung tambah ke keranjang
        addToCart(null, id);
    }
}

// 4. LOGIKA KERANJANG
// Fungsi Tambah (Urutan: event dulu, baru id)

function addToCart(event, id) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const form = document.getElementById(`form-opsi-paket-${id}`);
  let pilihanUser = [];

  if (form) {
    if (!form.checkValidity()) {
      alert("Silakan pilih opsi menu paket terlebih dahulu!");
      form.reportValidity();
      return;
    }
    const formData = new FormData(form);
    formData.forEach((value) => {
      pilihanUser.push(value);
    });
  }

  const opsiString = pilihanUser.join(", ");

  // SOLUSI: Cari index berdasarkan ID DAN Opsi Pilihan
  const index = cart.findIndex((c) => c.id === id && c.pilihan === opsiString);

  if (index !== -1) {
    // Jika ID dan Pilihan SAMA, baru tambahkan Qty
    cart[index].qty += 1;
  } else {
    // Jika ID sama tapi PILIHAN BERBEDA, buat baris baru di keranjang
    const product = menuData.find((m) => m.id === id);
    if (product) {
      cart.push({
        ...product,
        qty: 1,
        pilihan: opsiString
      });
    }
  }

  syncCart();

  // Tutup modal
  const modalEl = document.getElementById("detailMenuModal");
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
  }
}

function animateQty(elementId, start, end) {
  const obj = document.getElementById(elementId);
  if (!obj) return;

  // Tambahkan class efek scale
  obj.classList.add("qty-scale");

  let current = start;
  const range = end - start;
  const duration = 300; // ms
  const stepTime = Math.abs(Math.floor(duration / range));

  const timer = setInterval(() => {
    if (current === end) {
      clearInterval(timer);
      obj.classList.remove("qty-scale");
    } else {
      current = end > start ? current + 1 : current - 1;
      obj.innerText = current;
    }
  }, stepTime || 50);
}

// Fungsi Update Jumlah
function updateQty(event, id, change, pilihan = "") {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  // CARI BERDASARKAN ID DAN PILIHAN
  const index = cart.findIndex(
    (c) => c.id === id && (c.pilihan || "") === pilihan
  );

  if (index !== -1) {
    cart[index].qty += change;

    // Jika jumlahnya 0 atau kurang, hapus dari keranjang
    if (cart[index].qty <= 0) {
      const yakin = confirm("Hapus menu ini dari keranjang?");
      if (yakin) {
        cart.splice(index, 1);
      } else {
        cart[index].qty = 1; // Kembalikan ke 1 jika batal hapus
      }
    }

    syncCart(); // Sinkronkan data dan render ulang
  }
}

function removeFromCart(event, id, pilihan = "") {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const yakin = confirm(
    "Apakah Anda yakin ingin mengeluarkan menu ini dari daftar pesanan Anda?",
  );

  if (yakin) {
    // Cari index berdasarkan ID DAN Pilihan agar spesifik
    const index = cart.findIndex((c) => c.id === id && (c.pilihan || "") === pilihan);

    if (index !== -1) {
      cart.splice(index, 1); // Hanya hapus 1 baris yang sesuai
      syncCart();
    }
  }
}

function renderQtyUI(id, qty) {
  return `
    <div class="d-flex align-items-center justify-content-between bg-light rounded-pill p-1 border">
        <button class="btn btn-sm text-dark p-0 px-2" onclick="updateQty(${id}, -1)">
            <i class="bi bi-dash-circle-fill fs-5"></i>
        </button>
        <span class="fw-bold">${qty}</span>
        <button class="btn btn-sm text-dark p-0 px-2" onclick="updateQty(${id}, 1)">
            <i class="bi bi-plus-circle-fill fs-5"></i>
        </button>
    </div>`;
}

function syncCart() {
  localStorage.setItem("isasai_cart", JSON.stringify(cart));

  // Update Badge Count
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const totalQty = cart.reduce((a, b) => a + b.qty, 0);
    countEl.innerText = totalQty;
    countEl.style.display = totalQty > 0 ? "block" : "none";
  }

  // Render ulang halaman keranjang
  renderCartList();

  // Render ulang menu utama dengan state filter terakhir agar tidak reset
  renderMenu(currentDisplayMenu);
}

function renderCartList() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-harga");
  if (!container || !totalEl) return;

  const backToMenuBtn = `
    <div class="text-center mt-4">
        <button onclick="navigateMobile('home')"
          class="btn btn-outline-warning rounded-pill px-4 fw-semibold">
          Tambah Menu
        </button>
    </div>
  `;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x fs-1 text-muted"></i>
        <p class="text-muted mt-2">Keranjang Anda kosong.</p>
        ${backToMenuBtn}
      </div>
    `;
    totalEl.innerText = "Rp 0";
    return;
  }

  let total = 0;
  container.innerHTML = cart
    .map((item) => {
      const subtotal = item.harga * item.qty;
      total += subtotal;

      return `
      <div class="card mb-3 border-0 shadow-sm rounded-3">
        <div class="card-body p-2">
          <div class="d-flex align-items-center">
            <img src="${item.gambar[0]}" style="width:65px;height:65px;object-fit:cover" class="rounded me-3">

            <div class="flex-grow-1">
              <h6 class="mb-0 fw-bold small">${item.nama}</h6>

              ${item.pilihan ? `
                <div class="small text-orange fw-semibold italic mb-1" style="font-size: 0.75rem; color: #FF8C00;">
                  <i class="bi bi-info-circle me-1"></i>${item.pilihan}
                </div>
              ` : ""}

              <div class="text-success fw-bold small mb-1">
                Rp ${subtotal.toLocaleString()}
              </div>

              <div class="d-flex align-items-center justify-content-between mt-1">
                <div class="d-flex align-items-center bg-light rounded-pill px-2 py-1 border">
                  <button class="btn btn-sm p-0 border-0"
                          onclick="updateQty(event, ${item.id}, -1, '${item.pilihan || ""}')">
                    <i class="bi bi-dash-circle fs-5"></i>
                  </button>

                  <span class="mx-3 fw-bold small">${item.qty}</span>

                  <button class="btn btn-sm p-0 border-0"
                          onclick="updateQty(event, ${item.id}, 1, '${item.pilihan || ""}')">
                    <i class="bi bi-plus-circle fs-5"></i>
                  </button>
                </div>

                <button class="btn btn-sm text-danger p-0 border-0"
                        onclick="removeFromCart(event, ${item.id}, '${item.pilihan || ""}')">
                    <i class="bi bi-trash3 fs-5"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML += backToMenuBtn;
  totalEl.innerText = `Rp ${total.toLocaleString()}`;
}

// NAVIGASI HALAMAN
function enterApp() {
  const hero = document.getElementById("hero-view");
  const app = document.getElementById("main-app");
  const nav = document.querySelector(".mobile-bottom-nav");

  if (!hero || !app) return;

  hero.classList.add("hero-hidden");
  app.classList.add("show-app");

  // tampilkan nav mobile
  if (nav) nav.style.display = "flex";

  // default masuk ke menu
  showPage("home");

  window.scrollTo(0, 0);
}

function enterApp() {
  const hero = document.getElementById("hero-view");
  const app = document.getElementById("main-app");
  const nav = document.querySelector(".mobile-bottom-nav");

  if (!hero || !app || !nav) return;

  hero.classList.add("hero-hidden");
  app.classList.add("show-app");
  nav.style.display = "flex";

  showPage("home");
}

function showPage(page) {
  const home = document.getElementById("home-view");
  const cartView = document.getElementById("cart-view");
  const contactView = document.getElementById("contact-view");

  if (!home || !cartView || !contactView) return;

  // hide all sections
  home.style.display = "none";
  cartView.style.display = "none";
  contactView.style.display = "none";

  // show section
  if (page === "home") home.style.display = "block";
  if (page === "cart") {
    cartView.style.display = "block";
    if (typeof renderCartList === "function") renderCartList();
  }
  if (page === "contact") contactView.style.display = "block";

  // === FIX UTAMA ADA DI SINI ===
  document
    .querySelectorAll(".mobile-bottom-nav .nav-item")
    .forEach((item) => item.classList.remove("active"));

  const activeNav = document.querySelector(
    `.mobile-bottom-nav .nav-item[data-target="${page}"]`,
  );
  if (activeNav) activeNav.classList.add("active");

  window.scrollTo(0, 0);
}

function showProductDetail(id) {
  const item = menuData.find((m) => m.id === id);
  if (!item) return;

  const container = document.getElementById("detail-menu-content");

  const images = item.gambar
    .map(
      (img, i) => `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <img src="${img}" class="d-block w-100" style="height: auto; max-height: 350px; object-fit: contain; background: #f8f9fa;">
    </div>`
    )
    .join("");

  // Fungsi helper untuk merender list item (agar tidak duplikasi kode)
  const renderList = (listData, prefix) => {
    if (!listData) return "";
    return listData.map((p, index) => `
      <li class="border-bottom border-light py-3">
        <div class="d-flex justify-content-between align-items-center ${p.options ? 'mb-2' : ''}">
            <span><i class="bi bi-check-circle-fill me-2" style="color: #004225;"></i>${p.name}</span>
            <span class="badge bg-white text-dark border" style="border-color: #FFCC00 !important;">${p.qty}</span>
        </div>
        ${p.options ? `
          <select class="form-select form-select-sm border-warning"
                  name="${prefix}-${index}" style="border-color: #FFCC00 !important;" required>
            <option value="" selected disabled>-- Pilih salah satu --</option>
            ${p.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
          </select>
        ` : ""}
      </li>`).join("");
  };

  container.innerHTML = `
    <div class="modal-header border-0 position-absolute w-100 z-3">
        <button type="button" class="btn-close bg-white p-2 rounded-circle shadow-sm ms-auto" data-bs-dismiss="modal"></button>
    </div>

    <div class="modal-body p-0" style="overflow-y: auto; max-height: 85vh;">
        <div id="carouselDetail" class="carousel slide bg-light">
            <div class="carousel-inner">${images}</div>
            ${item.gambar.length > 1 ? `
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselDetail" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselDetail" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </button>
            ` : ""}
        </div>

        <div class="p-4">
            <h4 class="fw-bold mb-1" style="color: #004225;">${item.nama}</h4>
            <h5 class="fw-bold mb-3" style="color: #FF8C00;">Rp ${item.harga.toLocaleString()}</h5>
            <hr>

            <h6 class="fw-bold text-dark">Deskripsi:</h6>
            <p class="text-muted small mb-4">${item.deskripsi || "Tidak ada deskripsi tersedia."}</p>

            ${(item.items || item.items1) ? `
              <div class="mt-4 p-3 rounded" style="background-color: rgba(0, 66, 37, 0.05);">
                <h6 class="fw-bold text-dark">
                    <i class="bi bi-gear-wide-connected me-2"></i>Pilihan Menu:
                </h6>

                <form id="form-opsi-paket-${item.id}">
                  <ul class="list-unstyled mb-0">
                    ${renderList(item.items, 'opsi')}
                    ${renderList(item.items1, 'opsi1')}
                  </ul>
                </form>
              </div>` : ""
            }

            <div class="mt-5 mb-2">
                <button class="btn btn-cta-orange w-100 py-3 rounded-pill fw-bold shadow"
                        onclick="addToCart(event, ${item.id});">
                    TAMBAHKAN KE KERANJANG
                </button>
            </div>
        </div>
    </div>
  `;

  const myModal = new bootstrap.Modal(document.getElementById("detailMenuModal"));
  myModal.show();
}

// 6. FILTER & KATEGORI (MEMPERBAIKI BUG RESET)
function updateActiveButton(target) {
  document
    .querySelectorAll(".btn-cat")
    .forEach((btn) => btn.classList.remove("active"));
  if (target) {
    const parentBtn = target.closest(".dropdown")?.querySelector(".btn-cat");
    if (parentBtn) parentBtn.classList.add("active");
    else target.classList.add("active");
  }
}

function filterMenu(cat) {
  updateActiveButton(event.target);
  const filtered =
    cat === "Semua" ? menuData : menuData.filter((i) => i.kategori === cat);
  currentDisplayMenu = filtered; // Simpan filter ke state global
  renderMenu(filtered);
}

function filterSub(subCat) {
  updateActiveButton(event.target);
  const filtered = menuData.filter((i) => i.sub === subCat);
  currentDisplayMenu = filtered; // Simpan filter ke state global
  renderMenu(filtered);
}

// 7. CHECKOUT KE WHATSAPP
document.getElementById("checkout-form").onsubmit = (e) => {
  e.preventDefault();
  if (cart.length === 0) return alert("Keranjang masih kosong!");

  let text = `*PESANAN ISASAI R & V*\n\n`;

  cart.forEach((i) => {
    // Menambahkan detail pilihan jika ada (misal: ikan gabus kuah kuning)
    const detailPilihan = i.pilihan ? ` (${i.pilihan})` : "";

    text += `• ${i.nama}${detailPilihan} (${i.qty}x) = Rp ${(
      i.harga * i.qty
    ).toLocaleString()}\n`;
  });

  text += `\n*Total: ${document.getElementById("total-harga").innerText}*\n`;
  text += `\n*Data Pelanggan:*`;
  text += `\nNama: ${document.getElementById("nama").value}`;
  text += `\nWA: ${document.getElementById("whatsapp").value}`;
  text += `\nAlamat: ${document.getElementById("alamat").value || "-"}`;
  text += `\nMetode Pembayaran: ${document.getElementById("pembayaran").value}`;
  text += `\n\nTerima Kasih, Isasai ~ R & V`;

  window.open(
    `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`,
    "_blank",
  );

  // Bersihkan keranjang setelah checkout
  localStorage.removeItem("isasai_cart");
  cart = [];

  setTimeout(() => {
    alert("Pesanan terkirim!");
    window.location.reload();
  }, 500);
};

// Start
syncCart();
