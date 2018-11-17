var localComponent = {
  props: ['restaurantlist','searchrestaurant','sortrestaurants'],
  data:function(){
    return{
       listRestaurant:null
    }
  },
  created(){
            //  On the creation of the component the value of prop is assigned to the component data listRestaurant, so we modify(favorite button) the data not the prop
                        this.listRestaurant=this.restaurantlist;
      
   
    
                },
  methods:{
                    initialSort:function(){
                         return this.listRestaurant.sort(function(a,b){
                              var sortRules={
                                  "open": 0,
                                  "order ahead": 1,
                                  "closed": 2
                              }
                               return (sortRules[a.status]-sortRules[b.status]) || a.name.localeCompare(b.name);
                             });
                    },
                    // Listing the favorited Restaurants
                    listFavorited:function(){
                      return this.listRestaurant.filter(restaurant=>{
                        return restaurant.isFavorite===1;
                    }

                    ); 
                    },
                    // Sort By Function,i put all the sort options within the switch case
                    sortBy:function(sortrestaurants){
                        return this.listRestaurant.sort(function(a,b){
                            
                            var sortRule;
                                var sortRules={
                                  "open": 0,
                                  "order ahead": 1,
                                  "closed": 2
                              }

                                
switch (sortrestaurants) {
  case 'minCost':
return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || (a.sortingValues.minCost-b.sortingValues.minCost);
    break;
    case 'deliveryCosts':
return (b.isFavorite-a.isFavorite)||  (sortRules[a.status]-sortRules[b.status]) || (a.sortingValues.deliveryCosts-b.sortingValues.deliveryCosts);
    break;
    case 'averageProductPrice':
return (b.isFavorite-a.isFavorite)||  (sortRules[a.status]-sortRules[b.status]) || (a.sortingValues.averageProductPrice-b.sortingValues.averageProductPrice);
    break;
    case 'distance':
return (b.isFavorite-a.isFavorite)||(sortRules[a.status]-sortRules[b.status]) || (a.sortingValues.distance-b.sortingValues.distance);
    break;
    case 'ratingAverage':
return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || (b.sortingValues.ratingAverage-a.sortingValues.ratingAverage);
    break;
     case 'popularity':
return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || (b.sortingValues.popularity-a.sortingValues.popularity);
    break;
    case 'newest':
return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || (b.sortingValues.newest-a.sortingValues.newest);
    break;
    case 'bestMatch':
return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || (b.sortingValues.bestMatch-a.sortingValues.bestMatch);
    break;
    case 'topRestaurants':
    var topresA=(a.sortingValues.distance*a.sortingValues.popularity)+a.sortingValues.ratingAverage;
    var topresB=(b.sortingValues.distance*b.sortingValues.popularity)+b.sortingValues.ratingAverage;
return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || (topresB-topresA);
    break;
   case '':
    return (b.isFavorite-a.isFavorite)|| (sortRules[a.status]-sortRules[b.status]) || a.name.localeCompare(b.name);
    break;
  
}

 });
                    },
                    // Search Restaurant Method, it filters the Restaurants based on the input text
                searchRestaurants:function(){
                    return this.listRestaurant.filter(restaurant=>{
                        return restaurant.name.toLowerCase().includes(this.searchrestaurant.toLowerCase());
                    }

                    );
                },
                // Favorite function and update the changed component
                favorite:function(restaurant){
                        
               var pos = this.listRestaurant.map(function(e) { return e.name; }).indexOf(restaurant);
         
                this.listRestaurant[pos].isFavorite=1;

this.$forceUpdate();
                },
                // un Favorite a restaurant and update the changed component
                unFavorite:function(restaurant){
                var pos = this.listRestaurant.map(function(e) { return e.name; }).indexOf(restaurant);
         
                this.listRestaurant[pos].isFavorite=0;

                    
                      this.$forceUpdate();

                }    
                },
   computed:{
                    // This computed field displays the properties of the listrestaurant data based on the user input/selection
                    sortedRestaurants: function(){
                            if(this.searchrestaurant===""){
                                 
                                if(this.sortrestaurants==="fav")
                                {
                                            return this.listFavorited();
                                }else{
                                        return this.sortBy(this.sortrestaurants);
                                } 
                            }else{
                              return this.searchRestaurants(); 
                            }

                            
                    }
                },
  
  template: `
     <div class="columns is-multiline">
  <div v-for="restaurant in sortedRestaurants" :key="restaurant.name" class="column is-one-third">
 <div class="card">
  <header class="card-header">
    <p class="card-header-title">
      {{restaurant.name}}
    </p>
   <span class="card-header-icon">
       <span class="icon">
           <a href="#" v-if="restaurant.isFavorite" @click.prevent="unFavorite(restaurant.name)">
            <i class="fas fa-heart favoritedIcon"></i>
        </a>
<a href="#" v-else  @click.prevent="favorite(restaurant.name)">
           <i class="far fa-heart"></i>
        </a>
       </span>
         
    </span>
  </header>
  <div class="card-content">
    <div class="content">
   <star-rating :rating="restaurant.sortingValues.ratingAverage" :read-only="true" :increment="0.5"></star-rating>
   <div class="columns">
       <div class="column">
           <i class="fas fa-poll"></i> ({{restaurant.sortingValues.popularity}})
       </div>
       <div class="column">
           <i class="fas fa-utensils"></i> Avg. Price {{restaurant.sortingValues.averageProductPrice}}
       </div>
       </div> 
   
      <br>
        <p></p>
    </div>
  </div>
  <footer class="card-footer">
       <span class="card-footer-item"><span v-if="restaurant.status==='open'" class="icon"> 
         <span><i class="fas fa-circle" style="color: green;"></i></span> <span>{{restaurant.status}}</span>
    </span>
    <span v-else-if="restaurant.status==='closed'" class="icon">
         <span><i class="fas fa-circle" style="color: red;"></i></span> <span>{{restaurant.status}}</span>
    </span>
    <span v-else class="icon">
         <span><i class="fas fa-circle" style="color: orange;"></i></span> <span>{{restaurant.status}}</span>
    </span> </span>
    <span class="card-footer-item"><i class="fas fa-motorcycle"></i> <i class="fas fa-euro-sign"></i> {{restaurant.sortingValues.deliveryCosts}}</span>
   
    <span class="card-footer-item"><i class="fas fa-coins"></i> Min. <i class="fas fa-euro-sign"></i>  <p>{{ restaurant.sortingValues.minCost}}</p></span>


  </footer>
</div>


  </div>

</div>
  `,
 
};


