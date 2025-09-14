import 'dotenv/config';

export default
{
  "expo": {
    "name": "SnatchALertaApp",
    "slug": "SnatchALertaApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/Map-Marker.png",
    "scheme": "snatchalertaapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.jpg",
        "backgroundColor": "#ffffff"
      },
      "package": "com.snatchalerta.app",
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
