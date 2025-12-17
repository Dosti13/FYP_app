import 'dotenv/config';

export default
{
  "expo": {
    "name": "SnatchAlertApp",
    "slug": "SnatchAlertApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "snatchalertapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
     "extra": {
      "EXPO_PUBLIC_API_BASE_URL": process.env.EXPO_PUBLIC_API_BASE_URL,
    },
    "android": {
     "adaptiveIcon": {
  "foregroundImage": "./assets/images/Map-Marker.png",
  "backgroundColor": "#ffffff"  // or "#52C41A" for green
},
      "package": "com.snatchalert.app",
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
        }
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/Map-Marker.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
      "statusBar": {
        "barStyle": "dark-content",
        "translucent": true
      },
    "experiments": {
      "typedRoutes": true
    }
  }
}
