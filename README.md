# Image Gallery App

This project is about to display images. 
You can upload the images and preview those images. 
You can filter and search images by Tags and Titles.

## Development 

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build with

1. Angular 17 
2. Firebase -> Store the image URL and other data on Firebase. 
3. AWS S3 -> Store images
4. Node -> version >= V18.14.0

## Configurations
Before running or building the project you have to set the below configurations.

Path:- src/app/helper/app-const.ts
```
export class AppConst{
   public static maxSizeMB = 20;
   public static throttle = 300;
   public static scrollDistance = 3;
   public static scrollUpDistance = 8;
   public static accessKeyId = '';
   public static secretAccessKey = '';
   public static region = '';
   public static firebaseKeys = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    }
}
```
## Flow Diagram
![image](https://github.com/jaimin-7span/image-gallery-poc/assets/14936543/88ae933e-1cee-47a7-8188-f0217ccf470d)




