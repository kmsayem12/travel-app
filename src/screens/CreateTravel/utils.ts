import {z} from 'zod';
import {PermissionsAndroid, Platform} from 'react-native';

export const defaultValues: CreateTravelFormData = {
  location: '',
  photo: '',
  notes: '',
};

export const createTravelSchema = z.object({
  location: z.string().min(3, 'Location must be at least 3 characters'),
  photo: z.string().min(1, 'Photo are required'),
  notes: z
    .string()
    .min(10, 'Notes must be at least 10 characters')
    .max(500, 'Notes cannot exceed 500 characters'),
});

export type CreateTravelFormData = z.infer<typeof createTravelSchema>;

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const permissions =
      Platform.Version >= 33
        ? [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ]
        : [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ];

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    return Object.values(granted).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  return true; // iOS auto-handles permission
};
