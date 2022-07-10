export default function routesTemplate(name) {
  const capitalName = `${name.charAt(0).toUpperCase() + name.slice(1)}`;
  return `
import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  post${capitalName},
  put${capitalName},
  delete${capitalName}
} from "./${name}.controller.js";

import ${name}Validation from "./${name}.validator.js";

function ${capitalName}Routes(app) {
  app
    .route("/${name}")
    .get(ensureAuth, index)
    .post(ensureAuth, ${name}Validation, post${capitalName});

  app
    .route("/${name}/:id")
    .put(ensureAuth, ${name}Validation, put${capitalName})
    .delete(ensureAuth, delete${capitalName});
}

export default ${capitalName}Routes;

`;
}
