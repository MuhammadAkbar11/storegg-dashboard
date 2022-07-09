const logoutActions = [...document.querySelectorAll("#logout-action")];

const formLogout = document.getElementById("form-logout");

logoutActions.forEach(el => {
  el.addEventListener("click", event => {
    event.preventDefault();

    if (formLogout) {
      console.log(formLogout.submit());
    }
  });
});
