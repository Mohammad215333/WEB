// Переменные для хранения данных
let allCourses = []; // Все курсы (загружаются из API)
let filteredCourses = []; // Отфильтрованные курсы
let currentPage = 1; // Текущая страница
const ITEMS_PER_PAGE = 3; // Количество курсов на странице

// Функция для получения данных о курсах через API
async function fetchCourses() {
    const apiUrl = "http://exam-api-courses.std-900.ist.mospolytech.ru/api/courses?api_key=d7066d49-9e1b-49f6-bac7-83e807c7c47d";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        allCourses = await response.json(); // Сохраняем все курсы в переменную
        console.log("Данные успешно загружены:", allCourses);
    } catch (error) {
        console.error("Ошибка при загрузке данных из API:", error);
        alert("Не удалось загрузить данные о курсах. Попробуйте позже.");
    }
}
document.addEventListener("DOMContentLoaded", fetchCourses);
// Загрузка данных при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCourses(); // Загружаем данные о курсах из API

    filteredCourses = [...allCourses]; // Изначально отображаем все курсы
    setupPagination(filteredCourses); // Настраиваем пагинацию для всех курсов
    renderCourses(filteredCourses, currentPage); // Отображаем первую страницу всех курсов
});


// Обработчик изменения уровня в выпадающем списке
document.getElementById("search-level").addEventListener("change", (event) => {
    const selectedLevel = event.target.value;
    filterCoursesByLevel(selectedLevel); // Фильтруем и обновляем отображение курсов
});

// Функция для фильтрации курсов по уровню
function filterCoursesByLevel(level) {
    // Проверяем выбранный уровень
    if (level === "allCourses") {
        filteredCourses = [...allCourses]; // Если выбран "Все курсы", копируем все курсы
    } else {
        filteredCourses = allCourses.filter(course => course.level === level); // Фильтруем по уровню
    }

    currentPage = 1; // Сбрасываем на первую страницу после фильтрации
    setupPagination(filteredCourses); // Настраиваем пагинацию для отфильтрованных данных
    renderCourses(filteredCourses, currentPage); // Отображаем первую страницу отфильтрованных данных
}

