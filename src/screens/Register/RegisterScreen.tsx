import React from 'react';
import {Text, Alert, ScrollView} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles} from './styles';
import {signUp} from '@/services/auth';
import Input from '@/components/inputs/Input';
import {RegisterCredentials} from '@/types/auth';
import Button from '@/components/buttons/Button';
import {RootStackParamList} from '@/types/navigation';
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding';
import {defaultValues, RegisterFormData, registerSchema} from './utils';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const credentials: RegisterCredentials = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      await signUp(credentials);
      navigation.replace('Home');
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoiding>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>

        <Controller
          control={control}
          name="name"
          render={({field: {onChange, value}}) => (
            <>
              <Input
                label="Name"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your name"
                error={errors.name?.message}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({field: {onChange, value}}) => (
            <>
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                error={errors.email?.message}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({field: {onChange, value}}) => (
            <>
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                placeholder="Enter your password"
                error={errors.password?.message}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({field: {onChange, value}}) => (
            <>
              <Input
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
              />
            </>
          )}
        />

        <Button
          title="Register"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
        />

        <Button
          title="Already have an account? Login"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        />
      </ScrollView>
    </KeyboardAvoiding>
  );
};

export default RegisterScreen;
