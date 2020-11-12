// accessors
export const getDate = (d) => new Date(d ? d.x : 0);
export const getY = (d) => d.y;
export const getDateFromArray = (d) => new Date(d ? d[0] : 0);
export const getYFromArray = (d) => d[1];
