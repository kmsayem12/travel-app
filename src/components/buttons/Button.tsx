import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

import {buttonStyles} from './styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return buttonStyles.secondaryButton;
      case 'outline':
        return buttonStyles.outlineButton;
      case 'danger':
        return buttonStyles.dangerButton;
      default:
        return buttonStyles.primaryButton;
    }
  };

  const getTextStyle = () => {
    return variant === 'outline'
      ? buttonStyles.outlineButtonText
      : buttonStyles.buttonText;
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        (disabled || loading) && buttonStyles.disabledButton,
        style,
      ]}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#0066cc' : '#fff'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
