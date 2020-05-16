export const router = {
  getUrl() {
    const path = location.pathname;
    return path.length > 1 ? path.slice(1) : path;
  },

  getQuery() {
    const query = location.search.slice(1);
    const queryParams = query.split('&');
    const filter = new Set(['all', 'active', 'outdated', 'completed']);

    if (queryParams.length !== 2) {
      return null;
    }

    const filterValue = queryParams[0].split('=');
    const pageCount = queryParams[1].split('=');

    if (filterValue.length !== 2 || pageCount.length !== 2) {
      return null;
    }

    if (filterValue[0] !== 'filter' || !filter.has(filterValue[1])) {
      return null
    }

    if (pageCount[0] !== 'page' || !Number.isInteger(+pageCount[1])) {
      return null
    }

    return {
      filter: filterValue[1],
      page: +pageCount[1]
    }
  }
};
