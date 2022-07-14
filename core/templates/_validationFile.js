export default function _validationFileTemplate(name, data) {
  return `import { checkSchema } from "express-validator";

const ${name}Validation = checkSchema({
  ${data
    .map(sd => {
      return `${sd}: {
    trim: true,
    notEmpty: {
    errorMessage: "${sd} tidak boleh kosong",
    },
  },`;
    })
    .join("")}

});

export default ${name}Validation;
`;
}
