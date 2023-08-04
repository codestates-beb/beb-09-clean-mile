/**
 * 스키마에 저장할 때 한국 시간으로 저장하기 위한 함수
 * @returns {Date} 한국 시간을 반환합니다.
 */
const getKorDate = () => {
  const koreanOffset = 9 * 60; // 한국은 UTC+9
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreanTime = new Date(utc + koreanOffset * 60 * 1000);
  return koreanTime;
};

/**
 * 정규 표현식 특수문자 처리
 * @param {string} str
 * @returns
 */
const escapeRegexChars = (str) => {
  const specialCharsPattern = /[-\/\\^$*+?.()|[\]{}]/g;
  return str.replace(specialCharsPattern, '\\$&');
};

module.exports = { getKorDate, escapeRegexChars };
