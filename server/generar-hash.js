const bcrypt = require("bcryptjs");

const password = "admin123";
const hash = bcrypt.hashSync(password, 10);

console.log("Contraseña:", password);
console.log("Hash:", hash);

// Verificación inmediata
console.log("¿Coincide?", bcrypt.compareSync(password, hash));