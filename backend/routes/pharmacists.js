const express = require('express');
const router = express.Router();
const Pharmacist = require('../models/Pharmacist');
const { protect } = require('../middleware/auth');

// الحصول على جميع الصيادلة - GET /api/pharmacists
router.get('/', async (req, res) => {
  try {
    const pharmacists = await Pharmacist.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pharmacists.length,
      data: pharmacists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
});

// الحصول على صيدلاني واحد - GET /api/pharmacists/:id
router.get('/:id', async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findById(req.params.id);

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'الصيدلاني غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
});

// إنشاء صيدلاني جديد - POST /api/pharmacists (محمية)
router.post('/', protect, async (req, res) => {
  try {
    // إزالة email و password من البيانات إذا كانت موجودة
    const { email, password, ...pharmacistData } = req.body;
    const pharmacist = await Pharmacist.create(pharmacistData);

    res.status(201).json({
      success: true,
      data: {
        id: pharmacist._id,
        name: pharmacist.name,
        phone: pharmacist.phone,
        gender: pharmacist.gender,
        address: pharmacist.address
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'فشل في إنشاء الصيدلاني',
      error: error.message
    });
  }
});

// تحديث صيدلاني - PUT /api/pharmacists/:id (محمية)
router.put('/:id', protect, async (req, res) => {
  try {
    // إزالة email و password من البيانات إذا كانت موجودة
    const { email, password, ...pharmacistData } = req.body;
    const pharmacist = await Pharmacist.findByIdAndUpdate(
      req.params.id,
      pharmacistData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'الصيدلاني غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'فشل في تحديث الصيدلاني',
      error: error.message
    });
  }
});

// حذف صيدلاني - DELETE /api/pharmacists/:id (محمية)
router.delete('/:id', protect, async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);

    if (!pharmacist) {
      return res.status(404).json({
        success: false,
        message: 'الصيدلاني غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف الصيدلاني بنجاح',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
});

module.exports = router;

