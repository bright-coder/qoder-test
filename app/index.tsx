import { Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold mb-2">Welcome to Expo Router!</Text>
      <Text className="text-base text-gray-600 mb-8">This is your home screen</Text>
      
      <Link href="/about" asChild>
        <Pressable className="bg-blue-500 px-5 py-2 rounded-lg">
          <Text className="text-white text-base font-semibold">Go to About</Text>
        </Pressable>
      </Link>
      
      <StatusBar style="auto" />
    </View>
  );
}
