<template>
    <div class="main-content">
        <!-- Top Content -->
        <div class="top-content" style="margin-top: 20px">
            <div class="card">
                <div class="left-content">
                    <p>Found {{ displayedCountries.length }} countries</p> <!-- Dynamic count -->
                </div>
                <div class="right-content">
                    <div class="search-container">
                        <i class="pi pi-search" style="font-size: 1rem"></i>
                        <input 
                            v-model="searchQuery" 
                            type="text"
                            placeholder="Search by Name, Region, Subregion" 
                            class="search-input"
                            @input="handleSearch"
                        />
                        <i 
                          v-if="searchQuery" 
                          class="pi pi-times clear-icon" 
                          style="font-size: 1rem"
                          @click="clearSearch"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content Layout -->
        <div class="content-layout">
            <!-- Filtered Sidebar Content - LEFT -->
            <div class="filtered-sidebar">
                <div class="Sort">
                    <p>Sort By</p>
                    <div class="card flex justify-content-center">
                        <Dropdown 
                          v-model="selectedSort"
                          :options="sortOptions"
                          optionLabel="label"
                          placeholder="Select Sort Option"
                          class="my-dropdown"
                          style="width:100%; font-size:15px;"
                        />
                    </div>
                </div>

                <div class="Region-Sorting">
                    <p>Region</p>
                    <div class="RegionBtn">
                        <button 
                            @click="applyRegionFilter('Americas')"
                            :class="{ active: selectedRegions.includes('Americas') }"
                        >Americas</button>
                        <button 
                            @click="applyRegionFilter('Antarctic')"
                            :class="{ active: selectedRegions.includes('Antarctic') }"
                        >Antarctic</button>
                        <button 
                            @click="applyRegionFilter('Africa')"
                            :class="{ active: selectedRegions.includes('Africa') }"
                        >Africa</button>
                        <button 
                            @click="applyRegionFilter('Asia')"
                            :class="{ active: selectedRegions.includes('Asia') }"
                        >Asia</button>
                        <button 
                            @click="applyRegionFilter('Europe')"
                            :class="{ active: selectedRegions.includes('Europe') }"
                        >Europe</button>
                        <button 
                            @click="applyRegionFilter('Oceania')"
                            :class="{ active: selectedRegions.includes('Oceania') }"
                        >Oceania</button>
                    </div>
                </div>

                <div class="Status-Sorting">
                    <p>Status</p>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <Checkbox 
                            v-model="checkbox1" 
                            :binary="true" 
                            inputId="unCheckbox"
                            class="custom-checkbox"
                            />
                            <span>Member of the United Nations</span>
                        </label>
                        <label class="checkbox-label">
                            <Checkbox 
                            v-model="checkbox2" 
                            :binary="true" 
                            inputId="indCheckbox"
                            class="custom-checkbox"
                            />
                            <span>Independent</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Data View - RIGHT -->
            <div class="DataView">
                <div class="table-container">
                    <DataTable 
                        :value="displayedCountries" 
                        paginator 
                        :rows="10" 
                        class="custom-datatable"
                        responsiveLayout="scroll"
                        @rowClick="onRowSelect"
                    >
                        <Column header="Flag" style="width: 20%">
                          <template #body="slotProps">
                            <img
                              :src="slotProps.data.flag"
                              :alt="slotProps.data.name + ' flag'"
                              width="55"
                              height="35"
                              style="border-radius: 4px; object-fit: cover;"
                            />
                          </template>
                        </Column>
                        <Column field="name" header="Name" style="width: 20%"></Column>
                        <Column field="population" header="Population" style="width: 20%">
                            <template #body="slotProps">
                                {{ formatNumber(slotProps.data.population) }}
                            </template>
                        </Column>
                        <Column field="area" header="Area(km²)" style="width: 20%">
                            <template #body="slotProps">
                                {{ formatNumber(slotProps.data.area) }}
                            </template>
                        </Column>
                        <Column field="region" header="Region" style="width: 20%"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '',
      country: [],
      selectedSort: null,
      sortOptions: [
        { label: 'Name (A-Z)', value: 'name', order: 1 },
        { label: 'Name (Z-A)', value: 'name', order: -1 },
        { label: 'Population (High to Low)', value: 'population', order: -1 },
        { label: 'Population (Low to High)', value: 'population', order: 1 },
        { label: 'Area (High to Low)', value: 'area', order: -1 },
        { label: 'Area (Low to High)', value: 'area', order: 1 }
      ],
      checkbox1: false,
      checkbox2: false,
      selectedRegions: [],
      isLoading: false
    };
  },
  created() {
    this.loadCountries();
  },
  computed: {
  displayedCountries() {
    let filtered = [...this.country];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(country => 
        country.name.toLowerCase().includes(query) ||
        (country.region && country.region.toLowerCase().includes(query)) ||
        (country.subregion && country.subregion.toLowerCase().includes(query))
      );
    }

    // Region filter
    if (this.selectedRegions.length > 0) {
      filtered = filtered.filter(country => 
        this.selectedRegions.includes(country.region)
      );
    }

    // Status filters - Check for UN Member status
    if (this.checkbox1) {
      // Different possible property names for UN membership
      filtered = filtered.filter(country => {
        // Check various possible property names
        return country.unMember === true || 
               country.un_member === true ||
               country.un === true ||
               country.memberOfUnitedNations === true ||
               (country.status && country.status.includes('UN')) ||
               (country.memberships && country.memberships.includes('UN'));
      });
    }
    
    // Status filters - Check for Independent status
    if (this.checkbox2) {
      // Different possible property names for independence
      filtered = filtered.filter(country => {
        return country.independent === true ||
               country.isIndependent === true ||
               country.sovereign === true ||
               (country.status && country.status.includes('independent')) ||
               (country.status && country.status.toLowerCase().includes('independent'));
      });
    }

    // Apply sorting
    if (this.selectedSort) {
      filtered.sort((a, b) => {
        let valueA = a[this.selectedSort.value];
        let valueB = b[this.selectedSort.value];
        
        // Handle undefined or null values
        if (valueA === undefined || valueA === null) valueA = this.selectedSort.value === 'name' ? '' : 0;
        if (valueB === undefined || valueB === null) valueB = this.selectedSort.value === 'name' ? '' : 0;
        
        if (this.selectedSort.value === 'name') {
          // For string comparison
          return this.selectedSort.order * valueA.localeCompare(valueB);
        } else {
          // For number comparison
          valueA = Number(valueA) || 0;
          valueB = Number(valueB) || 0;
          return this.selectedSort.order * (valueA - valueB);
        }
      });
    }

    return filtered;
  }
},
  methods: {
    async loadCountries() {
      // Check if data exists in localStorage and is not too old (e.g., less than 1 hour old)
      const cachedData = localStorage.getItem('countriesData');
      const cacheTimestamp = localStorage.getItem('countriesTimestamp');
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      if (cachedData && cacheTimestamp && cacheTimestamp > oneHourAgo) {
        // Use cached data
        console.log('Loading countries from localStorage cache');
        this.country = JSON.parse(cachedData);
      } else {
        // Fetch fresh data from API
        console.log('Fetching countries from API');
        await this.fetchCountriesFromAPI();
      }
    },
    
    async fetchCountriesFromAPI() {
      this.isLoading = true;
      try {
        const response = await axios.get('https://gist.githubusercontent.com/abiww/1a53acf9955116b9e39f3e7e9f29caec/raw/9808f12a2aab36fdb977b939bb764ff053d9a7c0/countries');
        this.country = response.data;
        
        // Store in localStorage with timestamp
        localStorage.setItem('countriesData', JSON.stringify(response.data));
        localStorage.setItem('countriesTimestamp', Date.now());
        
        console.log('Countries data saved to localStorage');
      } catch (error) {
        console.error('Error fetching countries:', error);
        
        // Try to load from cache even if expired as fallback
        const cachedData = localStorage.getItem('countriesData');
        if (cachedData) {
          console.log('API failed, using cached data as fallback');
          this.country = JSON.parse(cachedData);
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    applyRegionFilter(region) {
      const index = this.selectedRegions.indexOf(region);
      if (index > -1) {
        this.selectedRegions.splice(index, 1);
      } else {
        this.selectedRegions.push(region);
      }
    },
    
    onRowSelect(event) {
      const country = event.data;
      if (country && country.id) {
        this.$router.push(`/country/${country.id}`);
      }
    },
    
    clearSearch() {
      this.searchQuery = '';
    },

    formatNumber(value) {
        if (value === null || value === undefined) return '';
        
        // Convert to number first
        const num = Number(value);
        
        // Check if it's a valid number
        if (isNaN(num)) return value;
        
        // Format with commas
        return num.toLocaleString('en-US');
    },
    

  }
};
</script>

<style scoped>
@import "../../style/MainContent.css";


</style>