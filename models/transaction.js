var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TxSchema   = new Schema({
    tx_id: Number,
    amount: Number
});

module.exports = mongoose.model('Transaction', TxSchema);
