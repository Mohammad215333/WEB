async function loadDishes() {
    const apiURL = 'http://lab7-api.std-900.ist.mospolytech.ru/api/dishes'; 
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке данных: ${response.status}`);
        }

        const dishes = await response.json();

        // Функция для отображения блюд на странице
        renderDishes(dishes);
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Не удалось загрузить блюда. Пожалуйста, попробуйте позже.');
    }
}

// Функция для отрисовки блюд
function renderDishes(dishes) {
    // Разделяем блюда по категориям
    const categories = {
        soups: document.querySelector('#soups .dishes'),
        mainDishes: document.querySelector('#mainDishes .dishes'),
        salads: document.querySelector('#salads .dishes'),
        drinks: document.querySelector('#drinks .dishes'),
        desserts: document.querySelector('#desserts .dishes')
    };

    // Очищаем предыдущие данные
    Object.values(categories).forEach(container => container.innerHTML = '');

    // Заполняем блюда
    dishes.forEach(dish => {
        const dishContainer = document.createElement('div');
        dishContainer.classList.add('dish');
        dishContainer.dataset.kind = dish.kind;

        dishContainer.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <div class="name">${dish.name}</div>
            <div class="weight">${dish.count}</div>
            <div class="price">${dish.price}₽</div>
            <button>Добавить</button>
        `;

        // Добавляем в соответствующую категорию
        if (categories[dish.category]) {
            categories[dish.category].appendChild(dishContainer);
        }
    });

    // После загрузки блюд, заново добавляем обработчики событий
    setupDishesEventListeners();
}

// Инициализируем загрузку при старте
document.addEventListener('DOMContentLoaded', loadDishes);
