import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default function GeoLocationexpo () {
    const [location, setLocation] = useState(null);
    
    useEffect(() => {
      Geolocation.requestAuthorization('whenInUse');
  
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log(latitude)
        },
        (error) => {
          console.log('Error getting location', error);
        },
        // { enableHighAccuracy: true, distanceFilter: 100 }
      );
  
      // Cleanup function
      return () => {
        // Clear watch id when the component unmounts
        Geolocation.clearWatch(watchId);
      };
    }, []);
  
    return (
      <View>
        <Text>Latitude: {location?.latitude || '-'}</Text>
        <Text>Longitude: {location?.longitude || '-'}</Text>
      </View>
    );
  };