import React, {ReactNode} from 'react';
import {Modal, View, ViewStyle} from 'react-native';

import {styles} from './styles';
import CustomButton from '../buttons/Button';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: ViewStyle;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  contentStyle,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={[styles.content, contentStyle]}>
          <CustomButton
            title="×"
            variant="outline"
            onPress={onClose}
            style={styles.closeButton}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
