import React, { useState } from 'react';
import { Button, Snackbar, styled } from '@mui/material';
import CopyIcon from '@mui/icons-material/FileCopy';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import { TestResults } from '../types';

const SuccessIconWrapper = styled('span')(() => ({
  verticalAlign: 'middle',
  marginRight: '0.5em',
}));

interface CopyResultsWidgetProps {
  results?: TestResults[];
}

export default function CopyResultsWidget({ results }: CopyResultsWidgetProps) {
  const [hasCopied, setHasCopied] = useState(false);

  if (!results) return null;

  const handleCopyResults = () => {
    const text = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(text).then(() => setHasCopied(true));
  };

  return (
    <>
      <Snackbar
        ContentProps={{
          className: '',
          sx: {
            background: 'success.main'
          }
      }}
        message={
          <span>
            <SuccessIconWrapper>
              <SuccessIcon />
            </SuccessIconWrapper>
            Results Copied to Clipboard
          </span>
        }
        open={hasCopied}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
        onClose={() => setHasCopied(false)}
      />
      <Button onClick={handleCopyResults} variant="contained" color="secondary">
        <CopyIcon style={{ marginRight: '0.5em' }} />
        Copy Results
      </Button>
    </>
  );
}
