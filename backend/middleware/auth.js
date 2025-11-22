const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// حماية الروتات - يتطلب JWT token
exports.protect = async (req, res, next) => {
  let token;

  // التحقق من وجود token في headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // التحقق من وجود token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح بالوصول. الرجاء تسجيل الدخول.'
    });
  }

  try {
    // التحقق من صحة token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // التحقق من وجود المدير
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token غير صحيح أو منتهي الصلاحية.'
    });
  }
};

