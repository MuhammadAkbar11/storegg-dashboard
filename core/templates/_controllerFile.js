import { moduleNameToCap } from "../utils.js";

export default function _controllerFileTemplate(name) {
  const capitalName = moduleNameToCap(name);

  return `import { validationResult } from "express-validator";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  create${capitalName},
  delete${capitalName}ById,
  findAll${capitalName},
  find${capitalName}ById,
  update${capitalName},
} from "./${name}.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const ${name} = await findAll${capitalName}()
    res.render("${name}/v_${name}", {
      title: "${name}",
      path: "/${name}",
      flashdata: flashdata,
      ${name}: ${name},
      errors: errors,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};


export const post${capitalName} = async (req, res, next) => {

  const {} = req.body

  const validate = validationResult(req);
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


export const put${capitalName} = async (req, res, next) => {

  const validate = validationResult(req);
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


export const delete${capitalName} = async (req, res, next) => {
  const ID = req.params.id;

  try {

    const ${name} = await find${capitalName}ById(ID);

    if(!${name}) {
      // response here
      return
    }

    await delete${capitalName}ById(ID);

    // code here
  } catch (error) {
    // response error
  }
};
  `;
}
