const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BonusSchema = new Schema({
  _id: String,
  IDLEGA: String,
  NPUNTEGGIO: Number,
  CTITOLO: String,
  CDESCRIZIONE: String,
  BCONTABILE: Boolean,
  NMASSIMO: Number,
  IDCREATORE: String,
  DINSERIMENTO: Date
});

const BonusModel = mongoose.model('Bonus', BonusSchema);

module.exports = BonusModel;
