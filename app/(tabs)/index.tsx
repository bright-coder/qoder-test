import { Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold mb-2 text-gray-900">Welcome Back!</Text>
        <Text className="text-lg text-gray-600 mb-2">Hello, {user?.username}!</Text>
        <Text className="text-base text-gray-500 mb-8 text-center">
          You are successfully signed in to your account.
        </Text>
        
        <View className="w-full max-w-sm space-y-4">
          <Link href="/about" asChild>
            <Pressable className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600">
              <Text className="text-white text-base font-semibold text-center">Go to About</Text>
            </Pressable>
          </Link>
          
          <View className="flex-row justify-center mt-6">
            <LogoutButton />
          </View>
        </View>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}
