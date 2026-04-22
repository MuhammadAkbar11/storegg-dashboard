class Pagination {
  page;
  limit;
  offset;
  itemsKeyName = "items";
  constructor(_page, _limit, { defaultLimit = 20, itemKeyName }) {
    this.limit = _limit ? +_limit : defaultLimit;
    this.page = _page;
    this.offset = _page ? (_page - 1) * this.limit : 0;
    this.itemsKeyName = itemKeyName;
  }

  getPagination() {
    return { limit: this.limit, offset: this.offset };
  }

  getPagingData(count, rows) {
    const currentPage = this.page;
    const totalPages = Math.ceil(count / this.limit);

    return {
      totalItems: count,
      [this.itemsKeyName]: rows,
      totalPages,
      currentPage,
    };
  }
}

export default Pagination;
