# [Lunch Money](https://lunchmoney.app) App

An unofficial Lunch Money client built with Ionic and Capacitor!

## Build for Android

```bash
# clone the repo and change directory
git clone git@github.com:nprail/lunch-money-app.git
cd lunch-money-app

# install npm dependencies
npm install

# build Angular
npm run build

# copy the static assets
npx cap copy android

# build the native project
cd android
./gradlew assembleDebug
```