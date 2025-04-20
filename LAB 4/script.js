const order = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    desert: null,
    totalPrice: 0,
};

// Selectors
function getSelectors() {
    return {
        dishesContainer: document.querySelectorAll(".dishes button"),
        noSelectionMessage: document.getElementById("no-selection-message"),
        orderSection: {
            soup: document.getElementById("order-soup"),
            main: document.getElementById("order-main"),
            salad: document.getElementById("order-salad"),
            drink: document.getElementById("order-drink"),
            desert: document.getElementById("order-desert"),
        },
        orderTotal: document.getElementById("order-total"),
        resetButton: document.querySelector('button[type="reset"]')
    };
}

// Update the order summary
function updateOrder(section, name, price) {
    const selectors = getSelectors();

    let orderElement = null;

    switch (section) {
        case "Выбрите суп":
            orderElement = selectors.orderSection.soup;
            order.soup = price;
            orderElement.textContent = `Суп: ${name} - ${price}₽`;
            break;
        case "Выбрите главное блюдо":
            orderElement = selectors.orderSection.main;
            order.main = price;
            orderElement.textContent = `Главное блюдо: ${name} - ${price}₽`;
            break;
        case "Выбрите салат или стартер":
            orderElement = selectors.orderSection.salad;
            order.salad = price;
            orderElement.textContent = `Салат: ${name} - ${price}₽`;
            break;
        case "Выбрите напиток":
            orderElement = selectors.orderSection.drink;
            order.drink = price;
            orderElement.textContent = `Напиток: ${name} - ${price}₽`;
            break;
        case "Выбрите десерт":
            orderElement = selectors.orderSection.desert;
            order.desert = price;
            orderElement.textContent = `Десерт: ${name} - ${price}₽`;
            break;
        default:
            break;
    }

    // Display the selected order element
    if (orderElement) {
        orderElement.style.display = "block";
    }

    calculateTotal();
}

// Calculate and display the total price
function calculateTotal() {
    const selectors = getSelectors();

    order.totalPrice = (order.soup || 0) + (order.main || 0) + (order.salad || 0) + (order.drink || 0) + (order.desert || 0);
    selectors.orderTotal.textContent = `Итого: ${order.totalPrice}₽`;
    selectors.orderTotal.style.display = order.totalPrice > 0 ? "block" : "none";

    // Show or hide "Nothing selected" message
    const hasSelection = order.soup || order.main || order.salad || order.drink || order.desert;
    selectors.noSelectionMessage.style.display = hasSelection ? "none" : "block";
}

// Reset the order when reset button is clicked
function resetOrder() {
    const selectors = getSelectors();

    order.soup = null;
    order.main = null;
    order.salad = null;
    order.drink = null;
    order.desert = null;
    order.totalPrice = 0;

    selectors.orderSection.soup.textContent = '';
    selectors.orderSection.main.textContent = '';
    selectors.orderSection.salad.textContent = '';
    selectors.orderSection.drink.textContent = '';
    selectors.orderSection.desert.textContent = '';
    selectors.orderTotal.textContent = '';
    selectors.orderTotal.style.display = "none";

    // Show "Nothing selected" message
    selectors.noSelectionMessage.style.display = "block";
}

// Event listener for selecting dishes
function setupDishesEventListeners() {
    const selectors = getSelectors();

    selectors.dishesContainer.forEach(button => {
        button.addEventListener("click", (e) => {
            const dishDetails = e.target.previousElementSibling;
            const dishPriceText = dishDetails.querySelector("p").textContent; // e.g., "Цена: 150₽"
            const dishPrice = parseFloat(dishPriceText.match(/\d+/)[0]); // Extract price as number
            const dishName = dishDetails.querySelectorAll("p")[1].textContent;
            const section = e.target.closest("section").querySelector("h2").textContent;

            updateOrder(section, dishName, dishPrice);
        });
    });
}

// Initialize the reset button event listener
function setupResetButtonListener() {
    const selectors = getSelectors();
    selectors.resetButton.addEventListener('click', resetOrder);
}

// Initialize all functions when DOM is loaded
function initialize() {
    setupDishesEventListeners();
    setupResetButtonListener();
}

document.addEventListener("DOMContentLoaded", initialize);
