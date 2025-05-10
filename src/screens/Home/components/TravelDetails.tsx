import {Image, ScrollView, Text, Dimensions} from 'react-native';

import {isIos} from '@/utils';
import {styles} from '../styles';
import Modal from '@/components/customModal/Modal';

type TravelDetailsProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedLog: any;
};

const {width} = Dimensions.get('window');

const TravelDetails: React.FC<TravelDetailsProps> = ({
  modalVisible,
  setModalVisible,
  selectedLog,
}) => {
  const normalizedPath = (filePath: string) =>
    isIos
      ? filePath.replace('file://', '') // iOS prefers raw path
      : filePath.startsWith('file://')
      ? filePath
      : `file://${filePath}`;

  return (
    <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
      {selectedLog && (
        <ScrollView>
          <Text style={styles.modalTitle}>{selectedLog.location}</Text>
          <Text style={styles.modalDate}>
            {new Date(selectedLog.createdAt).toLocaleDateString()}
          </Text>
          <Image
            source={{uri: normalizedPath('' + selectedLog.photo)}}
            style={[styles.modalPhoto, {width: width * 0.8}]}
          />
          <Text style={styles.modalNotes}>{selectedLog.notes}</Text>
        </ScrollView>
      )}
    </Modal>
  );
};

export default TravelDetails;
