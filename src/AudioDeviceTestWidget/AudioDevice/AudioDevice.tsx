import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { useDevices } from '../useDevices/useDevices';

const labels = {
  audioinput: {
    audioLevelText: 'Input level',
    deviceLabelHeader: 'Input device',
    headerText: 'Microphone',
  },
  audiooutput: {
    audioLevelText: 'Output level',
    deviceLabelHeader: 'Output device',
    headerText: 'Speaker',
  }
};

const AudioLevelContainer = styled('div')(({ theme}) => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledFormControl = styled(FormControl)(({ theme}) => ({
  margin: '1em 0',
  minWidth: 200,
}));

const DeviceLabelContainer = styled('div')(({ theme }) => ({
  margin: '1em 0',
  '&> *': {
    marginBottom: '0.3em'
  }
}));

interface AudioDeviceProps {
  disabled: boolean;
  level: number;
  kind: 'audioinput' | 'audiooutput';
  onDeviceChange: (value: string) => void;
}

export default function AudioDevice({ disabled, level, kind, onDeviceChange }: AudioDeviceProps) {
  const devices = useDevices().filter(device => device.kind === kind);

  const [selectedDevice, setSelectedDevice] = useState('');

  const { audioLevelText, deviceLabelHeader, headerText } = labels[kind];
  const noAudioRedirect = !Audio.prototype.setSinkId && kind === 'audiooutput';

  const updateSelectedDevice = useCallback((value: string) => {
    onDeviceChange(value);
    setSelectedDevice(value);
  }, [onDeviceChange, setSelectedDevice]);

  useEffect(() => {
    const hasSelectedDevice = devices.some((device) => device.deviceId === selectedDevice);
    if (devices.length && !hasSelectedDevice) {
      updateSelectedDevice(devices[0].deviceId);
    }
  }, [devices, selectedDevice, updateSelectedDevice]);

  return (
    <div style={{ width: 'calc(50% - 1em)', minWidth: '300px', marginBottom: '30px' }}>
      <Typography variant="h5">{headerText}</Typography>

      {noAudioRedirect && (
        <DeviceLabelContainer>
          <Typography variant="subtitle2">{deviceLabelHeader}</Typography>
          <Typography>System Default Audio Output</Typography>
        </DeviceLabelContainer>
      )}

      {!noAudioRedirect && (
        <StyledFormControl disabled={disabled} variant="outlined" fullWidth>
          <InputLabel>{deviceLabelHeader}</InputLabel>
          <Select
            label={deviceLabelHeader}
            value={selectedDevice}
            onChange={e => updateSelectedDevice(e.target.value as string)}
          >
            {devices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      )}

      <AudioLevelContainer>
        <Typography variant="subtitle2" style={{ marginRight: '1em' }}>
          {audioLevelText}:
        </Typography>
        <ProgressBar
          position={level}
          duration={0.1}
          style={{ flex: '1', margin: '0' }}
        />
      </AudioLevelContainer>
    </div>
  );
}