// Функция для отображения курсов на странице
function renderCourses(courses, page) {
    const coursesContainer = document.querySelector("#courses .row"); // Контейнер для курсов

    // Очищаем контейнер перед добавлением новых данных
    coursesContainer.innerHTML = "";

    // Рассчитываем индекс начала и конца текущей страницы
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Получаем данные для текущей страницы
    const coursesToRender = courses.slice(startIndex, endIndex);

    // Проверяем, есть ли курсы для отображения
    if (coursesToRender.length === 0) {
        coursesContainer.innerHTML = "<p>Курсы не найдены.</p>";
        return;
    }

    // Проходим по списку курсов и создаем карточки
    coursesToRender.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "col-md-4 mb-3";

        courseCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text"><strong>Уровень:</strong> ${course.level}</p>
                    <button class="btn btn-primary btn-view-details" data-id="${course.id}">Подробнее</button>
                </div>
            </div>
        `;

        coursesContainer.appendChild(courseCard);
    });

    // Добавляем обработчики кликов на кнопки "Подробнее"
    document.querySelectorAll(".btn-view-details").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение
            const courseId = parseInt(e.target.getAttribute("data-id"));
            showCourseDetails(courseId);
        });
    });
}

// Функция настройки пагинации
function setupPagination(data) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Очищаем старые кнопки

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE); // Общее количество страниц

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
        
        pageItem.innerHTML = `
            <a href="#" class="page-link">${i}</a>
        `;

        pageItem.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderCourses(data, currentPage); // Переключаем страницу
            setupPagination(data); // Обновляем активную кнопку
        });

        paginationContainer.appendChild(pageItem);
    }
}

// Обработчик кнопки "Подробнее"
function showCourseDetails(courseId) {
    const selectedCourse = allCourses.find(course => course.id === courseId);

    if (!selectedCourse) {
        alert("Курс не найден!");
        return;
    }

    // Заполняем данные в модальном окне
    document.getElementById("courseName").value = selectedCourse.name;
    document.getElementById("teacherName").value = selectedCourse.teacher;
    document.getElementById("courseDuration").value = `${selectedCourse.total_length} недель`;

    // Заполняем доступные даты начала
    const startDateSelect = document.getElementById("startDate");
    startDateSelect.innerHTML = selectedCourse.start_dates.map(date => 
        `<option value="${date}">${new Date(date).toLocaleDateString()}</option>`
    ).join("");

    // Активируем выбор времени после выбора даты
    startDateSelect.addEventListener("change", () => {
        const selectedDate = startDateSelect.value;
        const startTimeSelect = document.getElementById("startTime");
        startTimeSelect.innerHTML = ""; // Очищаем старые значения

        if (selectedDate) {
            startTimeSelect.disabled = false;

            // Пример: добавляем время начала (можно заменить на данные из API)
            startTimeSelect.innerHTML = `
                <option value="${selectedDate}T14:00:00">14:00 - 15:00</option>`;
        }
    });

    // Показываем модальное окно
    const modalInstance = new bootstrap.Modal(document.getElementById("applyModal"));
    modalInstance.show();
}

// Обработчик отправки формы

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCourses(); // Загружаем данные о курсах из API

    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = ""; // Очищаем старые значения

    // Заполняем выпадающий список курсами
    allCourses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    // Обновляем информацию при выборе курса
    courseSelect.addEventListener("change", updateCourseDetails);

    // Добавляем обработчики для пересчета стоимости при изменении количества человек
    document.getElementById("personsCount").addEventListener("input", updateCourseDetails);

    // Добавляем обработчики для пересчета стоимости при изменении состояния чекбоксов
    const checkboxes = document.querySelectorAll(".form-check-input");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateCourseDetails);
    });
});

// Обновление информации о курсе при выборе
function updateCourseDetails() {
    const selectedCourseId = parseInt(document.getElementById("courseSelect").value);
    const selectedCourse = allCourses.find(course => course.id === selectedCourseId);

    if (selectedCourse) {
        document.getElementById("courseName").value = selectedCourse.name;
        document.getElementById("teacherName").value = selectedCourse.teacher;
        document.getElementById("courseDuration").value = `${selectedCourse.total_length} недель`;

        // Заполняем даты начала курса
        const startDateSelect = document.getElementById("startDate");
        startDateSelect.innerHTML = ""; // Очищаем старые значения
        selectedCourse.start_dates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = new Date(date).toLocaleDateString();
            startDateSelect.appendChild(option);
        });

        // Обновляем стоимость курса
        const personsCount = parseInt(document.getElementById("personsCount").value) || 1; // Получаем количество человек (по умолчанию 1)
        document.getElementById("totalPrice").value = `${calculateTotalPrice(selectedCourse, personsCount)} руб.`;
    }
}

// Расчет стоимости курса с учетом всех параметров
function calculateTotalPrice(course, persons) {
    if (!course) return 0;

    const durationWeeks = course.total_length;
    const pricePerHour = course.course_fee_per_hour;
    let basePrice = durationWeeks * course.week_length * pricePerHour * persons;

    // Применение скидки за раннюю регистрацию (10%)
    const startDateInput = document.getElementById("startDate");
    const startDate = startDateInput ? new Date(startDateInput.value) : null;
    const currentDate = "2025-01-19";

    let discountMultiplier = 1; // Множитель для скидок

    // Проверяем, регистрируется ли студент за месяц до начала курса
    if (startDate && (startDate - currentDate) / (1000 * 60 * 60 * 24) >= 30) { // Разница в днях >= 30
        discountMultiplier *= 0.9; // Скидка 10%
    }

    // Применение скидки за групповую запись (15%)
    if (persons >= 5) {
        discountMultiplier *= 0.85; // Дополнительная скидка 15%
    }

    basePrice *= discountMultiplier; // Применяем все скидки

    // Надбавка за интенсивный курс (20%)
    const intensiveCourseCheckbox = document.getElementById("intensiveCourse");
    if (intensiveCourseCheckbox?.checked) {
        basePrice *= 1.2;
    }

    // Дополнительные учебные материалы (+2000 руб. за каждого студента)
    const supplementaryCheckbox = document.getElementById("supplementary");
    if (supplementaryCheckbox?.checked) {
        basePrice += 2000 * persons;
    }

    // Индивидуальные занятия (+1500 руб. за каждую неделю курса)
    const personalizedCheckbox = document.getElementById("personalized");
    if (personalizedCheckbox?.checked) {
        basePrice += 1500 * durationWeeks;
    }

    // Культурные экскурсии (+25%)
    const excursionsCheckbox = document.getElementById("excursions");
    if (excursionsCheckbox?.checked) {
        basePrice *= 1.25;
    }

    // Оценка уровня владения языком (+300 руб.)
    const assessmentCheckbox = document.getElementById("assessment");
    if (assessmentCheckbox?.checked) {
        basePrice += 300;
    }

    // Доступ к интерактивной онлайн-платформе (увеличение стоимости в 1.5 раза)
    const interactiveCheckbox = document.getElementById("interactive");
    if (interactiveCheckbox?.checked) {
        basePrice *= 1.5;
    }

    return Math.round(basePrice); // Округляем итоговую стоимость
}

// Отправка формы заявки на сервер
document.getElementById("applicationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const courseSelect = document.getElementById("courseSelect");
        const startDate = document.getElementById("startDate");
        const timeStart = document.getElementById("timeStart");
        const courseDuration = document.getElementById("courseDuration");
        const personsCount = document.getElementById("personsCount");
        const totalPrice = document.getElementById("totalPrice");

        // Проверяем наличие всех обязательных элементов
        if (!courseSelect || !startDate || !timeStart || !courseDuration || !personsCount || !totalPrice) {
            throw new Error("Не все обязательные элементы формы найдены.");
        }

        // Собираем данные из формы
        const requestData = {
            id: 1,
            tutor_id: parseInt(document.getElementById("tutorId")?.value) || 0,
            course_id: parseInt(courseSelect.value),
            date_start: startDate.value,
            time_start: timeStart.value,
            duration: parseInt(courseDuration.value.split(' ')[0]),
            persons: parseInt(personsCount.value),
            price: parseFloat(totalPrice.value.replace(' руб.', '')),
            early_registration: document.getElementById("earlyRegistration")?.checked || false,
            group_enrollment: false,
            intensive_course: document.getElementById("intensiveCourse")?.checked || false,
            supplementary: document.getElementById("supplementary")?.checked || false,
            personalized: document.getElementById("personalized")?.checked || false,
            excursions: document.getElementById("excursions")?.checked || false,
            assessment: document.getElementById("assessment")?.checked || false,
            interactive: document.getElementById("interactive")?.checked || false,
        };
        // Отправляем запрос на сервер
        const response = await fetch(
            
            "http://exam-api-courses.std-900.ist.mospolytech.ru/api/orders?api_key=d7066d49-9e1b-49f6-bac7-83e807c7c47d",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            }
        );

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Ошибка сервера:", errorDetails);
            throw new Error(errorDetails.message || `HTTP ${response.status}`);
        }

        // Уведомление об успешной отправке
        showNotification("Заявка успешно отправлена!", "success");

        // Закрываем модальное окно (если используется)
        const modal = bootstrap.Modal.getInstance(document.getElementById("applyModal"));
        if (modal) modal.hide();

        // Очищаем форму после успешной отправки
        clearForm();
    } catch (error) {
        console.error(error);
        
        // Уведомление об ошибке
        showNotification(`Ошибка при отправке заявки. ${error.message}`, "danger");
    }
});

// Функция для очистки формы
function clearForm() {
    document.getElementById("applicationForm").reset();
}

// Функция для отображения уведомлений
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.role = "alert";
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    // Добавляем уведомление в body
    document.body.appendChild(notification);

    // Автоматическое скрытие уведомления через 5 секунд
    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("fade");
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

















//http://exam-api-courses.std-900.ist.mospolytech.ru/api/tutors/{tutor-id}?api_key=d7066d49-9e1b-49f6-bac7-83e807c7c47d








// Функция для отображения подробной информации о курсе в модальном окне
function showCourseDetails(courseId) {
    const selectedCourse = allCourses.find(course => course.id === courseId);

    if (!selectedCourse) {
        alert("Курс не найден!");
        return;
    }

    const modalContent = `
      <div class="modal-header">
          <h5 class="modal-title">${selectedCourse.name}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          <p><strong>Описание:</strong> ${selectedCourse.description}</p>
          <p><strong>Преподаватель:</strong> ${selectedCourse.teacher}</p>
          <p><strong>Уровень:</strong> ${selectedCourse.level}</p>
          <p><strong>Длительность:</strong> ${selectedCourse.total_length} недель</p>
          <p><strong>Часы в неделю:</strong> ${selectedCourse.week_length}</p>
          <p><strong>Стоимость за час:</strong> ${selectedCourse.course_fee_per_hour} руб.</p>
          <p><strong>Доступные даты начала:</strong></p>
          <ul>${selectedCourse.start_dates.map(date => `<li>${new Date(date).toLocaleString()}</li>`).join("")}</ul>
      </div>`;
    
      document.querySelector("#courseModal .modal-content").innerHTML = modalContent;

      const modalInstance = new bootstrap.Modal(document.getElementById("courseModal"));
      modalInstance.show();
}

//РЕПЕТИТОРЫ

const ITEMS_PER_PAGE2 = 3; // Количество репетиторов на одной странице
let currentPage2 = 1; // Текущая страница
let allTutors = []; // Все репетиторы (загружаются из API)

// Загрузка данных при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    await fetchTutors(); // Загружаем данные о репетиторах из API
    setupPagination2(allTutors); // Настраиваем пагинацию
    renderTutors(allTutors, currentPage2); // Отображаем первую страницу репетиторов
});

// Функция для получения данных о репетиторах через API
async function fetchTutors() {
    const apiUrl = "http://exam-api-courses.std-900.ist.mospolytech.ru/api/tutors?api_key=d7066d49-9e1b-49f6-bac7-83e807c7c47d";
                    
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        allTutors = await response.json(); // Сохраняем всех репетиторов в переменную
        console.log("Данные о репетиторах успешно загружены:", allTutors);
    } catch (error) {
        console.error("Ошибка при загрузке данных о репетиторах:", error);
        alert("Не удалось загрузить данные о репетиторах. Попробуйте позже.");
    }
}

// Обработчик изменения уровня в выпадающем списке
document.getElementById("qualification-filter").addEventListener("change", (event) => {
    const selectedLevel = event.target.value;
    filterTutorsByLevel(selectedLevel); // Фильтруем и обновляем отображение курсов
});

// Функция для фильтрации  по уровню
function filterTutorsByLevel(level) {
    // Проверяем выбранный уровень
    if (level === "allTutors") {
        filteredTutors = [...allTutors]; // Если выбран "Все курсы", копируем все курсы
    } else {
        filteredTutors = allTutors.filter(tutors => tutors.language_level === level); // Фильтруем по уровню
    }

    currentPage2 = 1; // Сбрасываем на первую страницу после фильтрации
    setupPagination2(filteredTutors); // Настраиваем пагинацию для отфильтрованных данных
    renderTutors(filteredTutors, currentPage2); // Отображаем первую страницу отфильтрованных данных
}

// Обработчик изменения минимального опыта
document.getElementById("experience-filter").addEventListener("input", (event) => {
    const minExperience = parseInt(event.target.value);
    filterTutorsByExperience(minExperience); // Фильтруем и обновляем отображение репетиторов
});


// Функция для фильтрации репетиторов по минимальному опыту
function filterTutorsByExperience(minExperience) {
    if (isNaN(minExperience) || minExperience <= 0) {
        filteredTutors = [...allTutors]; // Если значение не указано или некорректно, показываем всех репетиторов
    } else {
        filteredTutors = allTutors.filter(tutor => tutor.work_experience >= minExperience); // Фильтруем по опыту
    }

    currentPage2 = 1; // Сбрасываем на первую страницу после фильтрации
    setupPagination2(filteredTutors); // Настраиваем пагинацию для отфильтрованных данных
    renderTutors(filteredTutors, currentPage2); // Отображаем первую страницу отфильтрованных данных
}

// Функция для отображения списка репетиторов на текущей странице
// Функция для отображения списка репетиторов на текущей странице
function renderTutors(tutors, page) {
    const tutorContainer = document.getElementById("tutor-container");

    // Очищаем контейнер перед добавлением новых данных
    tutorContainer.innerHTML = "";

    // Рассчитываем индекс начала и конца текущей страницы
    const startIndex = (page - 1) * ITEMS_PER_PAGE2;
    const endIndex = startIndex + ITEMS_PER_PAGE2;

    // Получаем данные для текущей страницы
    const tutorsToRender = tutors.slice(startIndex, endIndex);

    if (tutorsToRender.length === 0) {
        tutorContainer.innerHTML = "<p>Репетиторы не найдены.</p>";
        return;
    }

    // Создаем карточки для каждого репетитора
    tutorsToRender.forEach(tutor => {
        const tutorCard = document.createElement("div");
        tutorCard.className = "col-md-4"; // Используем сетку Bootstrap

        tutorCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${tutor.name}</h5>
                    <p><strong>Опыт:</strong> ${tutor.work_experience} лет</p>
                    <p><strong>Языки, которые знает:</strong> ${tutor.languages_spoken.join(", ")}</p>
                    <p><strong>Языки, которые преподаёт:</strong> ${tutor.languages_offered.join(", ")}</p>
                    <p><strong>Уровень:</strong> ${tutor.language_level}</p>
                    <p><strong>Цена за час:</strong> ${tutor.price_per_hour} руб.</p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookingModal" 
                        onclick="openBookingForm('${tutor.name}', ${tutor.price_per_hour})">
                        Записаться на занятие
                    </button>
                </div>
            </div>
        `;

        tutorContainer.appendChild(tutorCard);
    });
}

