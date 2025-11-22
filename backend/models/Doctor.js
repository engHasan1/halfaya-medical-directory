const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم الطبيب'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الهاتف'],
    trim: true
  },
  speciality: {
    type: String,
    required: [true, 'الرجاء إدخال التخصص'],
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

module.exports = mongoose.model('Doctor', doctorSchema);

