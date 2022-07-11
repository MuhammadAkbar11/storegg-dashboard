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
  ToastsTemplate.map((toast, idx) => {
    const type = toast.dataset.type;
    const message = toast.dataset.message;
    const title = toast.dataset.title;
    setTimeout(() => {
      toastr[type](message, title, {
        timeOut: 9000,
        closeButton: true,
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: false,
      });
    }, idx * 1000);
  });
}
