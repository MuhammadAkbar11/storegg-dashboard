$(function () {
  ("use strict");

  // variables
  var form = $("#form-action-user"),
    accountUploadImg = $("#account-upload-img"),
    accountUploadBtn = $("#account-upload"),
    accountUserImage = $(".uploadedAvatar"),
    accountResetBtn = $("#account-reset"),
    accountNumberMask = $(".account-number-mask"),
    accountZipCode = $(".account-zip-code"),
    select2 = $(".select2");

  // Update user photo on click of button

  if (accountUserImage) {
    var resetImage = accountUserImage.attr("src");
    accountUploadBtn.on("change", function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if (accountUploadImg) {
          accountUploadImg.attr("src", reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
    });

    accountResetBtn.on("click", function () {
      accountUserImage.attr("src", resetImage);
    });
  }

  // jQuery Validation for all forms
  // --------------------------------------------------------------------

  $.validator.addMethod(
    "noSpace",
    function (value, element) {
      return value.indexOf(" ") < 0 && value != "";
    },
    "Username tidak memperbolehkan spasi dan jangan biarkan kosong"
  );
  if (form.length) {
    form.each(function () {
      var $this = $(this);

      $this.validate({
        rules: {
          name: {
            required: true,
          },
          username: {
            required: true,
            noSpace: true,
          },
          status: {
            required: true,
          },

          phone_number: {
            required: true,
          },
        },
        messages: {
          name: {
            required: "Masukan nama !",
          },
          username: {
            required: "Masukan nama pengguna!",
          },
          status: {
            required: "Pilih status!",
          },
          phone_number: {
            required: "Masukan no hp!",
          },
        },
      });
    });
  }

  //phone
  if (accountNumberMask.length) {
    accountNumberMask.each(function () {
      // new Cleave($(this), {
      //   phone: true,
      //   phoneRegionCode: "ID",
      // });
      new Cleave($(this), {
        // prefix: "PREFIX",
        delimiter: "-",
        blocks: [3, 3, 4, 4],
        // uppercase: true,
      });
    });
  }

  //zip code
  if (accountZipCode.length) {
    accountZipCode.each(function () {
      new Cleave($(this), {
        delimiter: "",
        numeral: true,
      });
    });
  }

  // For all Select2
  if (select2.length) {
    select2.each(function () {
      var $this = $(this);
      $this.wrap('<div class="position-relative"></div>');
      $this.select2({
        dropdownParent: $this.parent(),
      });
    });
  }
});
