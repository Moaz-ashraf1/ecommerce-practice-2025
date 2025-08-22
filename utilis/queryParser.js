// price[gte]=109.95
// price: { $gte:109.95}

const parseQuery = (query) => {
  const mongooseQuery = {}; // {}
  const operators = ["gte", "gt", "lte", "lt", "eq", "ne", "in", "nin"];

  for (const key in query) {
    const match = key.match(/(\w+)\[(\w+)\]/); // ['price[ge]', 'price', 'gte' ]
    if (match) {
      const field = match[1];
      const operator = match[2];

      if (operators.includes(operator)) {
        if (!mongooseQuery[field]) {
          mongooseQuery[field] = {}; // price: { }
        }

        let value = query[key];
        if (!isNaN(value)) {
          value = Number(value);
        } else if (operator === "in" || operator === "nin") {
          //?category[in]=electronics,clothing,phones
          value = value.split(","); //['electronics', 'clothing', 'phones' ]
        }
        mongooseQuery[field][`$${operator}`] = value; // price: { $gte:109.95 }
      }
    } else {
      mongooseQuery[key] = query[key];
    }
  }

  return mongooseQuery;
};

module.exports = parseQuery;
