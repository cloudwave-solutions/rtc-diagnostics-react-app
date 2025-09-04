import React, { useRef, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const Container = styled('div')(() => ({
  position: 'relative',
  margin: '1em',
  height: '4px',
  '& div': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
}));

const ProgressBarElement = styled('div')<{ position: number }>(({ theme, position }) => ({
  background: theme.palette.secondary.main,
  right: `${100 - position}%`, // Set initial position
  transition: 'right 0s linear', // Initial transition (will be updated in useEffect)
}));

const Background = styled('div')(({ theme }) => ({
  right: 0,
  background: alpha(theme.palette.secondary.main, 0.2),
}));

interface ProgressBarProps {
  duration: number;
  position: number;
  style?: { [key: string]: string };
}

export default function ProgressBar({ duration, position, style }: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = progressBarRef.current;
    if (el) {
      window.requestAnimationFrame(() => {
        // We set these values asynchronously so that the browser can recognize the change in the 'right' value.
        // Without this, the progress bar would instantly snap to the designated position.
        el.style.transition = `right ${duration}s linear`;
        el.style.right = `${String(100 - position)}%`;
      });
    }
  }, [duration, position]);

  return (
    <Container style={{...style}}>
      <ProgressBarElement
        ref={progressBarRef}
        position={position}
      />
      <Background />
    </Container>
  );
}
