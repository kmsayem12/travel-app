import React, {ReactNode} from 'react';
import {Modal, View, ViewStyle} from 'react-native';

import CustomButton from '../buttons/Button';
import {modalStyles} from '../../styles/components/ModalStyles';

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
      <View style={modalStyles.container}>
        <View style={[modalStyles.content, contentStyle]}>
          <CustomButton
            title="×"
            variant="outline"
            onPress={onClose}
            style={modalStyles.closeButton}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
