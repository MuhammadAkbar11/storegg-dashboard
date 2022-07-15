import { moduleNameToCap } from "../utils.js";

export default function _modelFileTemplate(name, dbName, seeds) {
  const capitalName = moduleNameToCap(name);
  const schemaName = `${name}Schema`;

  return `import mongoose from "mongoose";

const ${schemaName} = mongoose.Schema(
  {${seeds
    .map(sd => {
      return `${sd}: {
      type: String
    },`;
    })
    .join("\n")}
  },
  {
    timestamps: true,
  }
);

const ${capitalName}Model = mongoose.model("${capitalName}Model", ${schemaName}, "${dbName}");

export default ${capitalName}Model;
`;
}
