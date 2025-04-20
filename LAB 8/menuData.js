const menuData = {
    soups: [
        { name: 'гаспачо', price: 195, weight: '350г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/soups/gazpacho', kind: 'veg' },
        { name: 'Овощной суп с курицей', price: 240, weight: '370г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/soups/vegetable_chicken_soup', kind: 'meat' },
        { name: 'куриный суп', price: 260, weight: '350г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/soups/chicken_soup', kind: 'meat' },
        { name: 'Суп из морепродуктов', price: 300, weight: '330г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/soups/seafood_soup', kind: 'fish' },
        { name: 'Грибной суп-пюре', price: 185, weight: '330г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/soups/mushroom_soup', kind: 'veg' },
        { name: 'норвежский суп', price: 270, weight: '330г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/soups/norwegian_soup', kind: 'fish' }
    ],
    mainDishes: [
        { name: 'жареная картошка с грибами', price: 150, weight: '250г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/mainDishes/fried_potatoes_with_mushrooms', kind: 'veg' },
        { name: 'Долма', price: 200, weight: '250г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/mainDishes/dolma', kind: 'veg' },
        { name: 'Суши', price: 400, weight: '300г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/mainDishes/sushi', kind: 'fish' },
        { name: 'жареная рыба', price: 750, weight: '550г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/mainDishes/fried_fish', kind: 'fish' },
        { name: 'Лазанья', price: 385, weight: '310г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/mainDishes/lasagna', kind: 'meat' },
        { name: 'Котлеты из курицы с картофельным пюре', price: 225, weight: '280г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/mainDishes/chicken_cutlets_with_mashed_potatoes', kind: 'meat' }
    ],
    salads: [
        { name: 'Салат с тунцом', price: 210, weight: '200г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/Салат с тунцом.jpg',kind:'fish' },
        { name: 'Салат с креветками', price: 270, weight: '230г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/Salad with shrimps.jpg',kind:'fish' },
        { name: 'Салат Цезарь с курицей', price: 350, weight: '220г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/Салат Цезарь с курицей.jpg', kind:'meat' },
        { name: 'Салат из курицы и свеклы', price: 200, weight: '190г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/Chicken and beetroot salad.jpg', kind:'meat' },
        { name: 'картофель фри', price: 120, weight: '200г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/main_course/fries.jpeg', kind:'veg'},
        { name: 'хумус', price: 210, weight: '240г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/хумус.jpg',kind:'veg' },
        { name: 'Табуле', price: 270, weight: '270г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/Табуле.jpg ',kind:'veg' },
        { name: 'Фаттуш', price: 250, weight: '270г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/фаттуш.jpg',kind:'veg' },
        { name: 'Салат с макаронами', price: 270, weight: '300г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/salat/Pasta salad.jpg',kind:'veg' }
    ],
    drinks: [
        { name: 'зеленый чай', price: 90, weight: '250 мл', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/beverages/green tea.jpeg' ,kind:'hot'},
        { name: 'капучино', price: 150, weight: '350 мл', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/beverages/cappuccino.jpeg',kind:'hot' },
        { name: 'горячий шоколад', price: 140, weight: '300 мл', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/beverages/hot choclate.jpeg',kind:'hot' },
        { name: 'Апельсиновый сок', price: 120, weight: '300 мл', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/beverages/orangejuice.jpg',kind:'cold' },
        { name: 'Яблочный сок', price: 90, weight: '300 мл', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/beverages/applejuice.jpg',kind:'cold' },
        { name: 'морковный сок', price: 110, weight: '300 мл', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/beverages/carrotjuice.jpg',kind:'cold' }
    ],
    desserts: [
        { name: 'Кекс', price: 100, weight: '70г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/sweets/cupcake.jpg', kind:'small' },
        { name: 'Блины с сиропом', price: 140, weight: '200г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/sweets/Blini with syrup.jpg',kind:'small' },
        { name: 'Шарики из молочного шоколада', price: 120, weight: '120г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/sweets/Milk chocolate balls.jpg', kind:'small' },
        { name: 'торт с фруктами', price: 900, weight: '450г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/sweets/Large fruit cake.jpg', kind:'large'},
        { name: 'пончики', price: 240, weight: '200г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/sweets/Donuts.jpg' , kind:'medium'},
        { name: 'синнабон', price: 240, weight: '200г', image: 'http://lab7-api.std-900.ist.mospolytech.ru/images/menu/sweets/Cinnamon Cinnabon.jpg', kind:'medium' }
    ]
};
