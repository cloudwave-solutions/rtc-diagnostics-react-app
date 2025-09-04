import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
  Theme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import ResultIcon from './ResultIcon/ResultIcon';
import { getBestEdge, getEdgeName } from '../utils';
import { TestWarnings, TestResults } from '../types';
import { alpha, darken, lighten, styled, useTheme } from '@mui/material/styles';
import { rows } from './rows';

const getBackgroundColor = (theme: Theme, color: string, coefficient: number) =>
  theme.palette.mode === 'light' ? lighten(color, coefficient) : darken(color, coefficient);

const StyledTable = styled(Table)<{ theme?: Theme }>(({ theme }) => ({
  tableLayout: 'fixed',
  borderTop: `1px solid ${theme?.palette.divider}`,
  '& td, & th': {
    width: '260px',
    borderRight: `1px solid ${
      theme?.palette.mode === 'light'
        ? lighten(alpha(theme?.palette.divider || '#000', 1), 0.88)
        : darken(alpha(theme?.palette.divider || '#000', 1), 0.68)
    }`,
  },
  '& td:last-child, & th:last-child': {
    borderRight: 'none',
  },
  '& th, & td:first-child': {
    fontWeight: 'bold',
  },
}));

const StyledDivTableCellContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  wordBreak: 'break-word',
  '& svg': {
    fill: '#000',
  },
}));

const StyledDivHeaderContent = styled('div')(({ theme }) => ({
  display: 'flex',
  '& p': {
    fontWeight: 'bold',
    marginLeft: '12px',
  },
}));

const getTableCellClassName = (
  theme: Theme,
  isBestEdge: boolean,
  warning?: TestWarnings
): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {};

  if (warning === TestWarnings.warn) {
    return {
      ...baseStyles,
      background: getBackgroundColor(theme, theme.palette.warning.main, 0.9),
    };
  }

  if (warning === TestWarnings.error) {
    return {
      ...baseStyles,
      background: getBackgroundColor(theme, theme.palette.error.main, 0.9),
    };
  }

  if (isBestEdge) {
    return {
      ...baseStyles,
      background: getBackgroundColor(theme, theme.palette.success.main, 0.9),
    };
  }

  return baseStyles;
};

export default function ResultWidget(props: { results?: TestResults[] }) {
  const { results } = props;
  const theme = useTheme();

  if (!results) return null;

  const bestEdge = getBestEdge(results);

  return (
    <TableContainer component={Paper}>
      {}
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {results.map((result) => {
              const isBestEdge = !!bestEdge && bestEdge.edge === result.edge;
              const cellStyle = getTableCellClassName(
                theme,
                isBestEdge
              );

              const edgeName = getEdgeName(result) + (isBestEdge && results.length > 1 ? ' (Recommended)' : '');
              return (
                <TableCell
                  key={result.edge}
                  sx={cellStyle}
                >
                  {}
                  <StyledDivHeaderContent>
                    <ResultIcon result={result} />
                    <Typography>{edgeName}</Typography>
                  </StyledDivHeaderContent>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const tooltipTitle = row.tooltipContent?.label;
            return (
              <TableRow key={row.label}>
                <TableCell>
                  {}
                  <StyledDivTableCellContent>
                    {row.label}
                    {tooltipTitle && (
                      <Tooltip title={tooltipTitle} placement="top" disableInteractive={false} leaveDelay={250}>
                        <InfoIcon />
                      </Tooltip>
                    )}
                  </StyledDivTableCellContent>
                </TableCell>
                {results.map((result) => {
                  const value = row.getValue(result);
                  const warning = row.getWarning?.(result);
                  const isBestEdge = !!bestEdge && bestEdge.edge === result.edge;
                  const cellStyle = getTableCellClassName(
                    theme,
                    isBestEdge,
                    warning
                  );

                  const tooltipContent = warning ? row.tooltipContent?.[warning] : null;

                  return (
                    <TableCell
                      key={result.edge}
                      sx={cellStyle}
                    >
                      {}
                      <StyledDivTableCellContent>
                        {value}
                        {tooltipContent && (
                          <Tooltip title={tooltipContent} placement="top" disableInteractive={false} leaveDelay={250}>
                            <InfoIcon />
                          </Tooltip>
                        )}
                      </StyledDivTableCellContent>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}