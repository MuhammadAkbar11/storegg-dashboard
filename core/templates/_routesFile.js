import { moduleNameToCap } from "../utils.js";

export default function _routesFileTemplate(name) {
  const capitalName = moduleNameToCap(name);
  return `import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  post${capitalName},
  put${capitalName},
  delete${capitalName}
} from "./${name}.controller.js";

import ${name}Validation from "./${name}.validator.js";

function ${capitalName}Routes(app) {

  app
  .route("/${name}/:id")
  .put(ensureAuth, ${name}Validation, put${capitalName})
  .delete(ensureAuth, delete${capitalName});
  app
    .route("/${name}")
    .get(ensureAuth, index)
    .post(ensureAuth, ${name}Validation, post${capitalName});
}

export default ${capitalName}Routes;

`;
}
