const ORDER_KEY = 'foodConstructOrder';
let order = {
    soup: null,
    "main-course": null,
    salad: null,
    drink: null,
    dessert: null,
};

// Load order from localStorage
function loadOrderFromStorage() {
    const savedOrder = localStorage.getItem(ORDER_KEY);
    if (savedOrder) {
        try {
            const parsedOrder = JSON.parse(savedOrder);
            Object.assign(order, parsedOrder);
        } catch (e) {
            console.error('Failed to parse saved order', e);
        }
    }
}

// Save order to localStorage
function saveOrderToStorage() {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

// Clear order from storage
function clearOrderFromStorage() {
    localStorage.removeItem(ORDER_KEY);
}

// Update the order panel
function updateOrderPanel() {
    const orderPanel = document.getElementById('order-panel');
    const orderTotal = document.getElementById('order-total');
    const checkoutLink = document.getElementById('checkout-link');

    let total = 0;
    let hasItems = false;

    for (const item of Object.values(order)) {
        if (item) {
            total += item.price;
            hasItems = true;
        }
    }

    if (hasItems) {
        orderPanel.style.display = 'flex';
        orderTotal.textContent = `Сумма: ${total}₽`;
        checkoutLink.classList.toggle('disabled', !validateOrderCombo());
    } else {
        orderPanel.style.display = 'none';
    }
}

// Check if current order matches any valid combo
function validateOrderCombo() {
    const hasSoup = !!order.soup;
    const hasMain = !!order["main-course"];
    const hasSalad = !!order.salad;
    const hasDrink = !!order.drink;
    const hasDessert = !!order.dessert;

    return (
        (hasSoup && hasMain && hasSalad && hasDrink) ||
        (hasSoup && hasMain && hasDrink) ||
        (hasSoup && hasSalad && hasDrink) ||
        (hasMain && hasSalad && hasDrink) ||
        (hasMain && hasDrink)
    );
}

function addToOrder(meal) {
    order[meal.category] = meal;
    saveOrderToStorage();
    updateOrderDisplay();
    updateOrderPanel();
    highlightSelectedItems();
}

function updateOrderDisplay() {
    const orderSummary = document.getElementById("order-summary");
    if (!orderSummary) return;

    orderSummary.innerHTML = "";
    let totalCost = 0;
    let isOrderEmpty = true;

    for (const [category, meal] of Object.entries(order)) {
        const categoryTitle = document.createElement("b");
        categoryTitle.textContent = getCategoryTitle(category);
        orderSummary.appendChild(categoryTitle);

        const mealInfo = document.createElement("p");

        if (meal) {
            mealInfo.textContent = `${meal.name} - ${meal.price}₽`;
            totalCost += meal.price;
            isOrderEmpty = false;
        } else {
            mealInfo.textContent = "Ничего не выбрано";
        }

        mealInfo.style.display = "block";
        mealInfo.style.margin = "0 1.5rem";
        mealInfo.style.alignItems = "center";
        orderSummary.appendChild(mealInfo);
    }

    if (!isOrderEmpty) {
        const totalContainer = document.createElement("div");
        totalContainer.style.display = "block";
        totalContainer.style.margin = "1rem 0";
        totalContainer.style.alignItems = "center";

        const totalElement = document.createElement("b");
        totalElement.textContent = "Стоимость заказа:";
        totalElement.style.fontSize = "1.2rem";

        const totalCostElement = document.createElement("span");
        totalCostElement.textContent = `${totalCost}₽`;

        totalContainer.appendChild(totalElement);
        totalContainer.appendChild(totalCostElement);
        orderSummary.appendChild(totalContainer);
    } else {
        orderSummary.innerHTML = "<p>Ничего не выбрано</p>";
    }
}

function getCategoryTitle(category) {
    switch (category) {
        case "soup": return "Суп";
        case "main-course": return "Главное блюдо";
        case "drink": return "Напиток";
        case "salad": return "Салат или стартер";
        case "dessert": return "Десерт";
        default: return "";
    }
}

function highlightSelectedItems() {
    document.querySelectorAll('.dish').forEach(dish => {
        const name = dish.querySelector('.name').textContent;
        const category = dish.closest('section').id;
        
        if (order[category] && order[category].name === name) {
            dish.classList.add('selected');
        } else {
            dish.classList.remove('selected');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadOrderFromStorage();
    
    const categories = {
        soup: document.querySelector("#soup .menu-grid"),
        "main-course": document.querySelector("#main-course .menu-grid"),
        salad: document.querySelector("#salad .menu-grid"),
        drink: document.querySelector("#drink .menu-grid"),
        dessert: document.querySelector("#dessert .menu-grid"),
    };

    async function loadDishes() {
        try {
            const response = await fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes");
            const meals = await response.json();
            initializeDisplay(meals);
            highlightSelectedItems();
            updateOrderPanel();
        } catch (error) {
            showNotification("Не удалось загрузить данные о блюдах. Попробуйте позже.");
        }
    }

// ... (previous code remains the same until the initializeDisplay function)

function initializeDisplay(meals) {
    function displayMeals(category, filter = "all") {
        if (!categories[category]) return;
        
        categories[category].innerHTML = "";
        const filteredMeals = meals.filter(
            (meal) => meal.category === category && (filter === "all" || meal.kind === filter)
        );

        filteredMeals.sort((a, b) => a.name.localeCompare(b.name));

        filteredMeals.forEach((meal) => {
            const mealElement = document.createElement("div");
            mealElement.classList.add("dish");
            mealElement.setAttribute("data-kind", meal.kind);

            // Check if this meal is currently selected
            const isSelected = order[category] && order[category].id === meal.id;

            mealElement.innerHTML = `
                <img src="${meal.image}" alt="${meal.name}" onerror="this.src='images/default-food.jpg'">
                <p class="price">${meal.price}₽</p>
                <p class="name">${meal.name}</p>
                <p class="weight">${meal.count}</p>
                <button data-name="${meal.name}" data-price="${meal.price}">
                    ${isSelected ? '✓ Выбрано' : 'Выбрать'}
                </button>
            `;

            if (isSelected) {
                mealElement.classList.add('selected');
            }

            mealElement.querySelector("button").addEventListener("click", () => {
                if (isSelected) {
                    order[category] = null;
                    mealElement.classList.remove('selected');
                    mealElement.querySelector('button').textContent = 'Выбрать';
                } else {
                    addToOrder(meal);
                    // Update all buttons in this category
                    categories[category].querySelectorAll('.dish').forEach(dish => {
                        dish.classList.remove('selected');
                        dish.querySelector('button').textContent = 'Выбрать';
                    });
                    mealElement.classList.add('selected');
                    mealElement.querySelector('button').textContent = '✓ Выбрано';
                }
                saveOrderToStorage();
                updateOrderDisplay();
                updateOrderPanel();
            });
            
            categories[category].appendChild(mealElement);
        });
    }



        Object.keys(categories).forEach((category) => displayMeals(category));

        document.querySelectorAll(".filter-buttons button").forEach((button) => {
            button.addEventListener("click", function () {
                const categorySection = this.closest("section").id;
                const kind = this.getAttribute("data-kind");

                this.closest(".filter-buttons").querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
                this.classList.add("active");

                displayMeals(categorySection, kind);
            });
        });
    }

    loadDishes();
});

document.querySelector('button[type="reset"]')?.addEventListener("click", () => {
    order = {
        soup: null,
        "main-course": null,
        salad: null,
        drink: null,
        dessert: null,
    };
    saveOrderToStorage();
    updateOrderDisplay();
    updateOrderPanel();
    highlightSelectedItems();
});

function showNotification(message) {
    const notificationContainer = document.getElementById('notification');
    if (!notificationContainer) return;
    
    notificationContainer.textContent = message;
    notificationContainer.style.display = 'block';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = "Окей 👌";
    closeButton.style.margin = "10px auto";
    closeButton.style.display = "block";
    closeButton.style.backgroundColor = "var(--button-filter)";
    closeButton.style.color = "var(--white-color)";
    closeButton.style.border = "none";
    closeButton.style.padding = "10px 20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "2rem";

    closeButton.addEventListener('click', () => {
        notificationContainer.style.display = 'none';
        notificationContainer.textContent = "";
    });

    if (notificationContainer.querySelector('button')) {
        notificationContainer.querySelector('button').remove();
    }

    notificationContainer.appendChild(closeButton);
}