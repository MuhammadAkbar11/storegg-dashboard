const thumbnailUploaderInit = () => {
  // ProjectForm();

  const InputFileThumbnail = document.getElementById("upload-thumbnail");
  const BtnUploadThumbnail = document.getElementById("btn-upload-thumbnail");
  if (BtnUploadThumbnail) {
    BtnUploadThumbnail.addEventListener("click", e => {
      e.preventDefault();
      InputFileThumbnail.click();
      console.log("clcik");
    });

    InputFileThumbnail.addEventListener("change", e => {
      resetUpload(InputFileThumbnail);
      const newFile = convertThumbnailFileToObjectURL(
        e.target,
        e.target.files
      )[0];
      if (newFile) {
        createPreviewThumbnail(e.target, newFile);
      }
    });
  }
};

const checkFileType = file => {
  const fileTypes = /jpg|jpeg|png/;
  const mimeType = fileTypes.test(file.type);
  return mimeType;
};

const setErrorUpload = el => {
  const ElParent = el.parentNode;
  const MessageErrEl = document.createElement("div");
  MessageErrEl.className = "mt-1 upload-error";
  MessageErrEl.innerHTML = `
  <small class="text-danger">Only Allowed Thumbnail</small>
  `;
  ElParent.appendChild(MessageErrEl);
};

const resetUpload = el => {
  const ElParent = el.parentNode;
  const MessageErrEl = ElParent.querySelector(".upload-error");
  const parentId = el.dataset.parent;
  const PreviewTarget = ElParent.querySelector(`#${parentId}`);
  const PreviewEl = ElParent.querySelector("#upload-preview-wrapper");

  if (MessageErrEl) {
    PreviewTarget.removeChild(MessageErrEl);
  }

  if (PreviewEl) {
    PreviewTarget.removeChild(PreviewEl);
  }
};

const createPreviewThumbnail = (el, file) => {
  const ElParent = el.parentNode;
  const parentId = el.dataset.parent;
  const height = el.dataset.imageHeight;
  const width = el.dataset.imageWidth;
  const PreviewTarget = ElParent.querySelector(`#${parentId}`);
  const PreviewWrapper = document.createElement("div");
  const PreviewImg = document.createElement("img");
  const PreviewLabel = document.createElement("small");

  PreviewWrapper.id = "upload-preview-wrapper";
  PreviewWrapper.className = "d-flex flex-column";

  PreviewLabel.className = "mb-1 upload-preview-label text-info ";
  PreviewLabel.textContent = "Gambar yang akan diupload";

  PreviewImg.setAttribute("src", file.url);
  PreviewImg.setAttribute("alt", "preview upload");
  PreviewImg.setAttribute("height", height);
  PreviewImg.setAttribute("width", width);
  PreviewImg.className = "upload-preview-img object-fit-cover";
  PreviewWrapper.appendChild(PreviewLabel);
  PreviewWrapper.appendChild(PreviewImg);
  PreviewTarget.appendChild(PreviewWrapper);
};

const convertThumbnailFileToObjectURL = (el, files) => {
  return [...files].map(file => {
    if (checkFileType(file)) {
      return {
        filename: file.name,
        file,
        url: URL.createObjectURL(file),
      };
    }

    setErrorUpload(el);
    return null;
  });
};

thumbnailUploaderInit();
