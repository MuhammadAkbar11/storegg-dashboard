import { body } from "express-validator";

const categoryValidation = [
  body("name").not().isEmpty().withMessage("nama kategori tidak boleh kosong"),
  body("description")
    .not()
    .isEmpty()
    .withMessage("Deskripsi kategori tidak boleh kosong"),
];

export default categoryValidation;
