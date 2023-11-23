"use strict";

const Logout = new LogoutButton();
Logout.action = function act() {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage("Не удалось выйти");
        }
    });
};

ApiConnector.current(callback => {
    if (callback.success)
        ProfileWidget.showProfile(callback.data);

});

/* личный код получения курса валют (для памяти)
let xhr = new XMLHttpRequest();

function getcourse() {
    let courses = xhr.response;
    return (courses.Valute.USD.Value);
}
xhr.onload = getcourse;
xhr.open("GET", "https://www.cbr-xml-daily.ru/daily_json.js");
xhr.responseType = 'json';
xhr.send();
*/
const Rates = new RatesBoard();
getcourse();
const intervalID = setInterval(getcourse, 60000);

function getcourse() {
    ApiConnector.getStocks(callback => {
        if (callback.success) {
            Rates.clearTable();
            Rates.fillTable(callback.data);
        }
    });
}

const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();
moneyManager.addMoneyCallback = function addMoney(...args) {
    ApiConnector.addMoney(...args, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            favoritesWidget.setMessage(true, "Транзакция прошла успешно");
        } else {
            favoritesWidget.setMessage(false, "Транзакция не прошла");
        }
    });
}
moneyManager.conversionMoneyCallback = function convertMoney(...args) {
    ApiConnector.convertMoney(...args, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            favoritesWidget.setMessage(true, "Транзакция прошла успешно");
        } else {
            favoritesWidget.setMessage(false, "Транзакция не прошла");
        }
    });
}

moneyManager.sendMoneyCallback = function sendMoney(...args) {
    ApiConnector.transferMoney(...args, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data);
            favoritesWidget.setMessage(true, "Транзакция прошла успешно");
        } else {
            favoritesWidget.setMessage(false, "Транзакция не прошла");
        }
    });
}

ApiConnector.getFavorites(callback => {
    if (callback.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(callback.data);
        moneyManager.updateUsersList(callback.data);
    } else {
        favoritesWidget.setMessage(false, "Не получилось обновить");
    }
});
favoritesWidget.addUserCallback = function addUserFav(...args) {
    ApiConnector.addUserToFavorites(...args, callback => {
        if (callback.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранные");
        } else {
            favoritesWidget.setMessage(false, "Не получилось добавить пользователя в избранные");
        }
    });
}

favoritesWidget.removeUserCallback = function removeUserFav(...args) {
    ApiConnector.removeUserFromFavorites(...args, callback => {
        if (callback.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранных");
        } else {
            favoritesWidget.setMessage(false, "Не получилось удалить пользователя из избранных");
        }
    });
}