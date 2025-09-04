import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { IconButton } from './IconButton';
import { FormInput } from './FormInput';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { useTheme } from '../theme';

interface LocationPickerProps {
  latitude?: string;
  longitude?: string;
  onLocationChange: (latitude: string, longitude: string) => void;
  onLatitudeChange: (latitude: string) => void;
  onLongitudeChange: (longitude: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onLatitudeChange,
  onLongitudeChange,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  // Check location permissions on mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationPermission(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);

      // Check if permission is granted
      if (locationPermission === false) {
        const granted = await requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location permission to use this feature.',
            [{ text: 'OK' }]
          );
          return;
        }
      } else if (locationPermission === null) {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude.toFixed(6);
      const lng = location.coords.longitude.toFixed(6);

      // Update the form values
      onLatitudeChange(lat);
      onLongitudeChange(lng);
      onLocationChange(lat, lng);

      Alert.alert('Success', 'Current location has been set!');
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location settings and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude: lat, longitude: lng } = event.nativeEvent.coordinate;
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    
    onLatitudeChange(latStr);
    onLongitudeChange(lngStr);
    onLocationChange(latStr, lngStr);
  };

  // Parse current coordinates
  const currentLat = parseFloat(latitude || '0');
  const currentLng = parseFloat(longitude || '0');
  const hasValidCoordinates = !isNaN(currentLat) && !isNaN(currentLng) && 
    currentLat !== 0 && currentLng !== 0;

  return (
    <Card style={{ marginTop: theme.spacing[4] }}>
      <CardHeader>
        <CardTitle>Location & Coordinates</CardTitle>
        <Text style={{
          fontSize: theme.typography.sm,
          color: theme.colors.mutedForeground,
        }}>
          Get your current location, tap on the map, or enter coordinates manually
        </Text>
      </CardHeader>
      
      <CardContent>
        <View style={{ gap: theme.spacing[4] }}>
          {/* Get Current Location Button */}
          <IconButton
            variant="outline"
            onPress={getCurrentLocation}
            disabled={isLoading}
            loading={isLoading}
            iconName="my-location"
            iconFamily="MaterialIcons"
            iconPosition="left"
            style={{ alignSelf: 'flex-start' }}
          >
            Get Current Location
          </IconButton>

          {/* Map View */}
          {hasValidCoordinates ? (
            <View style={{
              height: 200,
              borderRadius: theme.borderRadius.md,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: currentLat,
                  longitude: currentLng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                region={{
                  latitude: currentLat,
                  longitude: currentLng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={true}
                showsScale={true}
              >
                <Marker
                  coordinate={{
                    latitude: currentLat,
                    longitude: currentLng,
                  }}
                  title="Selected Location"
                  description={`${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`}
                  draggable={true}
                  onDragEnd={(event) => handleMapPress(event)}
                />
              </MapView>
            </View>
          ) : (
            <View style={{
              height: 200,
              backgroundColor: theme.colors.muted,
              borderRadius: theme.borderRadius.md,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                textAlign: 'center',
                marginBottom: theme.spacing[2],
              }}>
                No location set
              </Text>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                textAlign: 'center',
              }}>
                Use "Get Current Location" or enter coordinates manually
              </Text>
            </View>
          )}

          {/* Current Coordinates Display */}
          {hasValidCoordinates && (
            <View style={{
              backgroundColor: theme.colors.muted,
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.sm,
            }}>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                marginBottom: theme.spacing[1],
              }}>
                Selected Coordinates:
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                fontFamily: 'monospace',
              }}>
                {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
              </Text>
            </View>
          )}

          {/* Manual Coordinate Input */}
          <View>
            <Text style={{
              fontSize: theme.typography.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[3],
            }}>
              Manual Coordinates
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              gap: theme.spacing[3] 
            }}>
              <View style={{ flex: 1 }}>
                <FormInput
                  label="Latitude"
                  placeholder="e.g., 13.7563"
                  value={latitude || ''}
                  onChangeText={onLatitudeChange}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput
                  label="Longitude"
                  placeholder="e.g., 100.5018"
                  value={longitude || ''}
                  onChangeText={onLongitudeChange}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};