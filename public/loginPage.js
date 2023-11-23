 "use strict";


 const userForm = new UserForm();
 userForm.loginFormCallback = ({ login, password }) => {
     ApiConnector.login({ login, password }, response => {
         if (response.success) {
             location.reload();
         } else {
             userForm.setLoginErrorMessage(response.error);
         }
     });
 }

 userForm.registerFormCallback = ({ login, password }) => {
     ApiConnector.register({ login, password }, response => {
         if (response.success) {
             location.reload();
         } else {
             userForm.setLoginErrorMessage(response.error);
         }
     });
 }