// Функция для открытия модального окна с формой записи
function openBookingForm(tutorName, pricePerHour) {
    // Устанавливаем значения в форму
    document.getElementById("bookingTutorName").value = tutorName;
    document.getElementById("bookingPrice").value = `${pricePerHour} руб.`;
    
}

// Функция для отправки данных формы записи
async function submitBookingForm(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Собираем данные из формы
    const formData = {
        //id: 1, // Уникальный идентификатор заявки (если сервер ожидает его)
        tutor_id:  1,
        course_id: 7, 
        student_id:4,
        date_start: document.getElementById("bookingDate")?.value || "2025-02-15",
        time_start: document.getElementById("bookingTime")?.value || "16:08:00",
        duration:  6,
        persons: 1, 
        price: parseFloat(document.getElementById("bookingPrice")?.value.replace(" руб.", "")) || 0,
        early_registration: false,
        early_registration: false, 
        supplementary: false,
        personalized: false,
        excursions: false,
        assessment: false,
        group_enrollment: false,
        interactive: false,
        intensive_course: false
    };

    // Проверяем обязательные поля перед отправкой
    if (!formData.tutor_id || !formData.date_start || !formData.time_start || formData.price < 0) {
        alert("Пожалуйста, заполните все обязательные поля!");
        return;
    }

    try {
        // Отправляем данные на сервер
        const response = await fetch(
            "http://exam-api-courses.std-900.ist.mospolytech.ru/api/orders?api_key=d7066d49-9e1b-49f6-bac7-83e807c7c47d",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Ошибка сервера:", errorDetails);
            throw new Error(`Ошибка ${response.status}: ${errorDetails.message}`);
        }

        // Успешное сообщение
        alert("Вы успешно записались на занятие!");

        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
        if (modal) modal.hide();

        // Сбрасываем форму
        document.getElementById("bookingForm").reset();
    } catch (error) {
        console.error(error);
        alert(`Произошла ошибка при записи. ${error.message}`);
    }
}

function showNotification(message, type = "success") {
    const notificationContainer = document.getElementById("notifications");

    // Создаём элемент уведомления
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = "alert";
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);

    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}



// Функция настройки пагинации
function setupPagination2(data) {
    const paginationContainer = document.getElementById("pagination2");
    
    paginationContainer.innerHTML = ""; // Очищаем старые кнопки

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE2); // Общее количество страниц

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage2 ? "active" : ""}`;
        
        pageItem.innerHTML = `
            <a href="#" class="page-link">${i}</a>
        `;

        pageItem.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage2 = i;
            renderTutors(data, currentPage2); // Переключаем страницу
            setupPagination2(data); // Обновляем активную кнопку
        });

        paginationContainer.appendChild(pageItem);
    }
}



