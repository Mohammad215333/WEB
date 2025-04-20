function loadDishesFromData() {
    Object.keys(menuData).forEach(section => {
        const sectionElement = document.getElementById(section);
        const dishesContainer = sectionElement.querySelector('.dishes');

        dishesContainer.innerHTML = '';

        menuData[section].forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.classList.add('dish');
            dishElement.setAttribute('data-kind', dish.kind); // Add data-kind attribute

            dishElement.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <span class="dish-details">
                    <p class="price">${dish.price}₽</p>
                    <p class="name">${dish.name}</p>
                    <p class="weight">${dish.weight}</p>
                </span>
                <button>добавить</button>
            `;
            dishesContainer.appendChild(dishElement);
        });
    });
}

document.addEventListener("DOMContentLoaded", loadDishesFromData);
