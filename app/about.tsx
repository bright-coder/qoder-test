import { Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function AboutScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-2xl font-bold mb-5">About Page</Text>
      <Text className="text-base text-gray-600 text-center mb-8">
        This is an example of file-based routing with Expo Router and NativeWind CSS.
      </Text>
      
      <Link href="/" asChild>
        <Pressable className="bg-blue-500 px-5 py-2 rounded-lg">
          <Text className="text-white text-base font-semibold">Go back to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
