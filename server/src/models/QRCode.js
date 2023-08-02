const mongoose = require('mongoose');
const { getKorDate } = require('../utils/common');

/**
 * QRCode Collection Schema
 */
const qrCodeSchema = new mongoose.Schema({
  event_id: {
    // 이벤트 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
  },
  isActive: {
    // QRCode 활성화 여부
    type: Boolean,
  },
  token: {
    // QRCode 토큰
    type: String,
  },
  last_scanned_at: {
    // 마지막 스캔 시간
    type: Date,
  },
  created_at: {
    // QRCode 생성일
    type: Date,
    default: getKorDate,
  },
});

const QRCode = mongoose.model('qrCode', qrCodeSchema);
module.exports = QRCode;
