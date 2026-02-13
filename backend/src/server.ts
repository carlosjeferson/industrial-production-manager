import "dotenv/config"; // 1º lugar: Carrega as variáveis
import app from "./app.js"; // 2º lugar: Carrega o resto do sistema

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});