export default function validationTemplate(name) {
  return `
import { checkSchema } from "express-validator";

const ${name}Validation = {};

export default ${name}Validation;

`;
}
