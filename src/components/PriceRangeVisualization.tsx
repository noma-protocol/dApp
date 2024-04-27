import React, { useState } from 'react';
import { Text } from '@chakra-ui/react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { scaleLinear } from '@visx/scale';
import { Tooltip, useTooltip } from '@visx/tooltip';
import { commify } from '../utils.tsx';
// import { ChartToolTip } from './ChartToolTip';

const PriceRangeVisualization = ({ data, width, height }) => {
  // Tooltip setup
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  // Define margins
  const margin = { top: 20, bottom: 50, left: 0, right: 0 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Create scales for the x-axis
  const priceScale = scaleLinear({
    domain: [
      Math.min(...data.map(d => parseFloat(d.priceLower))),
      Math.max(...data.map(d => parseFloat(d.priceUpper))),
    ],
    range: [0, xMax],
    nice: true,
  });

  // Define the bar heights manually based on your requirements
  // and the colors for each rectangle
  const barProperties = {
    'Floor': { height: yMax, color: '#2276b2', width: 4 }, // Slightly wider width for "Floor"
    'Anchor': { height: 50, color: '#800080' }, // Purple color for "Anchor"
    'Discovery': { height: 100, color: '#2276b2' },
  };

 // Define the colors and heights for each type of liquidity
 const barAttributes = {
  'Floor': { height: 4, color: '#2276b2' }, // A fixed height for the "Floor" to make it visible
  'Anchor': { height: 50, color: '#800080' }, // Purple color for "Anchor"
  'Discovery': { height: 100, color: '#2276b2' }, // Blue color for "Discovery"
};

// We calculate the starting Y position of the first bar (from the bottom up)
// For "Floor" we start at yMax minus its height to place it at the bottom
const startingYPosition = {
  'Floor': yMax - barAttributes['Floor'].height,
  'Anchor': yMax - barAttributes['Floor'].height - barAttributes['Anchor'].height, // Above "Floor"
  'Discovery': yMax - barAttributes['Floor'].height - barAttributes['Anchor'].height - barAttributes['Discovery'].height, // Above "Anchor"
};
  return (
    <div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {data.map((d, index) => {
            const x0 = priceScale(parseFloat(d.priceLower));
            const x1 = priceScale(parseFloat(d.priceUpper));
            const barWidth = d.name === 'Floor' ? barProperties['Floor'].width : Math.max(2, x1 - x0);
            const { height, color } = barProperties[d.name];

            return (
              <Bar
                key={`bar-${index}`}
                x={x0}
                y={yMax - height} // Position y based on the height of the bar
                width={barWidth}
                height={height}
                fill={color}
                onMouseLeave={hideTooltip}
                onMouseMove={(event) => {
                  const tooltipData = {
                    name: d.name,
                    amount0: d.amount0,
                    amount1: d.amount1,
                    priceLower: d.priceLower,
                    priceUpper: d.priceUpper,
                  };
                  showTooltip({
                    tooltipData,
                    tooltipLeft: x0 + barWidth / 4,
                    tooltipTop: yMax + (yMax / 4) - height / 4,
                  });
                }}
              />
            );
          })}
          {/* Render the Axis */}
          <AxisBottom
            top={yMax}
            scale={priceScale}
            numTicks={width > 520 ? 10 : 5}
            stroke={'#ffffff'}
            tickStroke={'#ffffff'}
            tickLabelProps={() => ({
              fill: '#ffffff',
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && (
        <Tooltip left={tooltipLeft} top={tooltipTop}>
          <div>
            <strong>{tooltipData.name}</strong>
            <br />
            <Text fontSize="8px" fontWeight="bold"> {tooltipData.name} </Text>
            <br />
            Amount0: {commify(tooltipData.amount0)}
            <br />
            Amount1: {commify(tooltipData.amount1)}
            <br />
            Price Range: {tooltipData.priceLower} - {tooltipData.priceUpper}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default PriceRangeVisualization;
