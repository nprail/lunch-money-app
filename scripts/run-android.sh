set -e

npm run build

npx cap copy android

cd ./android
./gradlew assembleDebug
cd ..

npx native-run android --app android/app/build/outputs/apk/debug/app-debug.apk