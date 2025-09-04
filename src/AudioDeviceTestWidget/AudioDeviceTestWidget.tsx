import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import PlayIcon from '@mui/icons-material/PlayArrow';

import Alert from '../common/Alert/Alert';
import AudioDevice from './AudioDevice/AudioDevice';
import useTestRunner from './useTestRunner/useTestRunner';

const StyledButton = styled(Button)<{ busy?: boolean }>(({ theme, busy }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  marginRight: '1em',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  ...(busy && {
    backgroundColor: `${theme.palette.error.dark} !important`,
    color: '#fff !important',
  }),
}));

const DeviceContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginBottom: '10px',
}));

export default function AudioDeviceTestWidget() {
  const [inputDeviceId, setInputDeviceId] = useState('');
  const [outputDeviceId, setOutputDeviceId] = useState('');
  const previousInputDeviceIdRef = useRef('');

  const {
    error,
    warning,
    inputLevel,
    isRecording,
    isAudioInputTestRunning,
    isAudioOutputTestRunning,
    outputLevel,
    playAudio,
    playbackURI,
    readAudioInput,
    testEnded,
  } = useTestRunner();

  const disableAll = isRecording || isAudioOutputTestRunning || !!error;

  const handleRecordClick = () => {
    readAudioInput({ deviceId: inputDeviceId, enableRecording: true });
  };

  const handlePlayClick = () => {
    playAudio({ deviceId: outputDeviceId, testURI: playbackURI });
  };

  useEffect(() => {
    const newDeviceSelected = previousInputDeviceIdRef.current !== inputDeviceId;
    previousInputDeviceIdRef.current = inputDeviceId;

    // Restarts the test to continuously capture audio input
    if (!error && (newDeviceSelected || (!isRecording && !isAudioInputTestRunning))) {
      readAudioInput({ deviceId: inputDeviceId });
    }
  }, [error, inputDeviceId, isRecording, isAudioInputTestRunning, readAudioInput]);

  return (
    <DeviceContainer>
      <Typography variant="h4" component="p">
        Audio Device Tests
      </Typography>

      {!!error && (
        <Alert variant="error">
          <Typography variant="body1">{error}</Typography>
        </Alert>
      )}

      {!!warning && (
        <Alert variant="warning">
          <Typography variant="body1">{warning}</Typography>
        </Alert>
      )}

      <StyledButton
        disabled={disableAll}
        onClick={handleRecordClick}
        busy={isRecording} // Use the 'busy' prop instead of clsx
        variant="contained"
      >
        <RecordIcon sx={{ marginRight: '0.3em' }} /> {/* Use sx prop for icon styling */}
        {'Record' + (isRecording ? 'ing...' : '')}
      </StyledButton>

      <StyledButton
        disabled={!playbackURI || disableAll}
        onClick={handlePlayClick}
        busy={isAudioOutputTestRunning} // Use the 'busy' prop instead of clsx
        variant="contained"
      >
        <PlayIcon sx={{ marginRight: '0.3em' }} /> {/* Use sx prop for icon styling */}
        {'Play' + (isAudioOutputTestRunning ? 'ing...' : '')}
      </StyledButton>

      <Divider style={{ margin: '1.5em 0' }} />

      {testEnded && !error && !warning && (
        <Alert variant="success">
          <Typography variant="body1">No issues detected</Typography>
        </Alert>
      )}

      <DeviceContainer>
        <AudioDevice disabled={disableAll} kind="audiooutput" level={outputLevel} onDeviceChange={setOutputDeviceId} />
        <AudioDevice disabled={disableAll} kind="audioinput" level={inputLevel} onDeviceChange={setInputDeviceId} />
      </DeviceContainer>
    </DeviceContainer>
  );
}
