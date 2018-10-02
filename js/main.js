
var _app = new Vue({
    el : "#root",
    data : function() {
      return {
        isList: false,
        // set items to show to 12 given that we mount the component with the Tile view active
        itemsToShow: 12,
        filters: [{
          category: "Chassis"
        },{
          category: "Floors"
        },{
          category: "Plumbing"
        },{
          category: "Cabinets"
        },{
          category: "Shelling"
        },{
          category: "Electrical"
        },{
          category: "Roof"
        },{
          category: "Exterior"
        },{
          category: "Appliances"
        }],
        groupFilter: "All",
        refineSearch: "",
        parts: [],
        paginate: ["partsMultipleFilters"]
      }
    },
  
  
    mounted() {
        axios.get("data/parts.json").then(response => {
          console.log(response);
          this.parts = response.data;
        });
    },

    methods : {
      
        makeList: function(param) {      
          param == true ? this.isList = true : this.isList = false;
          param == true ? this.itemsToShow = 10 : this.itemsToShow = 12;
        },
      
        addToFav: function(part) {
            // add to favorite 
            console.log(part, " add to favorite");

            // change is favorite to true
            part.isFavorite = true;

        },
      
        removeFromFav: function(part) {
            // remove from favorite
            console.log(part, " remove from favorite");

            // change is favorite to false
            part.isFavorite = false;
        }
    },

    computed : {
     
        filteredParts: function() {
            let vm = this;
            let groupFilter = vm.groupFilter;


            if(groupFilter === "All") {
                return vm.parts;
            } else {
                return vm.parts.filter((part) => part.parentGroupNames.includes(groupFilter))
            }
        },

        partsMultipleFilters: function() {
            let filtered = this.parts; // reference to main dataset
            let vm = this;

            // filter group radios
            if(this.groupFilter !== "All") {
                filtered = this.parts.filter((part) => part.parentGroupNames.includes(this.groupFilter))
            } else {
                filtered = this.parts
            }

            // refine search -- extend with Array of multiple search terms || split search terms by space and push them to an Array
            if(this.refineSearch) {
                filtered = filtered.filter((part) => part.name.toLowerCase().includes(this.refineSearch.toLowerCase()) || part.number.toLowerCase().includes(this.refineSearch.toLowerCase()))
            } 

          
            return filtered;
        }
      
    },

    watch: {
        // if user types anything into the refine search input , set pagination to page 1
        refineSearch: function(val) {
            this.$refs.paginator.goToPage(1);
        },
        // if user clicks any radio filter , set pagination to page 1
        groupFilter: function(val) {
            this.$refs.paginator.goToPage(1);
        }
    }
});



Vue.filter('currency', function (value) {
    return '$' + parseFloat(value).toFixed(2);
});