import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import {TravelLog} from '../../types/travel';
import {cardStyles} from '../../styles/components/CardStyles';

interface CardProps {
  log: TravelLog;
  onPress: (log: TravelLog) => void;
}

const Card: React.FC<CardProps> = ({log, onPress}) => {
  return (
    <TouchableOpacity
      style={cardStyles.container}
      onPress={() => onPress(log)}
      activeOpacity={0.7}>
      <View style={cardStyles.content}>
        <Text style={cardStyles.location}>{log.location}</Text>
        <Text style={cardStyles.date}>
          {new Date(log.createdAt).toLocaleDateString()}
        </Text>
        <Text style={cardStyles.notes} numberOfLines={1}>
          {log.notes}
        </Text>
      </View>
      <Image source={{uri: log.photo}} style={cardStyles.thumbnail} />
    </TouchableOpacity>
  );
};

export default Card;
