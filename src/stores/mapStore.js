import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    selectedDistrict: null,
  }),
  actions: {
    setSelectedDistrict(districtId) {
      this.selectedDistrict = districtId
    }
  }
})
