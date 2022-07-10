function controllerTemplate(name) {
  const capName = `${name.charAt(0).toUpperCase() + name.slice(1)}`;

  return `
import { validationResult } from "express-validator";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  create${capName},
  delete${capName}ById,
  findAll${capName},
  find${capName}ById,
  update${capName},
} from "./${name}.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("${name}/v_${name}", {
      title: "${name}",
      path: "/${name}",
      flashdata: flashdata,
      errors: errors,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};


export const post${capName} = async (req, res, next) => {

  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response here
    return;
  }

  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};


export const put${capName} = async (req, res, next) => {

  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response here
    return;
  }

  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};


export const delete${capName} = async (req, res, next) => {
  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};
  `;
}

export default controllerTemplate;
