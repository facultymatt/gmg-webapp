const HOST = window.location.hostname;
const PORT = 3000;
const IP = `${HOST}:${PORT}`;

// power
export const ON = `http://${IP}/command/power/on`;
export const ON_COLD_SMOKE = `http://${IP}/command/power/cold-smoke`;
export const OFF = `http://${IP}/command/power/off`;

// settings
export const PIZZA_MODE_ON = `http://${IP}/command/settings/pizza`;
export const PIZZA_MODE_OFF = `http://${IP}/command/settings/regular`;

// temperature
export const GRILL_TEMP = `http://${IP}/command/temp/grill`;
export const GRILL_PROBE1 = `http://${IP}/command/temp/probe1`;
export const GRILL_PROBE2 = `http://${IP}/command/temp/probe2`;
