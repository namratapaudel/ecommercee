const products = [
  {
    id: 1,
    name: "T-shirt",
    price: 1500,
    image: "images/tshirt.jpg",
  },
  {
    id: 2,
    name: "Shoes",
    price: 3500,
    image: "images/shoes.jpg",
  },
  {
    id: 3,
    name: "Watch",
    price: 5000,
    image: "images/watch.jpg",
  },
  {
    id: 4,
    name: "Pants",
    price: 2000,
    image: "images/pants.jpg",
  },
  {
    id: 5,
    name: "Dress",
    price: 4500,
    image: "images/dress.jpg",
  },
  {
    id: 6,
    name: "Jacket",
    price: 6000,
    image: "images/jacket.jpg",
  },
  {
    id: 7,
    name: "Slippers",
    price: 1200,
    image: "images/slippers.jpg",
  },
  {
    id: 8,
    name: "Top",
    price: 1100,
    image: "images/top.jpg",
  },
  {
    id: 9,
    name: "Sandal",
    price: 1700,
    image: "images/sandal.jpg",
  },
  {
    id: 10,
    name: "Accessories",
    price: 1200,
    image: "images/accessories.jpg",
  },
];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");

// --- Enhanced Cart System with eSewa Integration ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartModal;
let cartItemsList;
let cartTotalPriceElement;
let checkoutBtn;
let cartCountElement;

function updateCartCount() {
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showToast(`${product.name} added to cart!`);
    console.log("Product added to cart:", product);
    console.log("Current cart:", cart);
  } else {
    console.error("Product not found with id:", id);
    showToast("Error: Product not found!", "error");
  }
}

function removeFromCart(id) {
  const itemToRemove = cart.find((item) => item.id === id);
  if (itemToRemove) {
    showToast(`${itemToRemove.name} removed from cart.`, "error");
  }
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCartModal();
  console.log("Product removed from cart. Current cart:", cart);
}

function updateCartModal() {
  if (!cartItemsList) {
    console.error("Cart items list element not found!");
    return;
  }

  cartItemsList.innerHTML = "";
  const totalPrice = getCartTotal();

  console.log("Updating cart modal. Cart items:", cart);

  if (cart.length === 0) {
    cartItemsList.innerHTML =
      '<li class="list-group-item text-center text-muted fst-italic py-4"><i class="fas fa-shopping-cart fa-2x mb-3 text-muted"></i><p class="mb-0">Your cart is empty.</p></li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
          <div class="me-auto">
            <div class="fw-semibold">${item.name}</div>
            <small class="text-muted">Rs. ${item.price.toFixed(2)}</small>
          </div>
          <span class="fw-bold me-3">Rs. ${item.price.toFixed(2)}</span>
          <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-id="${
            item.id
          }">
              <i class="fas fa-trash-alt"></i>
          </button>`;
      cartItemsList.appendChild(li);
    });
  }

  if (cartTotalPriceElement) {
    cartTotalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)}`;
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price, 0);
}

