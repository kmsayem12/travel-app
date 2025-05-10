import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {isIos} from '../../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const KeyboardAvoiding = ({children}: {children: React.ReactNode}) => {
  return (
    <KeyboardAvoidingView
      behavior={isIos ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={isIos ? 64 : 0} // adjust based on header/nav height
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default KeyboardAvoiding;
