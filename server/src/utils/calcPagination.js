/**
 * 페이징 처리를 위한 계산
 * @param {*} category
 * @param {*} limit
 * @param {*} page
 * @returns 계산 결과
 */
const calcPagination = async (total, limit, page) => {
  try {
    // 전체 페이지 수 계산
    const totalPages = Math.ceil(total / limit);

    // 현재 페이지
    const currentPage = parseInt(page);

    // 페이징 시작 숫자 계산
    //  페이징 UI를 구성 -> 현재 페이지를 중심으로 좌우로 5개의 페이지 링크
    const startPage = Math.max(1, currentPage - 5);

    // 페이징 끝 숫자 계산
    const endPage = Math.min(startPage + 9, totalPages);

    // 이전 페이지 및 다음 페이지 계산
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      pagination: {
        total,
        totalPages,
        currentPage,
        startPage,
        endPage,
        prevPage,
        nextPage,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    throw Error(err);
  }
};

module.exports = calcPagination;
