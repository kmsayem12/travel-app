import React from 'react';
import {View, Text, TextInput, TextInputProps} from 'react-native';

import {inputStyles} from '../../styles/components/InputStyles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({label, error, style, ...props}) => {
  return (
    <View style={inputStyles.container}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <TextInput
        style={[inputStyles.input, error && inputStyles.inputError, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={inputStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;
