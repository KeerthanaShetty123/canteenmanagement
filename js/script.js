/* -----------------------
  Slider Auto Scroll
-------------------------- */
let sliderIndex = 0;
autoSlide();

function autoSlide() {
  const slides = document.querySelector(".slides");
  if (!slides) return;
  sliderIndex++;
  if (sliderIndex > 2) sliderIndex = 0;
  slides.style.marginLeft = `-${sliderIndex * 100}%`;
  setTimeout(autoSlide, 4000); // 4 sec per slide
}

/* -----------------------
  CART / LOCALSTORAGE HELPERS
-------------------------- */

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  // find or create a badge in header
  let badge = document.getElementById("cart-count-badge");
  if (!badge) {
    const nav = document.querySelector(".navbar");
    if (nav) {
      const a = document.createElement("a");
      a.href = "pages/cart.html";
      a.className = "cart-link";
      a.innerHTML = `Cart <span id="cart-count-badge" style="background:#fff;color:#ff7a00;padding:2px 8px;border-radius:12px;margin-left:6px;font-weight:700">${count}</span>`;
      nav.appendChild(a);
      return;
    }
  } else {
    badge.textContent = count;
  }
}

/* -----------------------
  ADD TO CART
-------------------------- */
/**
 * addToCart(name, price, imagePath)
 * imagePath should be relative to the page that calls it (e.g. 'images/food1.png' from index.html)
 */
function addToCart(name, price, imagePath) {
  const cart = getCart();

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      name,
      price: Number(price) || 0,
      quantity: 1,
      image: imagePath
    });
  }

  saveCart(cart);
  // feedback
  if (typeof Swal !== "undefined") {
    // if you use SweetAlert
    Swal.fire({ icon: "success", title: `${name} added to cart`, toast: true, timer: 1200 });
  } else {
    alert(`${name} added to cart`);
  }
}

/* -----------------------
  REMOVE ITEM
-------------------------- */
function removeFromCart(name) {
  let cart = getCart();
  cart = cart.filter(item => item.name !== name);
  saveCart(cart);
  // if on cart page, reload
  if (typeof loadCartItems === "function") loadCartItems();
}

/* -----------------------
  CHANGE QUANTITY
-------------------------- */
function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity = Math.max(0, (item.quantity || 1) + delta);
  if (item.quantity === 0) {
    // remove
    const idx = cart.findIndex(i => i.name === name);
    if (idx !== -1) cart.splice(idx, 1);
  }
  saveCart(cart);
  if (typeof loadCartItems === "function") loadCartItems();
}

/* -----------------------
  LOAD CART ITEMS (for cart.html)
-------------------------- */
function formatPrice(p) {
  return `₹${Number(p).toFixed(2)}`;
}

function loadCartItems() {
  const container = document.getElementById("cartContainer");
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:30px;"><h3>Your cart is empty</h3></div>`;
    updateCartCount();
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach(item => {
    const subtotal = (item.price || 0) * (item.quantity || 1);
    total += subtotal;

    // image path: if stored as 'images/food1.png' and cart.html is in pages/, image should be ../images/food1.png
    let imgPath = item.image;
    // if current page is in pages/ we may need to prepend ../
    if (location.pathname.includes("/pages/") && !imgPath.startsWith("../")) {
      imgPath = "../" + imgPath;
    }

    html += `
      <div class="card" style="display:flex;flex-direction:column;align-items:center">
        <img src="${imgPath}" alt="${item.name}" style="width:100%;max-width:240px;height:140px;object-fit:cover;border-radius:8px">
        <h3 style="margin-top:10px">${item.name}</h3>
        <p>Price: ${formatPrice(item.price)}</p>
        <p>Quantity:
          <button class="btn small" onclick="changeQty('${item.name}', -1)">-</button>
          <span style="padding:0 8px;font-weight:700">${item.quantity}</span>
          <button class="btn small" onclick="changeQty('${item.name}', 1)">+</button>
        </p>
        <p>Subtotal: ${formatPrice(subtotal)}</p>
        <p><button class="btn" onclick="removeFromCart('${item.name}')">Remove</button></p>
      </div>
    `;
  });

  html += `
    <div style="grid-column:1/-1;text-align:center;margin-top:10px">
      <h3>Total: ${formatPrice(total)}</h3>
      <a href="checkout.html" class="btn">Proceed to Checkout</a>
    </div>
  `;

  container.innerHTML = html;
  updateCartCount();
}

/* -----------------------
 initialize cart count on load
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
