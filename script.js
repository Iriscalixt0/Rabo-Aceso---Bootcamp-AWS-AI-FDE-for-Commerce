// Rabo Aceso — vitrine
// A vitrine não conhece produtos "de verdade": ela só sabe renderizar
// o que vem de products.json. Trocar o catálogo não exige tocar neste arquivo.

const CATEGORY_LABELS = {
  todos: "Todos",
  racao: "Ração & petiscos",
  brinquedos: "Brinquedos",
  higiene: "Higiene",
  acessorios: "Acessórios",
  camas: "Camas & conforto",
  saude: "Saúde",
};

const state = {
  products: [],
  category: "todos",
  query: "",
};

const grid = document.getElementById("grid");
const countEl = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const chipsWrap = document.getElementById("category-chips");

async function loadProducts() {
  try {
    const res = await fetch("products.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.products = await res.json();
    buildChips();
    render();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Não deu pra carregar o catálogo agora. (${err.message})</div>`;
  }
}

function buildChips() {
  const cats = ["todos", ...new Set(state.products.map((p) => p.category))];
  chipsWrap.innerHTML = cats
    .map(
      (c) => `
      <button class="chip" data-category="${c}" aria-pressed="${c === "todos"}">
        ${CATEGORY_LABELS[c] ?? c}
      </button>`
    )
    .join("");

  chipsWrap.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      chipsWrap
        .querySelectorAll(".chip")
        .forEach((b) => b.setAttribute("aria-pressed", b === btn));
      render();
    });
  });
}

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  return state.products.filter((p) => {
    const matchesCategory = state.category === "todos" || p.category === state.category;
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function render() {
  const items = filteredProducts();
  countEl.textContent = `${items.length} produto${items.length === 1 ? "" : "s"}`;

  if (items.length === 0) {
    grid.innerHTML = `<div class="empty-state">Nada encontrado. Tenta outra palavra ou categoria.</div>`;
    return;
  }

  grid.innerHTML = items
    .map(
      (p) => `
      <article class="card">
        <div class="card-top">
          <div class="card-icon" aria-hidden="true">${p.icon}</div>
          ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
        </div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="card-footer">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="add-btn" type="button">Adicionar</button>
        </div>
      </article>`
    )
    .join("");
}

searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});

loadProducts();
