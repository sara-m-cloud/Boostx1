import { Sequelize ,DataTypes} from 'sequelize';
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from 'url';


const sequelize = new Sequelize('Boostxdatabase', 'root', '', {
    host: '127.0.0.1',   // localhost
    dialect: 'mysql'
});

// =============================
//  CHECK DB CONNECTION
// =============================
export const checkDBConnection = async () => {
    await sequelize.authenticate()
        .then(res => {
            console.log('DB authenticated done');
        })
        .catch(err => {
            console.error('Fail to authenticate on DB');
        });
};


// ======== __dirname الصحيح على ES Modules ========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======== Load models dynamically ========
const models = {};
const modelsPath = path.join(__dirname, "models"); // <--- هنا لأن الموديلات جوا db/

if (!fs.existsSync(modelsPath)) {
  console.error("خطأ: مجلد models مش موجود في:", modelsPath);
  process.exit(1);
}

const files = fs.readdirSync(modelsPath).filter(file => file.endsWith(".js"));

for (const file of files) {
  // تحويل المسار إلى URL صالح لـ import
  const modelURL = pathToFileURL(path.join(modelsPath, file)).href;
  const modelModule = await import(modelURL);
  const model = modelModule.default(sequelize, DataTypes);
  models[model.name] = model;
}

console.log("Loaded models:", Object.keys(models));

// ======== Setup associations ========
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

 

// =============================
//  SYNC DB (CREATE TABLES)
// =============================
export const syncDBConnection = async () => {
    await sequelize.sync({alter:true})
        .then(res => {
            console.log('DB synced done');
        })
        .catch(err => {
            console.error('Fail to sync DB', err);
        });
};

 export const db = { ...models, sequelize, Sequelize };

