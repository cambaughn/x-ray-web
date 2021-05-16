import { getDates, getWeeks, formatWeekLabel } from './date';
import { flatten } from './array';

const sortSalesByType = (sales = [], finishes) => {
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
const determineFinish = (title = '') => {
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


// Build up the average costs, chart labels, etc.
const formatSalesForChart = (sales = []) => {
   // Map out the last 12 weeks as days
   let data = getDates(84);

   // Create sales lookup object to easily get sales for day
   let salesLookup = {};
   sales.forEach(sale => {
     let key = `${sale.date.getMonth()}-${sale.date.getDate()}`;
     salesLookup[key] = salesLookup[key] || [];
     salesLookup[key].push(sale.price);
   })

   // Convert dates into useful data objects with date[object] and sales[array]
   data = data.map(date => {
     let key = `${date.getMonth()}-${date.getDate()}`;
     let sales = salesLookup[key] || null;
     return { date, sales }
   })
   .filter(day => !!day.sales)

   // Slice data into weeks
   let weeks = getWeeks(12).map(week => {
     return { weekStart: week, sales: [] }
   })

   weeks.forEach((week, index) => {
     let nextWeek = weeks[index + 1] || null;

     if (nextWeek) {
       for (let i = 0; i < data.length; i) {
         let day = data[i];

        if (day.date >= week.weekStart && day.date < nextWeek.weekStart) {
          week.sales.push(data.splice(i, 1)[0].sales)
        } else {
          i++;
        }
       }

     }
   })

   let prevWeekPrice = 0;

   let formattedWeeks = weeks.map((week, index) => {
     if (weeks[index + 1]) {
       let label = formatWeekLabel(week.weekStart, weeks[index + 1].weekStart);
       let sales = flatten(week.sales);

       let total = sales.reduce((a, b) => {
         return a + b;
       }, 0);

       // Determine average
       let avg = total / sales.length;
       avg = Math.round((avg + Number.EPSILON) * 100) / 100;
       let averagePrice = avg || prevWeekPrice;
       prevWeekPrice = averagePrice;

       return { label, sales, total, averagePrice }
     }

     return null;
   })
   .filter(week => !!week)

   return formattedWeeks;
}


export { sortSalesByType, determineFinish, formatSalesForChart }
