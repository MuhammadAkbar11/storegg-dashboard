import { moduleNameToCap } from "../utils.js";

export default function _controllerFileTemplate(name, seeds) {
  const capitalName = moduleNameToCap(name);

  const reqBodyDescructure = seeds.join(", ");
  const updatedData = seeds
    .map(sd => {
      return `${sd}: ${sd},`;
    })
    .join("\n");

  const newData = seeds
    .map(sd => {
      return `${sd}: "${moduleNameToCap(sd)} Data",`;
    })
    .join("\n");

  return `import { validationResult } from "express-validator";
import BaseError, {
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
      title: "${capitalName}",
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

  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // Response Validation Error Here
    return;
  }

  try {

    const new${capitalName}Data = {
      ${newData}
    }

    await create${capitalName}(new${capitalName}Data)

    // Response Success
  } catch (error) {
    console.log("[controller] post${capitalName} ")
    const trError = new TransfromError(error);
    next(trError);
    // Redirect Error
    // req.flash("flashdata", {
    //   type: "error",
    //   title: "Oppps",
    //   message: "Gagal membuat ${capitalName}",
    // });
    // res.redirect("/${name}?action_error=true");
  }
};


export const put${capitalName} = async (req, res, next) => {
  const ID = req.params.id;
  const { ${reqBodyDescructure} } = req.body

  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response error validation
    return;
  }

  try {

    const ${name} = await find${capitalName}ById(ID);

    if (!${name}) {
      throw new BaseError("NOT_FOUND", 404, "${name} tidak ditemukan", true);
    }

    const updated${capitalName}Data = {
      ${updatedData}
    }

    await update${capitalName}(ID, updated${capitalName}Data);

    // Response Success
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

    // Response Success
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};
  `;
}
