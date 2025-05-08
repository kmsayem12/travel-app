import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatButton: {
    padding: 8,
    backgroundColor: '#0066cc',
    borderRadius: 8,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  map: {
    height: '40%',
  },
  logsList: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  logsContent: {
    padding: 10,
  },
  logItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logContent: {
    flex: 1,
    marginRight: 10,
  },
  logLocation: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  logDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  logNotes: {
    fontSize: 14,
    color: '#444',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  photoScroll: {
    marginBottom: 15,
  },
  modalPhoto: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  modalNotes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
