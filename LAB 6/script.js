const order = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null,
    totalPrice: 0,
};

function getSelectors() {
    return {
        dishesContainer: document.querySelectorAll(".dishes button"),
        noSelectionMessage: document.getElementById("no-selection-message"),
        orderSection: {
            soup: document.getElementById("order-soup"),
            main: document.getElementById("order-main"),
            salad: document.getElementById("order-salad"),
            drink: document.getElementById("order-drink"),
            dessert: document.getElementById("order-desert"),
        },
        orderTotal: document.getElementById("order-total"),
        resetButton: document.querySelector('button[type="reset"]')
    };
}

function updateOrder(section, name, price) {
    const selectors = getSelectors();
    let orderElement = null;

    switch (section) {
        case "Выберите суп":
            orderElement = selectors.orderSection.soup;
            order.soup = price;
            orderElement.textContent = name ? `Суп: ${name} - ${price}₽` : "Суп не выбрано";
            break;
        case "Выберите главное блюдо":
            orderElement = selectors.orderSection.main;
            order.main = price;
            orderElement.textContent = name ? `Главное блюдо: ${name} - ${price}₽` : "Главное блюдо не выбрано";
            break;
        case "Выберите салат или стартер":
            orderElement = selectors.orderSection.salad;
            order.salad = price;
            orderElement.textContent = name ? `Салат: ${name} - ${price}₽` : "Салат не выбрано";
            break;
        case "Выберите напиток":
            orderElement = selectors.orderSection.drink;
            order.drink = price;
            orderElement.textContent = name ? `Напиток: ${name} - ${price}₽` : "Напиток не выбрано";
            break;
        case "Выберите десерт":
            orderElement = selectors.orderSection.dessert;
            order.dessert = price;
            orderElement.textContent = name ? `Десерт: ${name} - ${price}₽` : "Десерт не выбрано";
            break;
        default:
            break;
    }

    calculateTotal();
}

function calculateTotal() {
    const selectors = getSelectors();

    order.totalPrice = (order.soup || 0) + (order.main || 0) + (order.salad || 0) + (order.drink || 0) + (order.dessert || 0);
    selectors.orderTotal.textContent = `Итого: ${order.totalPrice}₽`;
    selectors.orderTotal.style.display = order.totalPrice > 0 ? "block" : "none";

    const hasSelection = order.soup || order.main || order.salad || order.drink || order.dessert;
    selectors.noSelectionMessage.style.display = hasSelection ? "none" : "block";
    document.getElementById("order-section").style.display = hasSelection ? "block" : "none";
}

function resetOrder() {
    const selectors = getSelectors();
    order.soup = order.main = order.salad = order.drink = order.dessert = null;
    order.totalPrice = 0;

    for (const section in selectors.orderSection) {
        selectors.orderSection[section].textContent = `${section === "soup" ? "Суп" : section === "main" ? "Главное блюдо" : section === "salad" ? "Салат" : section === "drink" ? "Напиток" : "Десерт"} не выбрано`;
    }

    selectors.orderTotal.textContent = "";
    selectors.orderTotal.style.display = "none";
    selectors.noSelectionMessage.style.display = "block";
    document.getElementById("order-section").style.display = "none";
}

function setupDishesEventListeners() {
    const selectors = getSelectors();

    selectors.dishesContainer.forEach(button => {
        button.addEventListener("click", (e) => {
            const dishDetails = e.target.previousElementSibling;
            const dishPriceText = dishDetails.querySelector(".price").textContent;
            const dishPrice = parseFloat(dishPriceText.match(/\d+/)[0]);
            const dishName = dishDetails.querySelector(".name").textContent;
            const section = e.target.closest("section").querySelector("h2").textContent;

            updateOrder(section, dishName, dishPrice);
        });
    });
}

function setupFilterButtons() {
    document.querySelectorAll('.filters button').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.closest('section').id;
            const kind = e.target.dataset.kind;
            filterDishes(category, kind, e.target);
        });
    });
}

function filterDishes(category, kind, button) {
    const section = document.getElementById(category);
    const dishes = section.querySelectorAll('.dishes div');
    
    button.classList.toggle('active');
    const isActive = button.classList.contains('active');
    
    if (!isActive) {
        dishes.forEach(dish => dish.style.display = 'block');
        return;
    }

    dishes.forEach(dish => {
        dish.style.display = dish.dataset.kind === kind ? 'block' : 'none';
    });

    button.parentNode.querySelectorAll('button').forEach(btn => {
        if (btn !== button) btn.classList.remove('active');
    });
}

function setupResetButtonListener() {
    const selectors = getSelectors();
    selectors.resetButton.addEventListener('click', resetOrder);
}

function validateOrder() {
    const hasSoup = !!order.soup;
    const hasMainDish = !!order.main;
    const hasSalad = !!order.salad;
    const hasDrink = !!order.drink;
    const hasDessert = !!order.dessert;

    let notificationMessage = '';


    if (!hasSoup && !hasMainDish && !hasSalad && !hasDrink && !hasDessert) {
        notificationMessage = "Ничего не выбрано. Выберите блюда для заказа";
    }
    else if ((hasSoup || hasMainDish || hasSalad) && !hasDrink) {
        notificationMessage = "Выберите напиток";
    }
    else if (hasSoup && !hasMainDish && !hasSalad) {
        notificationMessage = "Выберите главное блюдо/салат/стартер";
    }
    else if (hasSalad && !hasSoup && !hasMainDish) {
        notificationMessage = "Выберите суп или главное блюдо";
    }
    else if ((hasDrink || hasDessert) && !hasMainDish && !hasSalad && !hasSoup) {
        notificationMessage = "Выберите главное блюдо";
    }
    else {
        const isValidCombo = (
            (hasSoup && hasMainDish && hasSalad && hasDrink) ||
            (hasSoup && hasMainDish && hasDrink) ||
            (hasSoup && hasSalad && hasDrink) ||
            (hasMainDish && hasSalad && hasDrink) ||
            (hasMainDish && hasDrink)
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
    closeButton.style.display = "block";

    closeButton.addEventListener('click', () => {
        notificationContainer.style.display = 'none';
        notificationContainer.textContent = "";
    });

    if (notificationContainer.querySelector('button')) {
        notificationContainer.querySelector('button').remove();
    }

    notificationContainer.appendChild(closeButton);
}

document.querySelector('#form-dilevery').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateOrder()) {
        console.log('Order is valid. Proceeding with submission...');
        e.target.submit();
    }
});


function initialize() {
    setupDishesEventListeners();
    setupResetButtonListener();
    setupFilterButtons();
}

document.addEventListener("DOMContentLoaded", initialize);
