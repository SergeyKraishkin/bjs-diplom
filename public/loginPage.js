 "use strict";


 const userForm = new UserForm();
 userForm.loginFormCallback = (...args) => {
     ApiConnector.login(...args, callback => {
         if (callback.success) {
             location.reload();
         } else {
             userForm.setLoginErrorMessage("Не правильный логин или пароль");
         }
     });
 }

 userForm.registerFormCallback = (...args) => {
     ApiConnector.register(...args, callback => {
         if (callback.success) {
             location.reload();
         } else {
             userForm.setLoginErrorMessage("Не удалось зарегистрировать пользователя");
         }
     });
 }