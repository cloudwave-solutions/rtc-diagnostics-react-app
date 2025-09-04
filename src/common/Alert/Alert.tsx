import React from 'react';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import WarningIcon from '@mui/icons-material/ReportProblemOutlined';
import { darken, lighten, styled } from '@mui/material/styles';

const AlertContainer = styled('div')<{ variant: 'success' | 'warning' | 'error' }>(({ theme, variant }) => {
  const getBackgroundColor = theme.palette.mode === 'light' ? lighten : darken;

  let backgroundColor, iconColor;
  switch (variant) {
    case 'success':
      backgroundColor = getBackgroundColor(theme.palette.success.main, 0.9);
      iconColor = theme.palette.success.main;
      break;
    case 'warning':
      backgroundColor = getBackgroundColor(theme.palette.warning.main, 0.9);
      iconColor = theme.palette.warning.main;
      break;
    case 'error':
      backgroundColor = getBackgroundColor(theme.palette.error.main, 0.9);
      iconColor = theme.palette.error.main;
      break;
    default:
      backgroundColor = 'transparent';
      iconColor = 'inherit';
  }

  return {
    display: 'flex',
    padding: '0.85em',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: backgroundColor,
    '&:not(:last-child)': {
      marginBottom: '0.8em',
    },
    '& svg': {
      margin: '0 0.6em 0 0.3em',
      padding: '1px',
      fill: iconColor,
    },
  };
});

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

type AlertProps = {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error';
};

export default function Alert({ variant, children }: AlertProps) {
  return (
    <AlertContainer variant={variant}>
      {variant === 'success' && <CheckIcon />}
      {variant === 'warning' && <WarningIcon />}
      {variant === 'error' && <ErrorIcon />}
      <ContentContainer>{children}</ContentContainer>
    </AlertContainer>
  );
}
