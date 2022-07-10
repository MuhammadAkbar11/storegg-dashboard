export default function validationTemplate(name) {
  return `
import { checkSchema } from "express-validator";

const ${name}Validation = checkSchema({});

export default ${name}Validation;
`;
}
