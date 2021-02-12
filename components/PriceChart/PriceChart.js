import React from 'react';
import styles from './PriceChart.module.scss';

import { LinePath, Line, Bar } from "@vx/shape";
import { scaleTime, scaleLinear } from "@vx/scale";
import { localPoint } from "@vx/event";
import { extent, max, bisector } from "d3-array";
import { appleStock } from "@vx/mock-data";

// Components

// Utility functions

export default function PriceChart({ sales }) {

  const stock = appleStock.slice(800);
  const xSelector = d => new Date(d.date);
  const ySelector = d => d.close;
  const bisectDate = bisector(xSelector).left;

  const width = 900;
  const height = 400;

  const xScale = scaleTime({
    range: [0, width],
    domain: extent(stock, xSelector),
  });

  const yMax = max(stock, ySelector);

  const yScale = scaleLinear({
    range: [height, 0],
    domain: [0, yMax + (yMax / 4)],
  });

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#32deaa" rx={14} />
      <LinePath
        data={stock}
        xScale={xScale}
        yScale={yScale}
        x={xSelector}
        y={ySelector}
        strokeWidth={5}
      />
    </svg>
  )
}
