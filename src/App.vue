<template>    
    <div class="hero"> 
        <img src="./assets/Logo.svg" class="hero-logo"  alt="logo">
    </div>

    <!-- <MainContent v-if="!selectedCountry" @country-selected="onCountrySelected" />
    <InformationPage v-if="selectedCountry" :country="selectedCountry" @back="selectedCountry = null" /> -->

  <router-view />
</template>

<script>

    export default {
  name: 'App'}
  
// import InformationPage from './components/view/InformationPage.vue';
// import MainContent from './components/view/MainContent.vue';

//     export default {
//         name: 'WebsiteView',
//         components: {
//             MainContent,
//             InformationPage
//         },
//         data() {
//             return {
//                 selectedCountry: null
//             };
//         },
//         methods: {
//             onCountrySelected(country) {
//                 this.selectedCountry = country;
//             }
//         }
//     };

</script>


<style scoped>
.hero {
  width: 100%;
  height: 50vh;
  background-image: url("./assets/hero-image.jpg");
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-logo {
  width: 280px;
  height: auto;
}

</style>