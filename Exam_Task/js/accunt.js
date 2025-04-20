const apiUrl = "http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9"; // URL API для получения заказов
let currentPage = 1; // Текущая страница
const ordersPerPage = 5; // Количество заказов на странице

// Функция для загрузки заказов с учетом пагинации
async function loadOrders(page = 1) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }

        const orders = await response.json();

        // Рассчитываем общее количество страниц
        const totalPages = Math.ceil(orders.length / ordersPerPage);

        // Вычисляем заказы для текущей страницы
        const startIndex = (page - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const paginatedOrders = orders.slice(startIndex, endIndex);

        // Обновляем таблицу и пагинацию
        displayOrders(paginatedOrders);
        displayPagination(page, totalPages);
    } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
    }
}


// Функция для получения названия курса по его ID
async function fetchCourseName(courseId) {
    // Если ID курса равен 7, возвращаем фиксированное название
    if (courseId === 7) {
        return "Занятие с репетитором";
    }

    const apiUrl = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const course = await response.json();
        return course.name; // Предполагается, что название курса возвращается в поле "name"
    } catch (error) {
        console.error(`Ошибка при загрузке названия курса с ID ${courseId}:`, error);
        return "Неизвестный курс"; // Возвращаем значение по умолчанию в случае ошибки
    }
}


// Функция для отображения заказов в таблице
async function displayOrders(orders) {
    const tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = ""; // Очищаем таблицу

    for (const order of orders) {
        // Получаем название курса по его ID
        const courseName = await fetchCourseName(order.courseId);

        // Создаём строку таблицы
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${courseName}</td>
            <td>${order.date_start}</td>
            <td>${order.price} руб.</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="showDetails(${order.id})">Подробнее</button>
                <button class="btn btn-warning btn-sm" onclick="editOrder(${order.id})">Изменить</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDelete(${order.id})">Удалить</button>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Функция для отображения кнопок пагинации
function displayPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Очищаем контейнер пагинации

    // Кнопка "Предыдущая"
    const prevButton = document.createElement("li");
    prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Предыдущая</a>`;
    paginationContainer.appendChild(prevButton);

    // Кнопки для всех страниц
    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("li");
        pageButton.className = `page-item ${page === currentPage ? "active" : ""}`;
        pageButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${page})">${page}</a>`;
        paginationContainer.appendChild(pageButton);
    }

    // Кнопка "Следующая"
    const nextButton = document.createElement("li");
    nextButton.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Следующая</a>`;
    paginationContainer.appendChild(nextButton);
}


// Функция для смены страницы
function changePage(page) {
    currentPage = page;
    loadOrders(page); // Загружаем заказы для новой страницы
}
// Функция для отображения деталей заказа
async function showDetails(orderId) {
    const apiUrl = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderId}?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9`;

    try {
        // Отправляем GET-запрос для получения деталей заказа
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        // Получаем данные заказа в формате JSON
        const order = await response.json();

        const modalBody = document.querySelector("#detailsModal .modal-body");
        modalBody.innerHTML = `
            <p><strong>ID заказа:</strong> ${order.id}</p>
            <p><strong>Название курса:</strong> ${order.courseName}</p>
            <p><strong>Дата начала:</strong> ${order.date_start}</p>
            <p><strong>Стоимость:</strong> ${order.price} руб.</p>
            <p><strong>Количество участников:</strong> ${order.persons}</p>
            <p><strong>Дополнительные опции:</strong></p>
            <ul>
                <li><strong>Ранняя регистрация:</strong> ${order.earlyRegistration ? "Да" : "Нет"}</li>
                <li><strong>Групповое обучение:</strong> ${order.groupEnrollment ? "Да" : "Нет"}</li>
            </ul>
        `;

        // Показываем модальное окно
        const detailsModal = new bootstrap.Modal(document.getElementById("detailsModal"));
        detailsModal.show();
    } catch (error) {
        console.error("Ошибка при загрузке деталей заказа:", error);
        alert("Не удалось загрузить детали заказа. Попробуйте позже.");
    }
}


