class Pagination {
  limit;
  offset;
  itemsKeyName = "items";
  constructor(_page, _limit, { defaultLimit = 20, itemKeyName }) {
    this.limit = _limit ? +_limit : defaultLimit;
    this.offset = _page ? _page * this.limit : 0;
    this.itemsKeyName = itemKeyName;
  }

  getPagination() {
    return { limit: this.limit, offset: this.offset };
  }

  getPagingData(count, rows) {
    const currentPage = this.offset;
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
