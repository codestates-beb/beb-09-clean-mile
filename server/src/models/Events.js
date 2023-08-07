const mongoose = require('mongoose');
const eventHostSchema = require('./EventHosts');
const { getKorDate } = require('../utils/common');

/**
 * Events Collection Schema
 */
const eventSchema = new mongoose.Schema({
  title: {
    // 이벤트명
    type: String,
    required: true,
  },
  host_id: {
    // 주최측 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventHost',
  },
  poster_url: {
    // 포스터 이미지 URL
    type: Array,
  },
  content: {
    // 이벤트 내용
    type: String,
  },
  location: {
    // 개최지 (도, 특별시 단위)
    type: String,
  },
  capacity: {
    // 모집 인원
    type: Number,
    required: true,
  },
  remaining: {
    // 남은 인원
    type: Number,
    required: true,
  },
  status: {
    // 이벤트 진행 상태
    type: String,
    enum: ['created', 'recruiting', 'progressing', 'finished', 'canceled'],
    default: 'created',
  },
  event_type: {
    // 이벤트 타입
    // 선착순(fcfs), 추첨
    type: String,
    enum: ['fcfs', 'random'],
  },
  recruitment_start_at: {
    // 모집 시작일
    type: Date,
  },
  recruitment_end_at: {
    // 모집 마감일
    type: Date,
  },
  event_start_at: {
    // 이벤트 시작일
    type: Date,
  },
  event_end_at: {
    // 이벤트 종료일
    type: Date,
  },
  view: {
    count: {
      // 조회수
      type: Number,
      default: 0,
    },
    viewers: {
      // 조회자
      type: Array,
    },
  },
  created_at: {
    // 이벤트 생성일
    type: Date,
    default: getKorDate,
  },
  updated_at: {
    // 이벤트 정보 수정일
    type: Date,
    default: getKorDate,
  },
});

const Events = mongoose.model('event', eventSchema);
module.exports = Events;
