const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 80; 

app.use(cors()); 
app.use(bodyParser.json());
app.use('/api/bonus', require('./routes/BonusRoutes'));
app.use('/api/categorie', require('./routes/CategorieRoutes'));
app.use('/api/giocatore', require('./routes/GiocatoreRoutes'));
app.use('/api/lega', require('./routes/LegaRoutes'));
app.use('/api/squadra', require('./routes/SquadraRoutes'));
app.use('/api/user', require('./routes/UserRoutes'));
async function run() {
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

run().catch(console.dir);
