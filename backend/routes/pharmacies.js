const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const { protect } = require('../middleware/auth');

// الحصول على جميع الصيدليات - GET /api/pharmacies
router.get('/', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
});

// الحصول على الصيدليات المناوبة - GET /api/pharmacies/on-duty
router.get('/on-duty', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isOnDuty: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
});

// الحصول على صيدلية واحدة - GET /api/pharmacies/:id
router.get('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'الصيدلية غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
});

// إنشاء صيدلية جديدة - POST /api/pharmacies (محمية)
router.post('/', protect, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);

    res.status(201).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'فشل في إنشاء الصيدلية',
      error: error.message
    });
  }
});

// تحديث صيدلية - PUT /api/pharmacies/:id (محمية)
router.put('/:id', protect, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'الصيدلية غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'فشل في تحديث الصيدلية',
      error: error.message
    });
  }
});

// حذف صيدلية - DELETE /api/pharmacies/:id (محمية)
router.delete('/:id', protect, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'الصيدلية غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف الصيدلية بنجاح',
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

