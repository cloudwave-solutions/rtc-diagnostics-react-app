import React from 'react';
import { Call } from '@twilio/voice-sdk';
import { styled } from '@mui/material/styles';
import { Typography, Tooltip } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { codecNameMap, edgeNameMap } from '../../utils';

import { BITRATE_TEST_DURATION } from '../Tests/Tests';
import ResultIcon from '../../ResultWidget/ResultIcon/ResultIcon';
import getTooltipContent from './getTooltipContent';
import { NetworkTestName, Edge, TestResults } from '../../types';

const Container = styled('div')<{ isPending?: boolean }>(({ isPending }) => ({
  border: '1px solid #ddd',
  borderRadius: '3px',
  display: 'flex',
  padding: '0.8em',
  background: '#eee',
  alignItems: 'center',
  margin: '1em 0',
  justifyContent: 'space-between',
  ...(isPending && {
    opacity: 0.5,
  }),
}));

const ProgressContainer = styled('div')(() => ({
  flex: 1,
  padding: '0 1em',
}));

const EdgeLabel = styled(Typography)(() => ({
  minWidth: '170px',
  width: '15%',
  whiteSpace: 'nowrap',
})) as typeof Typography;

const IconContainer = styled('div')(() => ({
  width: '15%',
  display: 'flex',
  justifyContent: 'flex-end',
  '& svg': {
    margin: '0 0.3em',
  },
}));

interface EdgeResultProps {
  codecPreferences: Call.Codec[];
  edge: Edge;
  isActive: boolean;
  result?: TestResults;
  activeTest?: NetworkTestName;
}

const progressBarTimings = {
  'Preflight Test': {
    position: 62.5,
    duration: 25,
  },
  'Bitrate Test': {
    position: 100,
    duration: BITRATE_TEST_DURATION / 1000,
  },
};

export default function EdgeResult(props: EdgeResultProps) {
  const { codecPreferences, edge, isActive, result, activeTest } = props;

  const progressDuration = activeTest ? progressBarTimings[activeTest].duration : 0;
  const progressPosition = activeTest ? progressBarTimings[activeTest].position : 0;

  const codecLabel = codecPreferences.map((codec) => codecNameMap[codec]).join(', ');

  const isPending = !isActive && !result;

  return (
    <Container isPending={isPending}>
      <EdgeLabel>{`${edgeNameMap[edge]} (${codecLabel})`}</EdgeLabel>
      <ProgressContainer>
        {isActive && <ProgressBar position={progressPosition} duration={progressDuration} />}
      </ProgressContainer>
      {result && (
        <IconContainer>
          <ResultIcon result={result} />
          <Tooltip title={getTooltipContent(result)} placement="top" disableInteractive={false}>
            <InfoIcon />
          </Tooltip>
        </IconContainer>
      )}
    </Container>
  );
}