var app = new Vue({
  el: '#app',
  components: {
    // <local-component> will only be available in this parent template
    "local-component": localComponent
  },
  data: {
    sortRestaurants :"",
    searchRestaurant: "", 
    restaurants: [{
		"name": "Tanoshii Sushi",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 0.0,
			"newest": 96.0,
			"ratingAverage": 4.5,
			"distance": 1190,
			"popularity": 17.0,
			"averageProductPrice": 1536,
			"deliveryCosts": 200,
			"minCost": 1000,
			"topRestaurants":0
		}
	}, {
		"name": "Tandoori Express",
		"isFavorite":0,
		"status": "closed",
		"sortingValues": {
			"bestMatch": 1.0,
			"newest": 266.0,
			"ratingAverage": 4.5,
			"distance": 2308,
			"popularity": 123.0,
			"averageProductPrice": 1146,
			"deliveryCosts": 150,
			"minCost": 1300,
			"topRestaurants":0
		}
	}, {
		"name": "Royal Thai",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 2.0,
			"newest": 133.0,
			"ratingAverage": 4.5,
			"distance": 2639,
			"popularity": 44.0,
			"averageProductPrice": 1492,
			"deliveryCosts": 150,
			"minCost": 2500,
			"topRestaurants":0
		}
	}, {
		"name": "Sushi One",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 3.0,
			"newest": 238.0,
			"ratingAverage": 4.0,
			"distance": 1618,
			"popularity": 23.0,
			"averageProductPrice": 1285,
			"deliveryCosts": 0,
			"minCost": 1200,
			"topRestaurants":0
		}
	}, {
		"name": "Roti Shop",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 4.0,
			"newest": 247.0,
			"ratingAverage": 4.5,
			"distance": 2308,
			"popularity": 81.0,
			"averageProductPrice": 915,
			"deliveryCosts": 0,
			"minCost": 2000,
			"topRestaurants":0
		}
	}, {
		"name": "Aarti 2",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 5.0,
			"newest": 153.0,
			"ratingAverage": 4.5,
			"distance": 1605,
			"popularity": 44.0,
			"averageProductPrice": 922,
			"deliveryCosts": 250,
			"minCost": 500,
			"topRestaurants":0
		}
	}, {
		"name": "Pizza Heart",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 6.0,
			"newest": 118.0,
			"ratingAverage": 4.0,
			"distance": 2453,
			"popularity": 9.0,
			"averageProductPrice": 1103,
			"deliveryCosts": 150,
			"minCost": 1500,
			"topRestaurants":0
		}
	}, {
		"name": "Mama Mia",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 7.0,
			"newest": 250.0,
			"ratingAverage": 4.0,
			"distance": 1396,
			"popularity": 6.0,
			"averageProductPrice": 912,
			"deliveryCosts": 0,
			"minCost": 1000,
			"topRestaurants":0
		}
	}, {
		"name": "Feelfood",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 8.0,
			"newest": 163.0,
			"ratingAverage": 4.5,
			"distance": 2732,
			"popularity": 31.0,
			"averageProductPrice": 902,
			"deliveryCosts": 150,
			"minCost": 1500,
			"topRestaurants":0
		}
	}, {
		"name": "Daily Sushi",
		"isFavorite":0,
		"status": "closed",
		"sortingValues": {
			"bestMatch": 9.0,
			"newest": 221.0,
			"ratingAverage": 4.0,
			"distance": 1911,
			"popularity": 6.0,
			"averageProductPrice": 1327,
			"deliveryCosts": 200,
			"minCost": 1000,
			"topRestaurants":0
		}
	}, {
		"name": "Pamukkale",
		"isFavorite":0,
		"status": "closed",
		"sortingValues": {
			"bestMatch": 10.0,
			"newest": 201.0,
			"ratingAverage": 4.0,
			"distance": 2353,
			"popularity": 25.0,
			"averageProductPrice": 968,
			"deliveryCosts": 0,
			"minCost": 2000,
			"topRestaurants":0
		}
	}, {
		"name": "Indian Kitchen",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 11.0,
			"newest": 272.0,
			"ratingAverage": 4.5,
			"distance": 2308,
			"popularity": 5.0,
			"averageProductPrice": 1189,
			"deliveryCosts": 150,
			"minCost": 1300,
			"topRestaurants":0
		}
	}, {
		"name": "CIRO 1939",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 12.0,
			"newest": 231.0,
			"ratingAverage": 4.5,
			"distance": 3957,
			"popularity": 79.0,
			"averageProductPrice": 1762,
			"deliveryCosts": 99,
			"minCost": 1300,
			"topRestaurants":0
		}
	}, {
		"name": "Zenzai Sushi",
		"isFavorite":0,
		"status": "closed",
		"sortingValues": {
			"bestMatch": 13.0,
			"newest": 155.0,
			"ratingAverage": 4.0,
			"distance": 2911,
			"popularity": 36.0,
			"averageProductPrice": 1579,
			"deliveryCosts": 0,
			"minCost": 2000,
			"topRestaurants":0
		}
	}, {
		"name": "Fes Patisserie",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 14.0,
			"newest": 77.0,
			"ratingAverage": 4.0,
			"distance": 2302,
			"popularity": 3.0,
			"averageProductPrice": 1214,
			"deliveryCosts": 150,
			"minCost": 1250,
			"topRestaurants":0
		}
	}, {
		"name": "Yvonne's Vispaleis",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 15.0,
			"newest": 150.0,
			"ratingAverage": 5.0,
			"distance": 2909,
			"popularity": 3.0,
			"averageProductPrice": 2557,
			"deliveryCosts": 150,
			"minCost": 1750,
			"topRestaurants":0
		}
	}, {
		"name": "De Amsterdamsche Tram",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 304.0,
			"newest": 131.0,
			"ratingAverage": 0.0,
			"distance": 2792,
			"popularity": 0.0,
			"averageProductPrice": 892,
			"deliveryCosts": 0,
			"minCost": 0,
			"topRestaurants":0
		}
	}, {
		"name": "Lale Restaurant & Snackbar",
		"isFavorite":0,
		"status": "order ahead",
		"sortingValues": {
			"bestMatch": 305.0,
			"newest": 73.0,
			"ratingAverage": 0.0,
			"distance": 2880,
			"popularity": 0.0,
			"averageProductPrice": 838,
			"deliveryCosts": 0,
			"minCost": 0,
			"topRestaurants":0
		}
	}, {
		"name": "Lunchpakketdienst",
		"isFavorite":0,
		"status": "open",
		"sortingValues": {
			"bestMatch": 306.0,
			"newest": 259.0,
			"ratingAverage": 3.5,
			"distance": 14201,
			"popularity": 0.0,
			"averageProductPrice": 4465,
			"deliveryCosts": 500,
			"minCost": 5000,
			"topRestaurants":0
		}
	}]
  }
})

