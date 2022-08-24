$(function () {
  ("use strict");

  // variables
  var form = $("#form-edit-admin"),
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
    "address",
    function (value, element) {
      const rgx =
        /[0-9\\\/#\s.,a-zA-Z]+[,]+[0-9\\\/#\s.,a-zA-Z]+[,]+[a-zA-Z]+[.]+[0-9]+[/]+[a-zA-Z]+[.]+[0-9]+[,]+[0-9\\\/#\s.,a-zA-Z]+[,][0-9\\\/#\s.,a-zA-Z]/;
      // const rex = //
      return this.optional(element) || rgx.test(value);
    },
    "Format alamat tidak sesuai (contoh: Jln Antara, No 66, RT.666/RW.666, Jatimakmur, Pondok Gede)"
  );

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
          email: {
            required: true,
          },
          status: {
            required: true,
          },
          phone_number: {
            required: true,
          },
          address: {
            required: true,
            address: true,
          },
          regency: {
            required: true,
          },
          city: {
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
          email: {
            required: "Masukan email!",
          },
          status: {
            required: "Pilih status!",
          },
          phone_number: {
            required: "Masukan no hp!",
          },
          address: {
            required:
              "Masukan alamat (contoh: Jln dan No rumah, RT/RW, Kelurahan, Kecamatan)!",
          },
          regency: {
            required: "Masukan provinsi!",
          },
          city: {
            required: "Masukan kota!",
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
