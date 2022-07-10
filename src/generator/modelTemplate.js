export default function modelTemplate(name, dbName) {
  const modelName = `${name.charAt(0).toUpperCase() + name.slice(1)}Model`;
  const schemaName = `${name}Schema`;

  return `
import mongoose from "mongoose";

const ${schemaName} = mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

const ${modelName} = mongoose.model(
  "${modelName}",
  ${schemaName},
  "${dbName}"
);

export default ${modelName};

`;
}
