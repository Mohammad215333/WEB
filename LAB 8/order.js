const ORDER_KEY = 'foodConstructOrder';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
const API_KEY = 'd7066d49-9e1b-49f6-bac7-83e807c7c47d';

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
            // Only keep properties that exist in our order object
            Object.keys(order).forEach(key => {
                if (parsedOrder[key]) {
                    order[key] = parsedOrder[key];
                }
            });
        } catch (e) {
            console.error('Failed to parse saved order', e);
        }
    }
}

// Remove item from order
function removeFromOrder(category) {
    if (order[category]) {
        order[category] = null;
        saveOrderToStorage();
        renderOrderItems();
    }
}

// Save order to localStorage
function saveOrderToStorage() {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

// Render order items
async function renderOrderItems() {
    const container = document.getElementById('order-items-container');
    container.innerHTML = '<div class="order-loading">Загрузка вашего заказа...</div>';

    try {
        // First load all dishes from the server
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dishes');
        }
        const allDishes = await response.json();

        // Prepare container for order items
        container.innerHTML = '';
        let hasItems = false;
        let total = 0;

        // Create a map for quick dish lookup by ID
        const dishesMap = {};
        allDishes.forEach(dish => {
            dishesMap[dish.id] = dish;
        });

        // Render each item in the order
        for (const [category, item] of Object.entries(order)) {
            if (item && item.id && dishesMap[item.id]) {
                hasItems = true;
                const dish = dishesMap[item.id];
                total += dish.price;

                const itemElement = document.createElement('div');
                itemElement.className = 'order-item';
                itemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/default-food.jpg'">
                    </div>
                    <div class="item-details">
                        <h3>${getCategoryTitle(category)}</h3>
                        <p>${dish.name}</p>
                        <p>${dish.price}₽</p>
                    </div>
                    <button class="remove-btn" data-category="${category}">Удалить</button>
                `;
                container.appendChild(itemElement);
            }
        }

        if (hasItems) {
            // Add total price
            const totalElement = document.createElement('div');
            totalElement.className = 'order-total';
            totalElement.innerHTML = `
                <h3>Итого:</h3>
                <p>${total}₽</p>
            `;
            container.appendChild(totalElement);

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    removeFromOrder(btn.dataset.category);
                });
            });
        } else {
            // Show empty order message
            container.innerHTML = `
                <p class="empty-order">
                    Ничего не выбрано. Чтобы добавить блюда в заказ, 
                    <a href="lunch_menu.html">перейдите на страницу "Собрать ланч"</a>.
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading order:', error);
        container.innerHTML = `
            <p class="error-message">
                Не удалось загрузить информацию о блюдах. Пожалуйста, попробуйте позже.
            </p>
        `;
    }
}

function getCategoryTitle(category) {
    const titles = {
        "soup": "Суп",
        "main-course": "Главное блюдо",
        "salad": "Салат или стартер",
        "drink": "Напиток",
        "dessert": "Десерт"
    };
    return titles[category] || "";
}

// Submit order to server
async function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Prepare order data
    const orderData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        subscribe: formData.get('subscribe') ? 1 : 0,
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: formData.get('delivery_type'),
        comment: formData.get('comment'),
        soup_id: order.soup?.id || null,
        main_course_id: order["main-course"]?.id || null,
        salad_id: order.salad?.id || null,
        drink_id: order.drink?.id || null,
        dessert_id: order.dessert?.id || null
    };

    // Add delivery time if needed
    if (orderData.delivery_type === 'by_time') {
        orderData.delivery_time = formData.get('delivery_time');
    }

    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при отправке заказа');
        }

        const result = await response.json();
        console.log('Order submitted:', result);
        
        // Clear order and redirect on success
        clearOrderFromStorage();
        window.location.href = 'index.html?orderSuccess=true';
    } catch (error) {
        console.error('Error submitting order:', error);
        alert(`Ошибка при оформлении заказа: ${error.message}`);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load saved order
    loadOrderFromStorage();
    
    // Render order items
    renderOrderItems();

    // Setup delivery time toggle
    const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const deliveryTimeGroup = document.getElementById('delivery-time-group');
    
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            deliveryTimeGroup.style.display = 
                radio.value === 'by_time' ? 'block' : 'none';
        });
    });

    // Setup form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }
});