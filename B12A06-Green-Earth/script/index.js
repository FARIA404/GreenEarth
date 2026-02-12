const removeActive = () => {
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories));
};

const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  for (let category of categories) {
    let categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `           
            <button 
              onclick="loadTree(${category.id})"
              id="tree-btn-${category.id}"
              class="px-2.5 py-2 rounded category-btn w-full text-center lg:text-left hover:bg-[#b4dbc3] hover:text-[#4b504b] hover:font-semibold hover:px-5"
            >
              ${category.category_name}
            </button>`;
    categoryContainer.append(categoryDiv);
  }
};

const loadTree = async (id) => {
  manageSpinner(true);
  removeActive();
  const clickBtn = document.getElementById(`tree-btn-${id}`);
  clickBtn.classList.add("active");

  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayTree(data.plants);
};

const displayTree = (plants) => {
  const treeContainer = document.getElementById("tree-card-container");
  treeContainer.innerHTML = "";

  for (let tree of plants) {
    const treeDiv = document.createElement("div");
    const shortText = tree.description.slice(0, 65) + ".......";
    treeDiv.innerHTML = `            
            <div class="bg-white p-3 category rounded-xl shadow-sm">
              <img
                src="${tree.image}"
                alt=""
                class="w-full max-h-[11.675rem]  mb-3"
              />
              <div>
                <button onclick="loadTreeDetails(${tree.id})" class="font-inter text-lg font-semibold mb-2">
                  ${tree.name}
                </button>
                <h3 class="font-inter text-xs text-[#1F2937] mb-3">
                  ${shortText}
                </h3>
              </div>
              <div class="flex justify-between mb-3">
                <h2 class="py-1 px-3 text-[#15803D] bg-[#CFF0DC] rounded-2xl">
                 ${tree.category}
                </h2>
                <h2 class=" price font-inter text-lg font-semibold">৳${tree.price}</h2>
              </div>
              <div class="mb-4">
                <button
                  onclick="addToCart(${tree.id},'${tree.name}',${tree.price})"
                  class="btn bg-[#15803D] w-full rounded-3xl text-white hover:bg-[#54906a] hover:text-slate-900 add-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            `;
    treeContainer.append(treeDiv);
  }
  manageSpinner(false);
};

const loadTreeDetails = async (id) => {
  // manageSpinner(false);
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayTreeDetails(details.plants);
};

const displayTreeDetails = (tree) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `            
            <div class="bg-white p-3 category rounded-xl shadow-sm">
              <img
                src="${tree.image}"
                alt=""
                class="w-full max-h-[15rem]  mb-3"
              />
              <div>
                <button onclick="loadTreeDetails(${tree.id})" class="font-inter text-2xl font-semibold mb-2">
                  ${tree.name}
                </button>
                <h3 class="font-inter text-lg text-[#1F2937] mb-3">
                  ${tree.description}
                </h3>
              </div>
              <div class="flex justify-between mb-3">
                <h2 class="py-1 px-3 text-[#15803D] bg-[#CFF0DC] rounded-2xl">
                 ${tree.category}
                </h2>
                <h2 class="price font-inter text-xl font-semibold">৳${tree.price}</h2>
              </div>
              <div class="mb-4 flex justify-center">
                <button
                  onclick="addToCart(${tree.id},'${tree.name}',${tree.price})"
                  class="btn w-1/2  bg-[#15803D]  rounded-3xl text-white hover:bg-[#54906a] hover:text-slate-900 add-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            `;
  document.getElementById("tree-modal").showModal();
};

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("tree-card-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("tree-card-container").classList.remove("hidden");
  }
};

// tree button functionality
document.getElementById("all-trees-btn").addEventListener("click", () => {
  manageSpinner(true);
  removeActive();
  const clickBtn = document.getElementById("all-trees-btn");
  clickBtn.classList.add("active");

  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayTree(data.plants));
});

loadCategory();

// add to cart functionality

let total = 0;
const addToCart = (id, name, price) => {
  const totalTag = document.getElementById("total-count");
  const cart = document.getElementById("cart-container");

  const existingItem = document.getElementById(`cart-item-${id}`);

  if (existingItem) {
    const quantityTag = existingItem.querySelector(".quantity");
    const currentQuantity = parseInt(quantityTag.innerText);
    quantityTag.innerText = currentQuantity + 1;

    total += parseInt(price);
    totalTag.innerText = total;
    return;
  }

  const item = document.createElement("div");
  item.innerHTML = `<div id = "cart-item-${id}"
              class="cart-item-container flex justify-between gap-2.5 items-center bg-[#F0FDF4] px-3 py-2 mb-2"
            >
              <div>
                <h3 class="font-inter text-lg">${name}</h3>
                <h3 class="font-inter text-xl text-[#1F293780]">
                  ৳<span class="text-lg">${price} x <span class="quantity">1</span></span>
                </h3>
              </div>
              
                <i class="fa-solid fa-xmark cross-btn text-[#1F293780]"></i>
             
            </div>`;

  item.querySelector(".cross-btn").addEventListener("click", () => {
    const quantityTag = item.querySelector(".quantity");
    let currentQuantity = parseInt(quantityTag.innerText);

    if (currentQuantity > 1) {
      quantityTag.innerText = currentQuantity - 1;
      total -= parseInt(price);
    } else {
      total -= parseInt(price);
      item.innerText = "";
    }

    totalTag.innerText = total;
  });

  total += parseInt(price);
  totalTag.innerText = total;
  cart.append(item);
}