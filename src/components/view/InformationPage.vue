<template>
    <div class="info-content" v-if="country">
        <div class="country-title">
            <img :src="country.flag" :alt="`${country.name} Flag`">
            <h1>{{ country.name }}</h1>
            <p>{{ country.official_name }}</p>

            <div class="country-label">
                <div class="label-item">
                    <p>Population</p>
                    <p>{{ country.population?.toLocaleString() }}</p>
                </div>
                <div class="label-item">
                    <p>Area (km²)</p>
                    <p>{{ country.area?.toLocaleString() }}</p>
                </div>
            </div>
        </div>

        <div class="country-info">
            <div class="row">
                <p class="Left-Side">Capital</p>
                <p class="Right-Side">{{ country.capital }}</p>
            </div>
            <div class="row">
                <p class="Left-Side">Subregion</p>
                <p class="Right-Side">{{ country.subregion }}</p>
            </div>
            <div class="row">
                <p class="Left-Side">Language</p>
                <p class="Right-Side">{{ getLanguages(country.language) }}</p>
            </div>
            <div class="row">
                <p class="Left-Side">Currencies</p>
                <p class="Right-Side">{{ getCurrencies(country.currencies) }}</p>
            </div>
            <div class="row">
                <p class="Left-Side">Continent</p>
                <p class="Right-Side">{{ country.continents?.[0] }}</p>
            </div>
        </div>

        <div class="country-neighbor" v-if="sameSubregionCountries.length > 0">
            <p>Neighbor countries</p>
            <div class="neigbor-info">
                <div v-for="otherCountry in sameSubregionCountries" :key="otherCountry.id" class="neighbor-item">
                    <img :src="otherCountry.flag" :alt="`${otherCountry.name} Flag`">
                    <p>{{ otherCountry.name }}</p>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="loading">
        Loading country information...
    </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      country: null,
      allCountries: [],
      sameSubregionCountries: [],
      isLoading: true,
      error: null
    };
  },
  created() {
    this.loadCountryData();
  },
  methods: {
    async loadCountryData() {
      this.isLoading = true;
      
      // Check if data exists in localStorage
      const cachedData = localStorage.getItem('countriesData');
      
      if (cachedData) {
        console.log('Loading countries from localStorage');
        this.allCountries = JSON.parse(cachedData);
        this.findCountryById();
      } else {
        // If not in localStorage, fetch from API
        await this.fetchCountriesFromAPI();
      }
    },
    
    async fetchCountriesFromAPI() {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/abiww/1a53acf9955116b9e39f3e7e9f29caec/raw/9808f12a2aab36fdb977b939bb764ff053d9a7c0/countries');
        this.allCountries = response.data;
        
        // Store in localStorage for future use
        localStorage.setItem('countriesData', JSON.stringify(response.data));
        localStorage.setItem('countriesTimestamp', Date.now());
        
        this.findCountryById();
      } catch (error) {
        console.error('Error fetching countries:', error);
        this.error = 'Failed to load country data. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    
    findCountryById() {
      // Try to find country by ID (try multiple possible ID fields)
      this.country = this.allCountries.find(c => {
        return c.id?.toString() === this.id.toString() ||
               c.cca2?.toString() === this.id.toString() ||
               c.cca3?.toString() === this.id.toString() ||
               c.ccn3?.toString() === this.id.toString();
      });
      
      if (this.country) {
        this.filterSameSubregionCountries();
      } else {
        this.error = `Country with ID ${this.id} not found`;
      }
      
      this.isLoading = false;
    },
    
    filterSameSubregionCountries() {
      if (!this.country || !this.country.subregion) return;
      
      this.sameSubregionCountries = this.allCountries.filter(c => 
        c.subregion === this.country.subregion && 
        c.id !== this.country.id
      );
    },
    
    getLanguages(languages) {
      if (!languages || !Array.isArray(languages)) return '';
      return languages.join(', ');
    },
    
    getCurrencies(currencies) {
      if (!currencies) return '';
      return Object.values(currencies).map(c => c.name).join(', ');
    }
  }
};
</script>

<style scoped>
@import "../../style/InformationPage.css";
</style>