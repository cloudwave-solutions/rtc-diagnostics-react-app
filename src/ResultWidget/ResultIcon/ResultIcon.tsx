import React from 'react';
import { styled } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/ReportProblemOutlined';
import { TestResults } from '../../types';
import { rows } from '../rows';

const StyledCloseIcon = styled(CloseIcon)(({ theme }) => ({
  fill: theme.palette.error.main,
}));

const StyledWarningIcon = styled(WarningIcon)(({ theme }) => ({
  fill: theme.palette.warning.main,
}));

const StyledCheckIcon = styled(CheckIcon)(({ theme }) => ({
  fill: theme.palette.success.main,
}));

interface ResultIconProps {
  result?: TestResults;
}

export default function ResultIcon(props: ResultIconProps) {
  const result = props.result;
  const hasError = Object.values(result?.errors ?? {}).length > 0;
  const hasWarning = result && rows.some((row) => row.getWarning?.(result));

  return (
    <>
      {hasError && <StyledCloseIcon />}
      {!hasError && hasWarning && <StyledWarningIcon />}
      {!hasError && !hasWarning && <StyledCheckIcon />}
    </>
  );
}
