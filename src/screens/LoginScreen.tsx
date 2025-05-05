import {z} from 'zod';
import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {signIn} from '../services/auth';
import {styles} from '../styles/LoginStyles';
import {AuthCredentials} from '../types/auth';
import {RootStackParamList} from '../types/navigation';
import Input from '../components/inputs/Input';
import Button from '../components/buttons/Button';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const localStyles = StyleSheet.create({
  registerButton: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const credentials: AuthCredentials = {
        email: data.email,
        password: data.password,
      };
      console.log({credentials});

      await signIn(credentials);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
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
            {errors.email && (
              <Text style={localStyles.error}>{errors.email.message}</Text>
            )}
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
            {errors.password && (
              <Text style={localStyles.error}>{errors.password.message}</Text>
            )}
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
        style={localStyles.registerButton}
      />
    </View>
  );
};

export default LoginScreen;
