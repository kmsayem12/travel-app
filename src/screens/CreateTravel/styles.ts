import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  notesInput: {
    height: 100,
  },
  photoSection: {
    marginBottom: 15,
  },
  photoButtons: {
    flex: 0.48,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButton: {
    padding: 12,
    flex: 0.48,
  },
  photoPreview: {
    flexGrow: 0,
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  submitButton: {
    padding: 15,
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
