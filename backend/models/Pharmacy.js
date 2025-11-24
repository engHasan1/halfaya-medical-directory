const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم الصيدلية'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الهاتف'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'الرجاء إدخال العنوان'],
    trim: true
  },
  isOnDuty: {
    type: Boolean,
    default: false
  },
  shiftType: {
    type: String,
    enum: ['صباحية', 'مسائية'],
    default: 'صباحية'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);

