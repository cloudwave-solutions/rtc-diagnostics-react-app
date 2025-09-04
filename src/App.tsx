import React, { useState } from 'react';
import { getLogger } from 'loglevel';
import { styled } from '@mui/material/styles';
import { AppBar, Grid, Container, Toolbar, Paper, CssBaseline, Typography } from '@mui/material';
import AudioDeviceTestWidget from './AudioDeviceTestWidget/AudioDeviceTestWidget';
import BrowserCompatibilityWidget from './BrowserCompatibilityWidget/BrowserCompatibilityWidget';
import CopyResultsWidget from './CopyResultsWidget/CopyResultsWidget';
import { Device } from '@twilio/voice-sdk';
import { getJSON } from './utils';
import { APP_NAME, LOG_LEVEL } from './constants';
import NetworkTestWidget from './NetworkTestWidget/NetworkTestWidget';
import ResultWidget from './ResultWidget/ResultWidget';
import SummaryWidget from './SummaryWidget/SummaryWidget';

const log = getLogger(APP_NAME);
log.setLevel(LOG_LEVEL);

const StyledContainer = styled(Container)(() => ({
  marginTop: '2em',
}));

const StyledPaper = styled(Paper)(() => ({
  padding: '1.5em',
}));

const TableHeader = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1em',
}));

function App() {

  const [results, setResults] = useState();

  function getTURNCredentials() {
    return getJSON('app/turn-credentials').then((res) => res.iceServers as RTCIceServer[]);
  }

  function getVoiceToken() {
    return getJSON('app/token').then((res) => res.token as string);
  }

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img src="../public/twilio-logo.png" style={{ maxHeight: '64px' }} alt="Logo"></img>
        </Toolbar>
      </AppBar>
      <StyledContainer>
        <Grid container spacing={3} component="div">
          {!Device.isSupported && (
            <Grid size={{ xs: 12 }} component="div">
              <BrowserCompatibilityWidget />
            </Grid>
          )}
          {Device.isSupported && (
            <>
              <Grid size={{ xs: 12 }} component="div">
                <StyledPaper elevation={3}>
                  <AudioDeviceTestWidget />
                </StyledPaper>
              </Grid>
              <Grid size={{ xs: 12 }} component="div">
                <StyledPaper elevation={3}>
                  <NetworkTestWidget
                    getVoiceToken={getVoiceToken}
                    getTURNCredentials={getTURNCredentials}
                    onComplete={(res) => setResults(res)}
                  />
                  <SummaryWidget results={results} />
                </StyledPaper>
              </Grid>
              <Grid size={{ xs: 12 }} component="div">
                <Paper elevation={3}>
                  {results && (
                    <TableHeader>
                      <Typography variant="h5">Test Results:</Typography>
                      <CopyResultsWidget results={results} />
                    </TableHeader>
                  )}
                  <ResultWidget results={results} />
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </StyledContainer>
    </div>
  );
}

export default App;
