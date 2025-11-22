const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الهاتف'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'الرجاء إدخال الجنس'],
    enum: ['ذكر', 'أنثى'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'الرجاء إدخال العنوان'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pharmacist', pharmacistSchema);

