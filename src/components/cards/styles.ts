import {StyleSheet} from 'react-native';

export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
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
  content: {
    flex: 1,
    marginRight: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#444',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
});
