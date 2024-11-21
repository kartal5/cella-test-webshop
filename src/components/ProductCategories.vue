<template>
    <div class="container mt-5 mx-auto px-2">
      <div class="md:flex">
        <div class="flex-1 text-gray-700 text-center bg-category-color px-5 py-5 m-2 rounded">
          <div class="lg:flex lg:items-center">
            <div class="lg:flex-shrink-0">
              <img class="rounded-lg lg:w-44 " src="/img/Human-Lines-Shopping-LogoIcons-mobile.png" alt="" />
            </div>
            <div class="mt-4 lg:mt-0 lg:ml-6">
              <router-link to="/category/mennesker" class="uppercase tracking-wide sm:text-lg text-base text-black font-bold hover:underline">Mennesker</router-link>
              <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900">Opdag produkter, der styrker din sundhed og livskvalitet</a>
            </div>
          </div>
        </div>
        <div class="flex-1 text-gray-700 text-center bg-category-color px-5 py-5 m-2 rounded">
          <div class="lg:flex lg:items-center">
            <div class="lg:flex-shrink-0">
              <img class="rounded-lg lg:w-44 " src="/img/Horse-Lines-Shopping-LogoIcons-mobile.png" alt="" />
            </div>
            <div class="mt-4 lg:mt-0 lg:ml-6">
              <router-link to="/category/heste" class="uppercase tracking-wide sm:text-lg text-base text-black font-bold hover:underline">Heste</router-link>
              <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900">Opdag produkter, der styrker din sundhed og livskvalitet</a>
            </div>
          </div>
        </div>
      </div>
      <div class="md:flex mt-5">
        <div class="flex-1 text-gray-700 text-center bg-category-color px-5 py-5 m-2 rounded">
          <div class="lg:flex lg:items-center">
            <div class="lg:flex-shrink-0">
              <img class="rounded-lg lg:w-44 " src="/img/Dog-Lines-Shopping-LogoIcons-mobile.png" alt="" />
            </div>
            <div class="mt-4 lg:mt-0 lg:ml-6">
              <router-link to="/category/hunde" class="uppercase tracking-wide sm:text-lg text-base text-black font-bold hover:underline">Hunde</router-link>
              <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900">Opdag produkter, der styrker din sundhed og livskvalitet</a>
            </div>
          </div>
        </div>
        <div class="flex-1 text-gray-700 text-center bg-category-color px-5 py-5 m-2 rounded">
          <div class="lg:flex lg:items-center">
            <div class="lg:flex-shrink-0">
              <img class="rounded-lg lg:w-44 " src="/img/Cat-Lines-Shopping-LogoIcons-mobile.png" alt="" />
            </div>
            <div class="mt-4 lg:mt-0 lg:ml-6">
              <router-link to="/category/katte" class="uppercase tracking-wide sm:text-lg text-base text-black font-bold hover:underline">Katte</router-link>
              <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900">Opdag produkter, der styrker din sundhed og livskvalitet</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductCategories',
  };
  </script>
  
  <style scoped>
  /* Add any specific styles here if needed */
  </style>