// --- Product Display with Buy Now Button ---
function displayProducts(filteredProducts) {
  productList.innerHTML = "";

  if (filteredProducts.length === 0) {
    productList.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No products found</h4>
        <p class="text-muted">Try adjusting your search terms</p>
      </div>
    `;
    return;
  }

  const row = document.createElement("div");
  row.className = "row g-4";

  filteredProducts.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-4 col-sm-6";

    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 product-card">
        <div class="position-relative">
          <img src="${product.image}" class="card-img-top" alt="${
      product.name
    }" style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">New</span>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold">${highlightSearch(product.name)}</h5>
          <p class="card-text text-muted small">High quality product with premium features</p>
          <div class="mt-auto">
            <div class="d-flex align-items-center mb-3">
              <span class="fs-4 fw-bold text-primary">Rs. ${
                product.price
              }</span>
              <span class="badge bg-success ms-2">In Stock</span>
            </div>
            <div class="d-grid gap-2">
              <button onclick="addToCart(${
                product.id
              })" class="btn btn-outline-primary">
                <i class="fas fa-cart-plus me-2"></i>Add to Cart
              </button>
              <button onclick="buyNow(${product.id}, ${
      product.price
    })" class="btn btn-primary">
                <i class="fas fa-bolt me-2"></i>Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  productList.appendChild(row);
}

function highlightSearch(name) {
  const searchTerm = searchInput.value.toLowerCase();
  if (!searchTerm) return name;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return name.replace(regex, `<mark>$1</mark>`);
}

// --- eSewa Payment Integration ---
function buyNow(productId, price) {
  showConfirmationModal(price, productId);
}

function showConfirmationModal(price, productId) {
  const vat = price * 0.13;
  const deliveryCharge = 100;
  const total = price + vat + deliveryCharge;

  const modalHTML = `
<div id="confirmationModal" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0, 0, 0, 0.6);" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content rounded-4 shadow-lg border-0 overflow-hidden">
      <!-- Header with gradient -->
      <div class="modal-header bg-gradient-primary text-white border-0 py-4">
        <div class="d-flex align-items-center">
          <div class="bg-white bg-opacity-20 rounded-circle p-3 me-3">
            <i class="fas fa-credit-card fa-2x"></i>
          </div>
          <div>
            <h5 class="modal-title fw-bold mb-1">Payment Confirmation</h5>
            <p class="mb-0 opacity-75">Complete your purchase securely</p>
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white" id="cancelModalBtn" aria-label="Close"></button>
      </div>
      
      <!-- Body -->
      <div class="modal-body p-0">
        <!-- Payment Summary -->
        <div class="p-4 bg-light">
          <div class="row">
            <div class="col-md-8">
              <h6 class="fw-bold text-primary mb-3">
                <i class="fas fa-receipt me-2"></i>Order Summary
              </h6>
              <div class="card border-0 bg-white shadow-sm">
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">Subtotal</span>
                    <span class="fw-bold">Rs. ${price.toFixed(2)}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">VAT (13%)</span>
                    <span class="fw-bold">Rs. ${vat.toFixed(2)}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">Delivery Charge</span>
                    <span class="fw-bold">Rs. ${deliveryCharge.toFixed(
                      2
                    )}</span>
                  </div>
                  <hr class="my-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-5 fw-bold text-primary">Total Amount</span>
                    <span class="fs-4 fw-bold text-success">Rs. ${total.toFixed(
                      2
                    )}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Payment Methods -->
            <div class="col-md-4">
              <h6 class="fw-bold text-primary mb-3">
                <i class="fas fa-shield-alt me-2"></i>Secure Payment
              </h6>
              <div class="card border-0 bg-white shadow-sm">
                <div class="card-body p-4 text-center">
                  <div class="mb-3">
                    <img src="https://esewa.com.np/images/esewa-logo.png" alt="eSewa" style="height: 40px; width: auto;">
                  </div>
                  <p class="text-muted small mb-3">Pay securely with eSewa</p>
                  <div class="d-flex justify-content-center gap-2 mb-3">
                    <i class="fas fa-lock text-success"></i>
                    <i class="fas fa-shield-alt text-success"></i>
                    <i class="fas fa-check-circle text-success"></i>
                  </div>
                  <div class="badge bg-success-subtle text-success">
                    <i class="fas fa-check me-1"></i>100% Secure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Features -->
        <div class="p-4 bg-white">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="d-flex align-items-center">
                <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <i class="fas fa-truck text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Free Delivery</h6>
                  <p class="text-muted small mb-0">Fast & reliable shipping</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center">
                <div class="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                  <i class="fas fa-undo text-success"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Easy Returns</h6>
                  <p class="text-muted small mb-0">30-day return policy</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center">
                <div class="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                  <i class="fas fa-headset text-warning"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">24/7 Support</h6>
                  <p class="text-muted small mb-0">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer border-0 bg-light d-flex justify-content-between px-4 py-3">
        <button type="button" id="cancelModalBtn2" class="btn btn-outline-secondary px-4">
          <i class="fas fa-times me-2"></i>Cancel
        </button>
        <button type="button" id="confirmPaymentBtn" class="btn btn-primary px-4 py-2">
          <i class="fas fa-credit-card me-2"></i>Proceed to Payment
        </button>
      </div>
    </div>
  </div>
</div>`;

  const tempModal = document.createElement("div");
  tempModal.innerHTML = modalHTML;
  document.body.appendChild(tempModal);
  document.body.style.overflow = "hidden";

  tempModal
    .querySelector("#confirmPaymentBtn")
    .addEventListener("click", () => {
      document.body.removeChild(tempModal);
      document.body.style.overflow = "";
      initiateEsewaPayment(price, productId);
    });

  const cancelBtns = tempModal.querySelectorAll(
    "#cancelModalBtn, #cancelModalBtn2"
  );
  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.removeChild(tempModal);
      document.body.style.overflow = "";
    });
  });
}

function initiateEsewaPayment(price, productId) {
  const amount = parseFloat(price).toFixed(2);
  const tax = (amount * 0.13).toFixed(2);
  const delivery = 100.0;
  const serviceCharge = 0.0;
  const total = (parseFloat(amount) + parseFloat(tax) + delivery).toFixed(2);

  const esewaConfig = {
    amount: amount,
    tax_amount: tax,
    product_service_charge: serviceCharge.toFixed(2),
    product_delivery_charge: delivery.toFixed(2),
    product_code: "EPAYTEST",
    success_url: "https://developer.esewa.com.np/success",
    failure_url: "https://developer.esewa.com.np/failure",
    secret_key: "8gBm/:&EnhH.1/q",
    total_amount: total,
  };

  const transaction_uuid = `namrata-${Date.now()}-${productId}`;
  const signature = createEsewaSignature(esewaConfig, transaction_uuid);

  document.getElementById("amount").value = esewaConfig.amount;
  document.getElementById("tax_amount").value = esewaConfig.tax_amount;
  document.getElementById("total_amount").value = esewaConfig.total_amount;
  document.getElementById("transaction_uuid").value = transaction_uuid;
  document.getElementById("product_code").value = esewaConfig.product_code;
  document.getElementById("product_service_charge").value =
    esewaConfig.product_service_charge;
  document.getElementById("product_delivery_charge").value =
    esewaConfig.product_delivery_charge;
  document.getElementById("success_url").value = esewaConfig.success_url;
  document.getElementById("failure_url").value = esewaConfig.failure_url;
  document.getElementById("signature").value = signature;

  document.getElementById("esewa-payment-form").submit();
}

function createEsewaSignature(config, uuid) {
  const message = `total_amount=${config.total_amount},transaction_uuid=${uuid},product_code=${config.product_code}`;
  const hash = CryptoJS.HmacSHA256(message, config.secret_key);
  return CryptoJS.enc.Base64.stringify(hash);
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type === "error" ? "is-error" : ""}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing cart system...");

  try {
    // Initialize cart elements
    cartItemsList = document.getElementById("cart-items-list");
    cartTotalPriceElement = document.getElementById("cart-total-price");
    checkoutBtn = document.getElementById("checkout-btn");
    cartCountElement = document.getElementById("cart-count");

    // Initialize Bootstrap modal
    const cartModalElement = document.getElementById("cartModal");
    if (cartModalElement && typeof bootstrap !== "undefined") {
      cartModal = new bootstrap.Modal(cartModalElement);
    }

    // Initialize cart from localStorage
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart loaded from localStorage:", cart);

    // Display products
    displayProducts(products);

    // Update cart UI
    updateCartCount();
    updateCartModal();

    // Cart modal event listeners
    if (cartItemsList) {
      cartItemsList.addEventListener("click", (event) => {
        if (
          event.target.classList.contains("remove-from-cart-btn") ||
          event.target.closest(".remove-from-cart-btn")
        ) {
          const button = event.target.classList.contains("remove-from-cart-btn")
            ? event.target
            : event.target.closest(".remove-from-cart-btn");
          const id = parseInt(button.dataset.id);
          console.log("Removing item with id:", id);
          removeFromCart(id);
        }
      });
    } else {
      console.error("Cart items list not found!");
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          showToast("Your cart is empty!", "error");
          return;
        }

        const totalCartPrice = getCartTotal();
        const transactionId = "CART-CHECKOUT-" + Date.now();
        showConfirmationModal(totalCartPrice, transactionId);
      });
    } else {
      console.error("Checkout button not found!");
    }

    console.log("Cart system initialized successfully!");
  } catch (error) {
    console.error("Error initializing cart system:", error);
  }
});

// Global error handler
window.addEventListener("error", function (e) {
  console.error("Global error:", e.error);
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
});

// --- Live Search ---
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );
  displayProducts(filtered);
});
