
const sortSalesByType = (sales, finishes) => {
  if (sales.length > 0) {
    let typeRecord = {};
    sales.forEach(sale => {
      // Determine finish: 'non-holo', 'reverse_holo', 'holo'
      let finish = !!finishes && finishes.length > 0 ? finishes[0] : determineFinish(sale.title);
      typeRecord[finish] = typeRecord[finish] || {};

      let finishRef = typeRecord[finish];

      if (sale.grading_authority && sale.grade) { // is a graded card
        // Ex. typeRecord.non-holo.PSA.10 = [all_psa_10_sales_for_regular_finish]
        finishRef[sale.grading_authority] = finishRef[sale.grading_authority] || {};
        finishRef[sale.grading_authority][sale.grade] = finishRef[sale.grading_authority][sale.grade] || [];
        finishRef[sale.grading_authority][sale.grade].push(sale);
      } else { // is ungraded
        finishRef.ungraded = finishRef.ungraded || [];
        finishRef.ungraded.push(sale);
      }
    })

    return typeRecord;
  } else {
    return [];
  }
}

// Finishes - non-holo, reverse_holo, holo
// Note that finishes are NOT rarity. They simply relate to the finish of the card.
const determineFinish = (title) => {
  let finish = 'non-holo';
  title = title.toLowerCase();
  // First check for "reverse holo"
  if (title.includes('reverse')) {
    finish = 'reverse_holo';
  } else if (title.includes('holo') || title.includes('foil')) {
    finish = 'holo';
  }

  return finish;
}

export { sortSalesByType, determineFinish }
