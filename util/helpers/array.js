import { isSpecialCard, isBaseOrBase2 } from './string';

const flatten = (array) => {
  return Array.prototype.concat(...array);
}

// Sort by: view_count, base set, full art, ex/gx/vmax etc.
const sortSearchResults = (results) => {
  let sorted = results.sort((a, b) => {
    // Set the view count to avoid undefined errors
    a.view_count = a.view_count || 0;
    b.view_count = b.view_count || 0;
    let aBase = isBaseOrBase2(a.set_name);
    let bBase = isBaseOrBase2(b.set_name);
    let aSpecial = isSpecialCard(a.name) ? 1 : 0;
    let bSpecial = isSpecialCard(b.name) ? 1 : 0;

    // First sort by view count
    if (a.view_count > 0 || b.view_count > 0) {
      return a.view_count > b.view_count ? -1 : 1;
    } else if (aBase || bBase) {
      return aBase ? -1 : 1;
    } else if (aSpecial || bSpecial) {
      return bSpecial - aSpecial;
    }
    return 0;
  })

  return sorted;
}

export { flatten, sortSearchResults }
