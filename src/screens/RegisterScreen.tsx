import {z} from 'zod';
import React from 'react';
import {View, Text, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {StackNavigationProp} from '@react-navigation/stack';

import {signUp} from '../services/auth';
import Input from '../components/inputs/Input';
import {styles} from '../styles/RegisterStyles';
import {RegisterCredentials} from '../types/auth';
import Button from '../components/buttons/Button';
import {RootStackParamList} from '../types/navigation';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
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
    <View style={styles.container}>
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
    </View>
  );
};

export default RegisterScreen;