let orderIdToEdit = null; // Хранит ID заказа, который нужно редактировать

// Функция для открытия модального окна редактирования
async function editOrder(orderId) {
    orderIdToEdit = orderId; // Сохраняем ID заказа

    try {
        // Получаем данные заказа с сервера
        const response = await fetch(`http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderId}?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9`);
        if (!response.ok) {
            throw new Error(`Ошибка получения данных заказа: ${response.status}`);
        }

        const order = await response.json();

        // Заполняем поля модального окна данными заказа
        document.getElementById("editCourseName").value = order.courseName;
        document.getElementById("editDateStart").value = order.date_start;
        document.getElementById("editTimeStart").value = order.time_start;
        document.getElementById("editDuration").value = order.duration;
        document.getElementById("editPersons").value = order.persons;
        document.getElementById("editPrice").value = order.price;

        // Показываем модальное окно
        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    } catch (error) {
        console.error("Ошибка при загрузке данных для редактирования:", error);
        alert("Не удалось загрузить данные заказа. Попробуйте снова.");
    }
}

// Функция для сохранения изменений
async function saveOrderChanges(event) {
    event.preventDefault(); // Предотвращаем отправку формы

    if (!orderIdToEdit) return;

    try {
        // Собираем данные из формы
        const updatedData = {};
        updatedData.date_start = document.getElementById("editDateStart").value;
        updatedData.time_start = document.getElementById("editTimeStart").value;
        updatedData.duration = parseInt(document.getElementById("editDuration").value, 10);
        updatedData.persons = parseInt(document.getElementById("editPersons").value, 10);
        updatedData.price = parseFloat(document.getElementById("editPrice").value);
        

        // Отправляем PUT-запрос на сервер
        const response = await fetch(`http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderIdToEdit}?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сохранения изменений: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Изменён заказ с ID: ${result.id}`);

        // Закрываем модальное окно
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        editModal.hide();

        // Показываем уведомление об успешном редактировании
        const successToastEdit = new bootstrap.Toast(document.getElementById("successToastEdit"));
        successToastEdit.show();

        // Обновляем список заказов
        loadOrders();
    } catch (error) {
        console.error("Ошибка при сохранении изменений:", error);
        alert("Не удалось сохранить изменения. Попробуйте снова.");
    }
}

// Привязываем обработчик к форме редактирования
document.getElementById("editOrderForm").addEventListener("submit", saveOrderChanges);


let orderIdToDelete = null; // Хранит ID заказа, который нужно удалить

// Функция для показа модального окна удаления
function confirmDelete(orderId) {
    orderIdToDelete = orderId; // Сохраняем ID заказа
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show(); // Показываем модальное окно
}

// Функция для удаления заказа
async function deleteOrder() {
    if (!orderIdToDelete) return;

    try {
        // Отправляем DELETE-запрос к API
        const response = await fetch(`http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderIdToDelete}?api_key=b1f19860-58f9-4c45-a7fd-a1554c4f18d9`, 
        { method: "DELETE" });

        // Проверяем успешность запроса
        if (!response.ok) {
            throw new Error(`Ошибка удаления заказа: ${response.status}`);
        }

        // Получаем ответ в формате JSON
        const result = await response.json();
        console.log(`Удалён заказ с ID: ${result.id}`);

        // Закрываем модальное окно
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();

        // Показываем уведомление об успешном удалении
        const successToast = new bootstrap.Toast(document.getElementById('successToast'));
        successToast.show();

        // Обновляем список заказов
        loadOrders();
    } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        alert("Не удалось удалить заказ. Попробуйте снова.");
    }
}

// Привязываем обработчик к кнопке подтверждения удаления
document.getElementById('confirmDeleteButton').addEventListener('click', deleteOrder);


// Загружаем заказы при загрузке страницы
document.addEventListener("DOMContentLoaded", loadOrders);



//КУРСЫ ИНФА

let allCourses = []; // Все курсы (загружаются из API)
let filteredCourses = []; // Отфильтрованные курсы
const ITEMS_PER_PAGE = 3; // Количество курсов на странице
