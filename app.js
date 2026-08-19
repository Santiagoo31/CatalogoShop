const WHATSAPP_NUMBER = '573142640913';

const categoryGrid = document.getElementById('category-grid');
const categoryView = document.getElementById('category-view');
const categoryTitle = document.getElementById('category-title');
const categoryCount = document.getElementById('category-count');
const backBtn = document.getElementById('back-btn');
const grid = document.getElementById('product-grid');

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalCategory = document.getElementById('modal-category');
const modalCategoryOverlay = document.getElementById('modal-category-overlay');
const modalDescription = document.getElementById('modal-description');
const modalOrder = document.getElementById('modal-order');

const products = window.PRODUCTS_DATA || [];

function categoryLabel(name) {
  if (name === 'Colonias-Hombre') return 'Colonias';
  return name.replace(/-/g, ' ');
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showHome() {
  document.body.removeAttribute('data-theme');
  categoryView.hidden = true;
  categoryGrid.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyTheme(genders) {
  if (genders.length > 1) document.body.setAttribute('data-theme', 'mixed');
  else if (genders[0] === 'Mujer') document.body.setAttribute('data-theme', 'pink');
  else if (genders[0] === 'Hombre') document.body.setAttribute('data-theme', 'blue');
  else document.body.removeAttribute('data-theme');
}

function renderCategories() {
  const cats = [...new Set(products.map(p => p.category))];
  categoryGrid.innerHTML = cats.map(c => {
    const catProducts = products.filter(p => p.category === c);
    const cover = catProducts[0];
    return `
      <article class="category-card" data-cat="${c}">
        <img src="${cover.image}" alt="${categoryLabel(c)}" loading="lazy">
        <div class="category-card-overlay"></div>
        <div class="category-card-info">
          <span class="category-card-badge">${catProducts.length} ${catProducts.length === 1 ? 'producto' : 'productos'}</span>
          <h3>${categoryLabel(c)}</h3>
          <span class="category-card-cta">Ver catálogo →</span>
        </div>
      </article>`;
  }).join('');

  categoryGrid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => openCategory(card.dataset.cat));
  });

  showHome();
}

function openCategory(cat) {
  const catProducts = products.filter(p => p.category === cat);
  categoryGrid.hidden = true;
  categoryView.hidden = false;

  categoryTitle.textContent = categoryLabel(cat);
  categoryCount.textContent = `${catProducts.length} ${catProducts.length === 1 ? 'producto' : 'productos'}`;

  const genders = [...new Set(catProducts.map(p => p.gender))];
  document.getElementById('category-genders').textContent =
    genders.length > 1 ? '👫 Hay de los 2 géneros' : `Solo ${genders[0]}`;
  applyTheme(genders);

  grid.innerHTML = catProducts.map(p => `
    <article class="card">
      <div class="card-image-wrap">
        ${p.category === 'Colonias-Hombre' ? '' : `<span class="card-category">${categoryLabel(p.category)}</span>`}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="card-description">${p.description}</p>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm" data-view="${p.id}">Ver</button>
          <a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"
             href="${waLink(`Hola! Me interesa este producto de tu tienda: ${p.name} (${categoryLabel(p.category)})`)}">
            Pedir
          </a>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = products.find(x => x.id === btn.dataset.view);
      if (p) openModal(p);
    });
  });

  setTimeout(() => scrollToProducts(), 60);
}

function scrollToProducts() {
  const el = document.getElementById('catalogo');
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo(0, Math.max(top, 0));
}

function openModal(p) {
  modalImage.src = p.image;
  modalImage.alt = p.name;
  modalName.textContent = p.name;
  modalCategory.textContent = categoryLabel(p.category);
  modalCategoryOverlay.textContent = categoryLabel(p.category);
  modalDescription.textContent = p.description;
  modalOrder.href = waLink(`Hola! Me interesa este producto de tu tienda: ${p.name} (${categoryLabel(p.category)})`);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

backBtn.addEventListener('click', renderCategories);

document.getElementById('stat-products').textContent = products.length;
renderCategories();