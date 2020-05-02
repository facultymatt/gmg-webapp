![Graph generating using this project](./readme_images/brisket_cook_2.png)

## Dev Setup

- Install node 12
- Setup and run the `gmg-js` project
- Install this project deps `npm i`
- Configure `.env`
- start `npm start`
- visit `http://localhost:3001/` and see a graph! If you configured it correctly a line graph should appear. If not, check `.env` and try again.

## Adjusting chart

See src/RecentGrillStatusGraph/RecentGrillStatusGraph.jsx and you can add / remove metrics to the graph. The metric name should match the value in database. 

On line 43 you can set the chart yDomain, which is currently 220 `const yDomain = [0, 220];`. Set to `const yDomain = [0, 500];` for example if you are running the grill hot and want to see the grill temp on the chart.

## Adjusting data

See src/contexts/GrillStatusContext.jsx. The most common adjustments will be limit and skip and wheter to record live changes. This can also be set in the `.env` file.