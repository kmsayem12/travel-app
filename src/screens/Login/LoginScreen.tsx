import React from 'react';
import {Text, Alert, ScrollView} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles} from './styles';
import {signIn} from '@/services/auth';
import {AuthCredentials} from '@/types/auth';
import Input from '@/components/inputs/Input';
import Button from '@/components/buttons/Button';
import {RootStackParamList} from '@/types/navigation';
import {defaultValues, LoginFormData, loginSchema} from './utils';
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const credentials: AuthCredentials = {
        email: data.email,
        password: data.password,
      };
      await signIn(credentials);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoiding>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome Back</Text>
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

        <Button
          title="Login"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
        />

        <Button
          title="Don't have an account? Sign up"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        />
      </ScrollView>
    </KeyboardAvoiding>
  );
};

export default LoginScreen;
