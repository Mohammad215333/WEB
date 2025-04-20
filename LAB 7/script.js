let order = {
    soup: null,
    "main-course": null,
    salad: null,
    drink: null,
    dessert: null,
};

function addToOrder(meal) {
    order[meal.category] = meal;
    updateOrderDisplay();
}

function updateOrderDisplay() {
    const orderSummary = document.getElementById("order-summary");
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
        case "soup":
            return "Суп";
        case "main-course":
            return "Главное блюдо";
        case "drink":
            return "Напиток";
        case "salad":
            return "Салат или стартер";
        case "dessert":
            return "Десерт";
        default:
            return "";
    }
}

document.addEventListener("DOMContentLoaded", function () {
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
        } catch (error) {
            showNotification("Не удалось загрузить данные о блюдах. Попробуйте позже.");
        }
    }

    function initializeDisplay(meals) {
        function displayMeals(category, filter = "all") {
            categories[category].innerHTML = "";

            const filteredMeals = meals.filter(
                (meal) => meal.category === category && (filter === "all" || meal.kind === filter)
            );

            filteredMeals.sort((a, b) => a.name.localeCompare(b.name));

            filteredMeals.forEach((meal) => {
                const mealElement = document.createElement("div");
                mealElement.classList.add("dish");
                mealElement.setAttribute("data-kind", meal.kind);

                mealElement.innerHTML = `
                    <img src="${meal.image}" alt="${meal.name}">
                    <p class="price">${meal.price}₽</p>
                    <p class="name">${meal.name}</p>
                    <p class="weight">${meal.count}</p>
                    <button data-name="${meal.name}" data-price="${meal.price}">Добавить</button>
                `;

                mealElement.querySelector("button").addEventListener("click", () => addToOrder(meal));
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

document.querySelector('button[type="reset"]').addEventListener("click", () => {
    order = {
        soup: null,
        "main-course": null,
        salad: null,
        drink: null,
        dessert: null,
    };
    updateOrderDisplay();
});

function validateOrder() {
    const hasSoup = !!order.soup;
    const hasMainCourse = !!order["main-course"];
    const hasSalad = !!order.salad;
    const hasDrink = !!order.drink;
    const hasDessert = !!order.dessert;

    let notificationMessage = '';

    if (!hasSoup && !hasMainCourse && !hasSalad && !hasDrink && !hasDessert) {
        notificationMessage = "Ничего не выбрано. Выберите блюда для заказа";
    } else if (hasSoup && !hasMainCourse && !hasSalad) {
        notificationMessage = "Выберите главное блюдо/салат/стартер";
    } else if (hasSalad && !hasSoup && !hasMainCourse) {
        notificationMessage = "Выберите суп или главное блюдо";
    } else if ((hasSoup || hasMainCourse || hasSalad) && !hasDrink) {
        notificationMessage = "Выберите напиток";
    } else if ((hasDrink || hasDessert) && !hasMainCourse && !hasSalad && !hasSoup) {
        notificationMessage = "Выберите главное блюдо";
    } else {
        const isValidCombo = (
            (hasSoup && hasMainCourse && hasSalad && hasDrink) ||
            (hasSoup && hasMainCourse && hasDrink) ||
            (hasSoup && hasSalad && hasDrink) ||
            (hasMainCourse && hasSalad && hasDrink) ||
            (hasMainCourse && hasDrink)
        );

        if (!isValidCombo) {
            notificationMessage = "Выберите допустимые блюда для заказа.";
        }
    }

    if (notificationMessage) {
        showNotification(notificationMessage);
        return false;
    }

    return true;
}

function showNotification(message) {
    const notificationContainer = document.getElementById('notification');
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

document.querySelector('#order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateOrder()) {
        console.log('Order is valid. Proceeding with submission...');
        e.target.submit();
    }
});