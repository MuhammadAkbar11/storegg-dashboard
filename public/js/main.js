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

const ToastsTemplate = [...document.querySelectorAll("#toast-template")];
if (ToastsTemplate.length !== 0) {
  ToastsTemplate.map(toast => {
    const type = toast.dataset.type;
    const message = toast.dataset.message;
    const title = toast.dataset.title;
    toastr[type](message, title, {
      closeButton: true,
      timeOut: 8000,
      progressBar: true,
      tapToDismiss: false,
    });
  });
}
