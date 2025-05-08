import React from 'react';
import {View, StyleSheet} from 'react-native';

interface StatusDotProps {
  isOnline: boolean;
  size?: number;
}

const StatusDot: React.FC<StatusDotProps> = ({isOnline, size = 8}) => {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: isOnline ? '#4CAF50' : '#bbb',
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    marginLeft: 4,
  },
});

export default StatusDot;
