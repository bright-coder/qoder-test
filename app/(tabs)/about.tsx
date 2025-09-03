import { Text, View, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';

export default function AboutScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-3xl font-bold mb-4 text-gray-900">About</Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          This is an example of file-based routing with Expo Router and NativeWind CSS.
        </Text>
        
        <View className="bg-gray-50 p-4 rounded-xl mb-6 w-full max-w-sm">
          <Text className="text-lg font-semibold mb-2 text-gray-900">User Information</Text>
          <Text className="text-gray-700">Username: {user?.username}</Text>
          <Text className="text-gray-700">Email: {user?.email || 'Not provided'}</Text>
          <Text className="text-gray-700">User ID: {user?.id}</Text>
        </View>
        
        <View className="w-full max-w-sm space-y-4">
          <Link href="/" asChild>
            <Pressable className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600">
              <Text className="text-white text-base font-semibold text-center">Go back to Home</Text>
            </Pressable>
          </Link>
          
          <View className="flex-row justify-center mt-6">
            <LogoutButton />
          </View>
        </View>
        
        <View className="mt-8 p-4 bg-blue-50 rounded-xl w-full max-w-sm">
          <Text className="text-sm font-semibold text-blue-900 mb-2">Features Implemented:</Text>
          <Text className="text-sm text-blue-800">✓ Secure authentication with expo-secure-store</Text>
          <Text className="text-sm text-blue-800">✓ Form validation with react-hook-form & zod</Text>
          <Text className="text-sm text-blue-800">✓ Tab-based navigation</Text>
          <Text className="text-sm text-blue-800">✓ NativeWind styling</Text>
          <Text className="text-sm text-blue-800">✓ Context-based state management</Text>
        </View>
      </View>
    </ScrollView>
  );
}
