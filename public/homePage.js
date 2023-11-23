"use strict";

const logout = new LogoutButton();
logout.action = function() {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(response.error);
        }
    });
};

ApiConnector.current(response => {
    if (response.success)
        ProfileWidget.showProfile(response.data);

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
const rates = new RatesBoard();
getcourse();
setInterval(getcourse, 60000);

function getcourse() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(response.data);
        }
    });
}

const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();
moneyManager.addMoneyCallback = function({ currency, amount }) {
    ApiConnector.addMoney({ currency, amount }, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}
moneyManager.conversionMoneyCallback = function({ fromCurrency, targetCurrency, fromAmount }) {
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

moneyManager.sendMoneyCallback = function({ to, currency, amount }) {
    ApiConnector.transferMoney({ to, currency, amount }, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } else {
        favoritesWidget.setMessage(false, response.error);
    }
});
favoritesWidget.addUserCallback = function({ id, name }) {
    ApiConnector.addUserToFavorites({ id, name }, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранные");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}

favoritesWidget.removeUserCallback = function(id) {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранных");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}