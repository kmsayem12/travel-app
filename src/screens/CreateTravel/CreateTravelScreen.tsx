import React, {useState} from 'react';
import {View, Text, ScrollView, Image, Alert} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  CreateTravelFormData,
  createTravelSchema,
  defaultValues,
  requestCameraPermission,
} from './utils';
import Input from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import {styles} from '../../styles/CreateTravelStyles';
import {RootStackParamList} from '../../types/navigation';
import {createTravelLog, uploadPhoto} from '../../services/travel';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import KeyboardAvoiding from '../../components/common/KeyboardAvoiding';

type CreateTravelScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateTravel'
>;

interface CreateTravelScreenProps {
  navigation: CreateTravelScreenNavigationProp;
}

const CreateTravelScreen: React.FC<CreateTravelScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string>('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<CreateTravelFormData>({
    resolver: zodResolver(createTravelSchema),
    defaultValues,
  });

  const handleImagePick = async (useCamera: boolean) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Camera access is required.');
      return;
    }

    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.7 as const,
      saveToPhotos: false,
    };

    try {
      const result: ImagePickerResponse = useCamera
        ? await launchCamera(options)
        : await launchImageLibrary({...options, selectionLimit: 1});

      if (result.assets && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        setPhoto(uri);
        setValue('photo', uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const onSubmit = async (data: CreateTravelFormData) => {
    try {
      setLoading(true);
      const photoUrls = await uploadPhoto(photo);

      const travelLogData: CreateTravelFormData = {
        location: data.location,
        photo: photoUrls,
        notes: data.notes,
      };
      await createTravelLog(travelLogData);
      Alert.alert('Success', 'Travel created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <KeyboardAvoiding>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="location"
          render={({field: {onChange, value}}) => (
            <>
              <Input
                label="Location"
                value={value}
                onChangeText={onChange}
                placeholder="Enter location name"
                error={errors.location?.message}
              />
            </>
          )}
        />
        <Text style={styles.label}>Photos</Text>
        <View style={styles.photoSection}>
          <View style={styles.photoButtons}>
            <Button
              title="Pick from Gallery"
              variant="primary"
              onPress={() => handleImagePick(false)}
              style={styles.photoButton}
            />
            <Button
              title="Take Photo"
              variant="primary"
              onPress={() => handleImagePick(true)}
              style={styles.photoButton}
            />
          </View>
          {errors.photo && (
            <Text style={styles.error}>{errors.photo.message}</Text>
          )}
        </View>

        {photo && (
          <View style={styles.photoPreview}>
            <Image source={{uri: photo}} style={styles.previewImage} />
          </View>
        )}

        <Controller
          control={control}
          name="notes"
          render={({field: {onChange, value}}) => (
            <>
              <Input
                label="Notes"
                value={value}
                onChangeText={onChange}
                placeholder="Write about your experience..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.notesInput}
                error={errors.notes?.message}
              />
            </>
          )}
        />

        <Button
          title="Create Travel"
          variant="secondary"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoiding>
  );
};

export default CreateTravelScreen;
