import { moduleNameToCap } from "../utils.js";

export default function _modelFileTemplate(name, dbName, seeds) {
  const modelName = moduleNameToCap(name);
  const schemaName = `${name}Schema`;

  return `import mongoose from "mongoose";

const ${schemaName} = mongoose.Schema(
  {${seeds
    .map(sd => {
      return `${sd}: {
      type: String
    },`;
    })
    .join("")}
  },
  {
    timestamps: true,
  }
);

const ${modelName} = mongoose.model("${modelName}", ${schemaName}, "${dbName}");

export default ${modelName};
`;
}
