// accessors
export const getDate = (d) => new Date(d ? d.x : 0);
export const getStockValue = (d) => {

  console.log(d.y);
  return d.y;
};
