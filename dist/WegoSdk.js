!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.WegoSdk=t():e.WegoSdk=t()}(window,function(){return function(e){var t={};function r(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(i,n,function(t){return e[t]}.bind(null,n));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=4)}([function(e,t){var r={cloneObject:function(e){var t={};for(var r in e)t[r]=e[r];return t},cloneArray:function(e){var t=[];return e.forEach(function(e){t.push(e)}),t},mapValues:function(e){return Object.keys(e).map(function(t){return e[t]})},compare:function(e,t,r,i){var n=r(e),o=r(t);return n===o?0:null===n||void 0===n?1:null===o||void 0===o?-1:n>o==("ASC"===i)?1:-1},filterByKey:function(e,t){return!t||t[e]},filterByAllKeys:function(e,t){if(!t)return!0;if(0===e.length)return!1;for(var r=0;r<e.length;r++)if(!t[e[r]])return!1;return!0},filterBySomeKeys:function(e,t){if(!t||0===t.length)return!0;for(var r=0;r<t.length;r++)if(e[t[r]])return!0;return!1},filterByContainAllKeys:function(e,t){if(!t)return!0;for(var r=0;r<t.length;r++)if(!e[t[r]])return!1;return!0},filterByTextMatching:function(e,t){return!t||this.stripAccents(e).toLowerCase().indexOf(this.stripAccents(t).toLowerCase())>-1},filterByRange:function(e,t){if(!t)return!0;var r=void 0===t.min?0:t.min,i=void 0===t.max?1<<30:t.max;return r<=e&&e<=i},arrayToMap:function(e){if(!e||0===e.length)return null;var t={};return e.forEach(function(e){t[e]=!0}),t},arrayToMaps:function(e,t){if(!t)return this.arrayToMap(e);if(!e||0===e.length)return null;var r={};return e.forEach(function(e){var t=e[0]-1,i=e.substr(2);r[t]=r[t]||{},r[t][i]=!0}),r},stripAccents:function(){var e="àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ",t=new RegExp("["+e+"]","g"),r={};function i(e){return r[e]||e}for(var n=0;n<e.length;n++)r[e[n]]="aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY"[n];return function(e){return e?e.replace(t,i):""}}()};e.exports=r},function(e,t){var r={__host:{staging:{v3:"https://srv.wegostaging.com/v3",v2:"https://srv.wegostaging.com/v2",v1:"https://srv.wegostaging.com"},production:{v3:"https://srv.wego.com/v3",v2:"https://srv.wego.com/v2",v1:"https://srv.wego.com"}},_hotelEndpoints:{hotelDetailsUrl:function(e){return r.getHost("v1")+"/hotels/hotels/"+e}},getHost:function(e="v2"){return this.__host[this.getEnvironment()][e]},setEnvironment:function(e){this.env=e},getEnvironment:function(){return this.env||Wego.ENV||"staging"},searchTrips:function(e,t,r,i){return this.post(t,e,r,i)},fetchTrips:function(e,t,r,i){let n=`${e}/${t}/results`;return this.get(n,r||{},i)},searchHotels:function(e,t,r,i){return this.post(t,e,r,i)},fetchHotels:function(e,t,r,i){let n=`${e}/${t}/results`;return this.get(n,r||{},i)},searchHotel:function(e,t,r,i){let n=`${e}/${t.search.hotelId}/searches`;return this.post(t,n,r,i)},fetchHotelRates:function(e,t){var r=this.__host[this.getEnvironment()].v3+"/metasearch/hotels/"+e+"/rates";return this.get(r,t)},fetchHotelDetails:function(e,t){var r=this._hotelEndpoints.hotelDetailsUrl(e);return this.get(r,t)},fetchCities:function(e){var t=this.__host[this.getEnvironment()].v1+"/places/cities";return this.get(t,e)},fetchAirports:function(e){var t=this.__host[this.getEnvironment()].v1+"/places/airports";return this.get(t,e)},post:function(e,t,r,i){return fetch(this.buildUrl(t,r),{method:"POST",credentials:"include",mode:"cors",headers:Object.assign({},i,{"Content-Type":"application/json"}),body:JSON.stringify(e)}).then(function(e){return e.ok?e.json():Promise.reject()}).catch(function(e){return Promise.reject(e)})},get:function(e,t,r){return fetch(this.buildUrl(e,t),{method:"GET",credentials:"include",mode:"cors",headers:Object.assign({},r,{"Content-Type":"application/json"})}).then(function(e){return e.ok?e.json():Promise.reject()}).catch(function(e){return Promise.reject(e)})},buildUrl:function(e,t){if(t){var r=[];for(var i in t){var n=t[i];n instanceof Array?n.forEach(function(e){r.push(i+"[]="+e)}):r.push(i+"="+t[i])}e+="?"+r.join("&")}return e}};e.exports=r},function(e,t){var r=function(e){e=e||{},this.initCallApi=e.initCallApi,this.callApi=e.callApi,this.delays=e.delays,this.onSuccessResponse=e.onSuccessResponse,this.pollLimit=e.pollLimit};r.prototype={start:function(){var e=this;this.timer=setTimeout(function(){e.pollCount++,e.retryCount=0,e.fetch(e.initCallApi||e.callApi)},0)},reset:function(){clearTimeout(this.timer),this.abortLastFetch&&this.abortLastFetch(),this.pollCount=0,this.resultCount=0,this.forceStop=!1},stop:function(){this.forceStop=!0},isStopping:function(){return this.forceStop},isLastPolling:function(){return this.pollCount>this.pollLimit},getProgress:function(){return this.pollCount>=this.pollLimit||this.resultCount>=1e3?100:void 0===this.resultCount?this.pollCount/this.pollLimit*100:this.pollCount/this.pollLimit*50+this.resultCount/1e3*50},handleSuccessResponse:function(e){this.onSuccessResponse(e),this.resultCount=e.count,this.preparePoll()},preparePoll:function(){var e=this;this.pollCount<this.delays.length&&!this.forceStop&&(this.timer=setTimeout(function(){e.poll()},this.delays[this.pollCount]))},poll:function(){this.pollCount++,this.retryCount=0,this.fetch(this.callApi)},retry:function(e){this.retryCount<3&&(this.retryCount++,this.fetch(e))},fetch:function(e){var t=this,r=!1;this.abortLastFetch=function(){r=!0},e().then(function(e){r||t.handleSuccessResponse(e)}).catch(function(){t.retry(e)})}},e.exports=r},function(e,t,r){var i=r(0);e.exports={prepareResponseSearch:function(e,t){var r=e&&e.region;if(r){var i=[],n=t.cities;r.cityCodes.forEach(function(e){i.push(n[e])}),r.cities=i}},prepareHotel:function(e,t){e.district=t.districts[e.districtId],e.city=t.cities[e.cityCode],e.reviewMap=function(e,t){if(!e)return{};var r={};return e.forEach(function(e){r[t(e)]=e}),r}(e.reviews,function(e){return e.reviewerGroup}),e.ratesCounts={total:0};var r={};if((e.amenityIds||[]).forEach(function(e){r[e]=!0}),e.amenityIdMap=r,e.rates=[],e.images=e.images||[],e.propertyType=t.propertyTypes[e.propertyTypeId],e.badges&&39===e.propertyTypeId){var i=t.roomTypeCategories[e.roomTypeCategoryId];i&&e.badges.push({text:i.name})}},prepareRate:function(e,t,r){e.provider=r.providers[e.providerCode],e.price=this.convertPrice(e.price,t)},convertPrice:function(e,t){if(!t)return e;if(!e)return null;var r=e.amount,n=e.totalAmount,o=e.taxAmount,s=e.totalTaxAmount;if(e.currencyCode!=t.code){var a=t.rate;n=(r=Math.round(e.amountUsd*a))*Math.round(e.totalAmountUsd/e.amountUsd),s=(o=Math.round(e.taxAmountUsd*a))*Math.round(e.totalTaxAmountUsd/e.taxAmountUsd)}var c=i.cloneObject(e);return c.currency=t,c.amount=r,c.totalAmount=n,c.taxAmount=o,c.totalTaxAmount=s,c},prepareFilterOption:function(e,t,r){var i=(r[this.__filterOptionTypeToStaticDataType[t]]||{})[e.code]||{};e.name=i.name},trimArray:function(e){if(e)return Array.isArray(e)&&(e=e.filter(function(e){return!!e&&""!=e.trim()})),e},isBetterRate:function(e,t){function r(e){var t=Math.round(e.price.amount);return t>99999&&(t=t/100*100),t}function i(e){return e.price.taxAmountUsd<0?-1:1}var n=i(e),o=i(t);if(n!=o)return n>o;var s=r(e),a=r(t);return s!=a?s<a:"DIRECT_PRIORITY"==e.provider.type&&"DIRECT_PRIORITY"!=t.provider.type||("DIRECT_PRIORITY"!=t.provider.type||"DIRECT_PRIORITY"==e.provider.type)&&e.price.ecpc>t.price.ecpc},__filterOptionTypeToStaticDataType:{stars:"stars",brands:"brands",propertyTypes:"propertyTypes",districts:"districts",cities:"cities",amenities:"amenities",rateAmenities:"rateAmenities",chains:"chains",reviewerGroups:"reviewerGroups",roomTypeCategories:"roomTypeCategories"}}},function(e,t,r){const i=r(1),n=r(5),o=r(10),s=r(14);e.exports={Api:i,FlightSearchClient:n,HotelSearchClient:o,HotelDetailsClient:s}},function(e,t,r){const i=r(6),n=r(8),o=r(9),s=r(1),a=r(2);e.exports=class{constructor(e,t){let r=this;t=t||{},r.currency=t.currency||{},r.locale=t.locale,r.siteCode=t.siteCode,r.deviceType=t.deviceType||"DESKTOP",r.appType=t.appType||"WEB_APP",r.userLoggedIn=t.userLoggedIn,r.paymentMethodIds=t.paymentMethodIds||[],r.providerTypes=t.providerTypes||[],r.onProgressChanged=t.onProgressChanged||function(){},r.onTripsChanged=t.onTripsChanged||function(){},r.onTotalTripsChanged=t.onTotalTripsChanged||function(){},r.onCheapestTripChanged=t.onCheapestTripChanged||function(){},r.onFastestTripChanged=t.onFastestTripChanged||function(){},r.onBestExperienceTripChanged=t.onBestExperienceTripChanged||function(){},r.onDisplayedFilterChanged=t.onDisplayedFilterChanged||function(){},r.onSearchCreated=t.onSearchCreated||function(){},r.requestHeaders=t.requestHeaders,r.merger=new i,r.poller=new a({initCallApi:()=>s.searchTrips(e,r.getSearchRequestBody(),{currencyCode:r.currency.code,locale:r.locale},r.requestHeaders),callApi:()=>s.fetchTrips(e,r.responseSearch.id,r.fetchTripsParams(),r.requestHeaders),onSuccessResponse:e=>r.handleSearchResponse(e)}),r.reset()}searchTrips(e){this.search=e,this.reset();let t=e.legs,r=t.length>2;if(2===t.length){let e=["departureCityCode","departureAirportCode","arrivalCityCode","arrivalAirportCode"];((t,r)=>t===r||t[e[0]]===r[e[2]]&&t[e[1]]===r[e[3]]&&t[e[2]]===r[e[0]]&&t[e[3]]===r[e[1]])(t[0],t[1])||(r=!0)}this.multiCity=r,this.merger.multiCity=r;let i=this.poller;i.delays=(r?[0,3,3,3,4,4,4,4,5,5,5,5,5,6]:[0,1,3,4,5,6,6,6]).map(e=>1e3*e),i.pollLimit=i.delays.length-1,this.updateResult(),i.start()}handleSearchResponse(e){this.mergeResponse(e),this.updateResult(),1===this.poller.pollCount&&this.onSearchCreated(e.search)}mergeResponse(e){this.merger.mergeResponse(e),this.processedFaresCount=e.count,this.responseSearch=e.search}reset(){this.poller.reset(),this.merger.reset(),this.responseSearch={},this.processedFaresCount=0}updatePaymentMethodIds(e){this.paymentMethodIds=e,this.reset(),this.updateResult(),this.poller.start()}updateProviderTypes(e){this.providerTypes=e,this.reset(),this.updateResult(),this.poller.start()}updateSort(e){this.sort=e,this.updateResult()}updateFilter(e){this.filter=e,this.updateResult()}updateCurrency(e){this.currency=e,this.merger.updateCurrency(e),this.updateResult()}updateResult(){let e=this,t=e.merger.getTrips();0!==Object.keys(e.merger.getLegConditions()).length&&o.passLegConditions(e.merger.getLegConditions()),0!==Object.keys(e.merger.getFareConditions()).length&&o.passFareConditions(e.merger.getFareConditions());let r=o.filterTrips(t,e.filter,e.multiCity),i=n.sortTrips(r,e.sort);e.onTripsChanged(i),e.onCheapestTripChanged(n.getCheapestTrip(r)),e.onFastestTripChanged(n.getFastestTrip(r)),e.onBestExperienceTripChanged(n.getBestExperienceTrip(r)),e.onTotalTripsChanged(t),e.onDisplayedFilterChanged(e.merger.getFilter()),e.onProgressChanged(e.poller.getProgress())}getSearchRequestBody(){let e=this.search||{},t=e.legs||[];return{search:{id:this.responseSearch.id,cabin:e.cabin,deviceType:this.deviceType,appType:this.appType,userLoggedIn:this.userLoggedIn,adultsCount:e.adultsCount,childrenCount:e.childrenCount,infantsCount:e.infantsCount,siteCode:this.siteCode,currencyCode:this.currency.code,locale:this.locale,legs:t.map(e=>({departureCityCode:e.departureCityCode,departureAirportCode:e.departureAirportCode,arrivalCityCode:e.arrivalCityCode,arrivalAirportCode:e.arrivalAirportCode,outboundDate:e.outboundDate}))},offset:this.processedFaresCount,paymentMethodIds:this.paymentMethodIds,providerTypes:this.providerTypes}}fetchTripsParams(){return{currencyCode:this.currency.code,locale:this.locale,paymentMethodIds:this.paymentMethodIds||[],offset:this.processedFaresCount}}}},function(e,t,r){var i=r(7),n=r(0),o=function(e){e=e||{},this.currency=e.currency};o.prototype={mergeResponse:function(e){var t=this._getUpdatedTripIds(e),r=e.legs;this._mergeStaticData(e),this._mergeLegs(r),this._mergeLegConditions(e.legConditionIds),this._mergeTrips(e.trips),this._mergeFilter(e.filters),this._mergeScores(e.scores),this._mergeFares(e.fares),this._cloneTrips(t)},reset:function(){this.__staticData=this._getEmptyStaticData(),this.__legMap={},this.__tripMap={},this.__trips=[],this.__filter=this._getEmptyFilter(),this.__filterOptionsMap=this._getEmptyFilterOptionsMap()},getTrips:function(){return this.__trips},getLegConditions:function(){return this.__staticData.legConditions},getFareConditions:function(){return this.__staticData.fareConditions},getFilter:function(){return this.__filter},updateCurrency:function(e){var t=this;t.currency=e;var r=t.__tripMap;for(var o in r)r[o].fares.forEach(function(t){t.price=i.convertPrice(t.price,e),t.paymentFees=i.convertPaymentFees(t.paymentFees,e)});t._cloneTrips(Object.keys(r));var s=t.__filter;t.__filterOptionTypes.forEach(function(r){var o=t.__filterOptionsMap[r];for(var s in o){var a=o[s];a.price=i.convertPrice(a.price,e),o[s]=n.cloneObject(a)}t._buildFilterOptions(r)}),s.minPrice=i.convertPrice(s.minPrice,e),s.maxPrice=i.convertPrice(s.maxPrice,e),t._cloneFilter()},_mergeStaticData:function(e){var t=this.__staticData;this.__staticDataTypes.forEach(function(r){!function(e,r,i){r&&r.forEach(function(r){var n=r.id||r.code;e[n]=r,"airports"===i?r.city=t.cities[r.cityCode]:"cities"===i&&(r.country=t.countries[r.countryCode])})}(t[r],e[r],r)})},_mergeLegs:function(e){if(e){var t=this,r=this.__legMap;e.forEach(function(e){var n=e.id;r[n]||(i.prepareLeg(e,t.__staticData),r[n]=e)})}},_mergeLegConditions:function(e){if(e){var t=this.__legMap,r=this.__staticData.legConditions;Object.keys(e).forEach(function(i){t[i]&&(t[i].conditions=e[i].map(function(e){return r[e]}),t[i].conditionIds=e[i])})}},_mergeTrips:function(e){if(e){var t=this,r=this.__tripMap;e.forEach(function(e){var n=e.id;if(!r[n]){var o=e.legIds||[];e.legs=o.map(function(e){return t.__legMap[e]}),i.prepareTrip(e),r[n]=e}})}},_mergeFares:function(e){if(e){var t=this;e.forEach(function(e){i.prepareFare(e,t.currency,t.__staticData);var r=e.tripId,n=t.__tripMap[r];if(n){for(var o=n.fares,s=0;s<o.length;s++){if(e.id===o[s].id)return;if(e.price.amountUsd<o[s].price.amountUsd)break}o.splice(s,0,e)}})}},_mergeScores:function(e){if(e){var t=this.__tripMap;for(var r in e){var i=t[r];i&&(i.score=e[r])}}},_mergeFilter:function(e){if(e){var t=this,r=t.__filter,n=t.multiCity,o=e.legs;o&&(o.forEach(function(e){i.prepareLegFilter(e,t.__staticData)}),r.legs=o),e.minPrice&&(r.minPrice=i.convertPrice(e.minPrice,t.currency)),e.maxPrice&&(r.maxPrice=i.convertPrice(e.maxPrice,t.currency)),e.stopoverDurations&&(r.stopoverDurations=e.stopoverDurations);var s={DIRECT:0,ONE_STOP:1,MORE_THAN_ONE_STOP:2};t.__filterOptionTypes.forEach(r=>{let a=(e,n)=>{e&&e.forEach(e=>{var o=n>=0;"stops"===r&&(e.code=s[e.code]);var a=(o?n+1+"_":"")+e.code;i.prepareFilterOption(e,r,t.currency,t.__staticData),t.__filterOptionsMap[r][a]=e,e.code=a,o&&(e.legIndex=n)})};if(n&&o)for(var c=o.length;c--;)a(o[c][r],c);else a(e[r]);t._buildFilterOptions(r)}),t._cloneFilter()}},_getUpdatedTripIds:function(e){var t={},r=this;if(e.scores)for(var i in e.scores)t[i]=!0;return e.fares&&e.fares.forEach(function(e){t[e.tripId]=!0}),Object.keys(t).filter(function(e){return r.__tripMap[e]})},_cloneTrips:function(e){var t=this.__tripMap;e.forEach(function(e){var r=t[e];r?(r.fares=n.cloneArray(r.fares),t[e]=n.cloneObject(r)):console.error("Trip with "+e+" is missing")}),this.__trips=n.mapValues(t)},_cloneFilter:function(){this.__filter=n.cloneObject(this.__filter)},_buildFilterOptions:function(e){var t=this,r=n.mapValues(t.__filterOptionsMap[e]);r.sort((r,i)=>{if("stops"===e){var n=r.code,o=i.code;return t.multiCity&&(n=n.substr(2),o=o.substr(2)),n-o}return r.name<i.name?-1:r.name===i.name?0:1}),t.__filter[e]=r},_getEmptyFilter:function(){var e={legs:[]};return this.__filterOptionTypes.forEach(function(t){e[t]=[]}),e},_getEmptyFilterOptionsMap:function(){var e={};return this.__filterOptionTypes.forEach(function(t){e[t]={}}),e},_getEmptyStaticData:function(){var e={};return this.__staticDataTypes.forEach(function(t){e[t]={}}),e},__staticDataTypes:["countries","cities","airlines","airports","providers","stops","alliances","fareConditions","legConditions"],__filterOptionTypes:["airlines","providers","stops","alliances","originAirports","destinationAirports","stopoverAirports","fareConditions","legConditions"]},e.exports=o},function(e,t){e.exports={prepareTrip:function(e){e.fares=[];var t=e.legs;if(t&&0!==t.length){e.legIdMap={},t.forEach(function(t,r){e.legIdMap[r+t.id]=!0});var r=t[0];!function(e,t){var r=0,i=e=>Math.min(e,2);t.forEach(function(e){var t=e.stopoversCount;r=Math.max(r,t),e.stopCode=i(t)}),e.stopCode=i(r)}(e,t),e.airlineCodes=n(t.map(function(e){return e.airlineCodes})),e.allianceCodes=n(t.map(function(e){return e.allianceCodes})),e.departureAirportCode=r.departureAirportCode,e.arrivalAirportCode=r.arrivalAirportCode,e.stopoverAirportCodeMap=i(t.map(function(e){return e.stopoverAirportCodes})),e.changeAirportAtStopover=function(e){for(var t=e.length;t--;)for(var r=e[t].segments,i=r.length-1;i>0;i--)if(r[i].departureAirportCode!==r[i-1].arrivalAirportCode)return!0;return!1}(t),e.stopoverDurationMinutes=function(e){var t=0;return e.forEach(function(e){t=Math.max(t,e)}),t}(t.map(function(e){return e.stopoverDurationMinutes})),e.durationMinutes=function(e){return e.reduce(function(e,t){return e+t.durationMinutes},0)}(t),e.departureTimeMinutes=r.departureTimeMinutes,e.arrivalTimeMinutes=t[t.length-1].arrivalTimeMinutes,e.marketingAirline=function(e){for(var t=null,r=0;r<e.length;r++){var i=e[r].longestSegment.airline;if(null===t)t=i;else if(t.code!=i.code)return null}return t}(t),e.overnight=function(e){var t=!1;return e.forEach(function(e){e.overnight&&(t=!0)}),t}(t),e.longStopover=function(e){var t=!1;return e.forEach(function(e){e.longStopover&&(t=!0)}),t}(t),e.destinationAirportCodes=function(e){var t=[e[0].arrivalAirportCode];if(e.length>1)for(var r=1;r<e.length;r++){var i=e[r].departureAirportCode;t.includes(i)||t.push(e[r].departureAirportCode)}return t}(t),e.originAirportCodes=function(e){var t=[e[0].departureAirportCode];if(e.length>1)for(var r=1;r<e.length;r++){var i=e[r].arrivalAirportCode;t.includes(i)||t.push(e[r].arrivalAirportCode)}return t}(t)}function i(e){var t={};return e.forEach(function(e){(e=e||[]).forEach(function(e){t[e]=!0})}),t}function n(e){return Object.keys(i(e))}},prepareLeg:function(e,t){var r=this,i=t.airports;e.departureAirport=i[e.departureAirportCode],e.arrivalAirport=i[e.arrivalAirportCode];var n=e.segments||[];n.forEach(function(e){r.prepareSegment(e,t)});var o=n.map(function(e){return e}).sort(function(e,t){return t.durationMinutes-e.durationMinutes});e.longestSegment=o[0];var s=o.map(function(e){return e.airline});e.airlines=function(e){return e.filter(function(e,t,r){return r.indexOf(e)==t})}(s)},prepareSegment:function(e,t){var r=t.airlines,i=t.airports;e.airline=r[e.airlineCode],e.operatingAirline=r[e.operatingAirlineCode],e.departureAirport=i[e.departureAirportCode],e.arrivalAirport=i[e.arrivalAirportCode]},prepareFare:function(e,t,r){e.provider=r.providers[e.providerCode],e.price=this.convertPrice(e.price,t),e.paymentFees=this.convertPaymentFees(e.paymentFees,t)},prepareFilterOption:function(e,t,r,i){var n=(i[this.__filterOptionTypeToStaticDataType[t]]||{})[e.code]||{};e.name=n.name,e.item=n,e.price=this.convertPrice(e.price,r)},prepareLegFilter:function(e,t){e.departureCity=t.cities[e.departureCityCode],e.departureAirport=t.airports[e.departureAirportCode],e.arrivalCity=t.cities[e.arrivalCityCode],e.arrivalAirport=t.airports[e.arrivalAirportCode]},convertPrice:function(e,t){if(!t)return e;if(!e)return null;var r=e.amount,i=e.totalAmount,n=e.originalAmount,o=0;if(e.paymentFeeAmountUsd&&(o=e.paymentFeeAmountUsd),e.currencyCode!=t.code){var s=t.rate;i=(r=(n=Math.round(e.originalAmountUsd*s))+Math.round(o*s))*Math.round(e.totalAmountUsd/e.amountUsd)}return{currency:t,amount:r,originalAmount:n,totalAmount:i,amountUsd:e.amountUsd,totalAmountUsd:e.totalAmountUsd,originalAmountUsd:e.originalAmountUsd,paymentFeeAmountUsd:o}},convertPaymentFee:function(e,t){if(!t)return e;if(!e)return null;var r=e.amount;if(e.currencyCode!==t.code){var i=t.rate;r=Math.round(e.amountUsd*i)}return{paymentMethodId:e.paymentMethodId,currencyCode:t.code,amount:r,amountUsd:e.amountUsd}},convertPaymentFees:function(e,t){if(!e)return null;var r=this;return e.map(function(e){return r.convertPaymentFee(e,t)})},__filterOptionTypeToStaticDataType:{airlines:"airlines",stops:"stops",alliances:"alliances",originAirports:"airports",destinationAirports:"airports",stopoverAirports:"airports",providers:"providers",fareConditions:"fareConditions",legConditions:"legConditions"}}},function(e,t,r){var i=r(0);e.exports={sortTrips:function(e,t){if(!t)return e;function r(e){return e.fares[0]?e.fares[0].price.amountUsd:null}function n(e){return function(t){var r=t.legs[e];return r&&r.departureTimeMinutes}}function o(e){return function(t){var r=t.legs[e];return r&&r.arrivalTimeMinutes+24*r.durationDays*60}}for(var s={PRICE:r,DURATION:function(e){return e.durationMinutes},SCORE:function(e){return e.score}},a=0;a<6;a++)s["LEG"+(a+1)+"_DEPARTURE_TIME"]=n(a),s["LEG"+(a+1)+"_ARRIVAL_TIME"]=o(a);var c=s[t.by]||function(){},u=i.cloneArray(e);return u.sort(function(e,n){var o=i.compare(e,n,c,t.order);return 0==o&&"PRICE"!=t.by?i.compare(e,n,r,"ASC"):o}),u},getCheapestTrip:function(e){return this._getBestTripBy(e,function(e,t){return e.fares[0].price.amountUsd<t.fares[0].price.amountUsd})},getFastestTrip:function(e){return this._getBestTripBy(e,function(e,t){return e.durationMinutes===t.durationMinutes?e.fares[0].price.amountUsd<t.fares[0].price.amountUsd:e.durationMinutes<t.durationMinutes})},getBestExperienceTrip:function(e){return this._getBestTripBy(e,function(e,t){return e.score===t.score?e.fares[0].price.amountUsd<t.fares[0].price.amountUsd:e.score>t.score})},_getBestTripBy:function(e,t){for(var r=e[0],i=1;i<e.length;i++)t(e[i],r)&&(r=e[i]);return r}}},function(e,t,r){var i=r(0);function n(e,t){return!t||(function(e,t){return-1!==t.indexOf("instant")&&e.provider.instant}(e,t)||function(e,t){return-1!==t.indexOf(e.provider.type)&&!e.provider.instant}(e,t))}function o(e,t){return!t||i.filterByKey(e.provider.code,t)}function s(e,t){if(!t)return!0;for(var r=t.length;r--;){if("NOT_OVERNIGHT"===t[r]&&e.overnight)return!1;if("SHORT_STOPOVER"===t[r]&&e.longStopover)return!1}return!0}function a(e,t,r){if(!t)return!0;for(var n=0;n<t.length;n++){var o=t[n],s=e.legs[o.legIndex];if(!i.filterByRange(s[r],o))return!1}return!0}function c(e,t,r){var i,n;return!function(e){return!!e&&0!==e.length}(t)||e.filter(function(e){i=e.conditionIds;for(var o=0;o<t.length;o++)if(n=u(t[o],r),i&&-1!==i.indexOf(n))return!0;return!1}).length>=1}function u(e,t){if(t)for(var r=Object.keys(t),i=0;i<r.length;i++)if(t[r[i]].code.toLowerCase()===e)return t[r[i]].id}e.exports={passLegConditions:function(e){this.legConditions=e},passFareConditions:function(e){this.fareConditions=e},filterTrips:function(e,t,r){if(!t)return e;var u=this,l=t.stopCodes,p=i.arrayToMaps(l,r),d=i.arrayToMaps(t.airlineCodes,r),h=i.arrayToMaps(t.allianceCodes,r),f=i.arrayToMap(t.originAirportCodes),g=i.arrayToMap(t.destinationAirportCodes),y=r&&i.arrayToMaps(t.stopoverAirportCodes,r),v=r&&i.arrayToMaps(t.itineraryOptions,r),m=t.stopoverDurationMinutesRanges,C={providerCodeMap:i.arrayToMap(t.providerCodes),providerTypes:t.providerTypes};return e.filter(function(e){if(!function(e,t){return!t||e.fares[0]&&i.filterByRange(e.fares[0].price.amountUsd,t)}(e,t.priceRange))return!1;if(r)for(var l=e.legs,_=l.length,T=0;T<_;T++){var I=l[T];if(p&&p[T]&&!p[T][I.stopCode])return!1;let t=(e,t)=>{var r=e&&Object.keys(e[T]||{}),i=r&&r.length;if(i){for(var n=!1,o=i;!n&&o&&o--;)n=t.indexOf(r[o])>=0;if(!n)return!1}return!0};if(!t(d,I.airlineCodes))return!1;if(!t(h,I.allianceCodes))return!1;if(!t(y,I.stopoverAirportCodes))return!1;if(!s(I,v&&Object.keys(v[T]||{})))return!1;if(!a(e,m,"stopoverDurationMinutes"))return!1}return(r||i.filterByKey(e.stopCode,p))&&a(e,t.departureTimeMinutesRanges,"departureTimeMinutes")&&a(e,t.arrivalTimeMinutesRanges,"arrivalTimeMinutes")&&(r||function(e,t){return!t||!!e.marketingAirline&&i.filterByKey(e.marketingAirline.code,t)}(e,d))&&(r||i.filterByAllKeys(e.allianceCodes,h))&&function(e,t){if(!t)return!0;for(var r=0;r<t.length;r++)if("SAME_AIRLINE"===t[r]&&e.airlineCodes.length>1)return!1;return!0}(e,t.tripOptions)&&i.filterByAllKeys(e.originAirportCodes,f)&&i.filterByAllKeys(e.destinationAirportCodes,g)&&(r||i.filterBySomeKeys(e.stopoverAirportCodeMap,t.stopoverAirportCodes))&&function(e,t){if(!t||0===t.length)return!0;for(var r=0;r<t.length;r++)if("NOT_CHANGE_AIRPORT"===t[r]&&e.changeAirportAtStopover)return!1;return!0}(e,t.stopoverOptions)&&a(e,t.durationMinutesRanges,"durationMinutes")&&(r||i.filterByRange(e.stopoverDurationMinutes,m&&m[0]))&&(r||s(e,t.itineraryOptions))&&i.filterByContainAllKeys(e.legIdMap,t.legIds)&&function(e,t){if(!t)return!0;var r=t.providerCodeMap,i=t.providerTypes;if(!r&&!i)return!0;var s=e.fares;if(!s)return!1;for(var a=0;a<s.length;a++){var c=o(s[a],r),u=n(s[a],i);if(c&&u)return!0}return!1}(e,C)&&c(e.fares,t.fareTypes,u.fareConditions)&&c(e.legs,t.flightTypes,u.legConditions)})}}},function(e,t,r){const i=r(11),n=r(12),o=r(13),s=r(3),a=r(1),c=r(2),u=[0,300,600,900,2400,3800,5e3,6e3];e.exports=class{constructor(e,t){let r=this;t=t||{},r.currency=t.currency||{},r.locale=t.locale,r.siteCode=t.siteCode,r.deviceType=t.deviceType||"DESKTOP",r.appType=t.appType||"WEB_APP",r.clientId=t.clientId,r.userLoggedIn=t.userLoggedIn,r.rateAmenityIds=t.rateAmenityIds||[],r.selectedHotelIds=t.selectedHotelIds||[],r.onProgressChanged=t.onProgressChanged||function(){},r.onHotelsChanged=t.onHotelsChanged||function(){},r.onTotalHotelsChanged=t.onTotalHotelsChanged||function(){},r.onDisplayedFilterChanged=t.onDisplayedFilterChanged||function(){},r.onSearchCreated=t.onSearchCreated||function(){},r.onDestinationInfoChanged=t.onDestinationInfoChanged||function(){},r.requestHeaders=t.requestHeaders,r.shortlistedHotelIds=t.shortlistedHotelIds||[],r.isLastPolling=t.isLastPolling||function(){},r.merger=new i,r.poller=new c({delays:u,pollLimit:u.length-1,initCallApi:()=>{const t={currencyCode:r.currency.code,locale:r.locale,clientId:r.clientId,amountType:"NIGHTLY"};return a.searchHotels(e,r.getSearchRequestBody(),t,r.requestHeaders)},callApi:()=>a.fetchHotels(e,r.responseSearch.id,r.fetchHotelsParams(),r.requestHeaders),onSuccessResponse:e=>(console.log("response"),console.log(e),r.handleSearchResponse(e))}),console.log("after options"),r.reset()}searchHotels(e){this.search=e,this.reset(),this.updateResult(),this.poller.start()}handleSearchResponse(e){let t=this;e.done&&(t.onLastPoll(),t.poller.stop()),t.mergeResponse(e),t.updateResult(),1===t.poller.pollCount&&t.onSearchCreated(e.search)}mergeResponse(e){let t=e.done||this.poller.isLastPolling();this.merger.mergeResponse(e,t),this.lastRatesCount=e.count,this.responseSearch=e.search,s.prepareResponseSearch(this.responseSearch,this.merger.getStaticData())}reset(){this.poller.reset(),this.merger.reset(),this.responseSearch={},this.lastRatesCount=0}updateSort(e){this.sort=e,this.updateResult()}updateFilter(e){this.filter=e,this.updateResult()}updateCurrency(e){this.currency=e,this.merger.updateCurrency(e),this.updateResult()}updateRateAmenityIds(e){this.rateAmenityIds=e,this.reset(),this.poller.reset(),this.updateResult(),this.poller.start()}updateResult(){let e=this.merger.getHotels(),t=o.filterHotels(e,this.filter),r=n.sortHotels(t,this.sort);this.onHotelsChanged(r),this.onTotalHotelsChanged(e),this.onDisplayedFilterChanged(this.merger.getFilter()),this.onProgressChanged(this.poller.getProgress()),this.onDestinationInfoChanged(this.merger.getStaticData().destinationInfo)}getSearchRequestBody(){let e,t=this.search||{},r=(this.currency||{}).code,i=this.locale,n=s.trimArray(this.selectedHotelIds),o=this.shortlistedHotelIds,a=this.isLastPolling;return console.log(o),console.log("inside"),e={search:{id:this.responseSearch.id,siteCode:this.siteCode,locale:i,currencyCode:r,cityCode:t.cityCode,hotelId:t.hotelId,districtId:t.districtId,regionId:t.regionId,countryCode:t.countryCode,rooms:t.rooms,checkIn:t.checkIn,checkOut:t.checkOut,deviceType:this.deviceType,appType:this.appType,userLoggedIn:this.userLoggedIn},rateAmenityIds:this.rateAmenityIds,offset:this.lastRatesCount},n.length&&Array.isArray(n)&&(e.selectedHotelIds=n),o.length&&Array.isArray(o)&&(e.shortlistedHotelIds=o,console.log(e),console.log(e.shortlistedHotelIds),console.log("searchParams")),e.isLastPolling=a,e}fetchHotelsParams(){const e={currencyCode:this.currency.code,locale:this.locale,offset:this.lastRatesCount||0,amountType:"NIGHTLY",clientId:this.clientId,isLastPolling:this.isLastPolling};let t=this.trackingParams||{};for(let r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);console.log(typeof this.selectedHotelIds);let r=s.trimArray(this.selectedHotelIds);return r.length&&Array.isArray(r)&&(e.selectedHotelIds=r),e.shortlistedHotelIds=this.shortlistedHotelIds,this.poller.isLastPolling()&&(e.isLastPolling=!0,console.log(e.isLastPolling),console.log(e),console.log("params")),e}}},function(e,t,r){var i=r(0),n=r(3),o=function(e){e=e||{},this.currency=e.currency};o.prototype={reset:function(){this.__staticData=this._getEmptyStaticData(),this.__hotelMap={},this.__hotels=[],this.__filter=this._getEmptyFilter(),this.__filterOptionsMap=this._getEmptyFilterOptionsMap()},mergeResponse:function(e,t=!1){var r=this._getUpdatedHotelIds(e);this._mergeStaticData(e),this._mergeHotels(e.hotels),this._mergeFilter(Object.assign({},e.rentalFilter,e.filter)),this._mergeRates(e.rates,t),this._mergeSortedRatesByBasePrice(),this._mergeScores(e.scores),this._mergeRatesCounts(e.providerRatesCounts),this._cloneHotels(r)},getFilter:function(){return this.__filter},getHotels:function(){return this.__hotels},getStaticData:function(){return this.__staticData},updateCurrency:function(e){this.currency=e;var t=this.__hotelMap;for(var r in t)t[r].rates.forEach(function(t){t.price=n.convertPrice(t.price,e)});this._cloneHotels(Object.keys(t));var o=this.__filter;o.minPrice=n.convertPrice(o.minPrice,e),o.maxPrice=n.convertPrice(o.maxPrice,e),this.__filter=i.cloneObject(this.__filter)},_mergeStaticData:function(e){var t=this.__staticData;this.__staticDataTypes.forEach(function(r){!function(e,t,r){if(t)if(Array.isArray(t))t.forEach(function(t){var i="providers"===r||"cities"===r?t.code:t.id;e[i]=t});else for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])}(t[r],e[r],r)})},_mergeHotels:function(e){if(e){var t=this,r=this.__hotelMap;e.forEach(function(e){n.prepareHotel(e,t.__staticData),r[e.id]=r[e.id]||e})}},_mergeRates:function(e,t){if(e){var r=this;e.forEach(function(e){n.prepareRate(e,r.currency,r.__staticData);var t=e.hotelId,i=r.__hotelMap[t];if(i){var o,s=i.rates;for(o=0;o<s.length&&!n.isBetterRate(e,s[o]);o++)if(e.providerCode===s[o].providerCode)return;for(s.splice(o,0,e),o++;o<s.length;o++)if(e.providerCode===s[o].providerCode){s.splice(o,1);break}}}),t&&this._lastMergeRates(e)}},_mergeSortedRatesByBasePrice:function(){var e;for(var t in this.__hotelMap)this.__hotelMap[t]&&(e=i.cloneArray(this.__hotelMap[t].rates).sort(function(e,t){var r=e.price.totalAmount,i=t.price.totalAmount,n=e.price.totalTaxAmount,o=t.price.totalTaxAmount;return r-n==i-o?t.price.ecpc-e.price.ecpc:r-n-(i-o)}),this.__hotelMap[t].sortedRatesByBasePrice=e)},_lastMergeRates:function(e){if(e){var t={};for(var r in this.__hotelMap)this.__hotelMap[r].rates&&1===this.__hotelMap[r].rates.length&&(t[r]=!0);var i={};for(var o in e){var s=e[o];if(t[s.hotelId]){i[s.hotelId]||(i[s.hotelId]=[]);var a,c=i[s.hotelId];for(a=0;a<c.length&&!n.isBetterRate(s,c[a]);a++);c.splice(a,0,s)}}for(var r in t){var u=this.__hotelMap[r].rates[0];(c=i[r])&&(c[0].id!==u.id&&c.splice(0,0,u),this.__hotelMap[r].rates=c)}}},_mergeScores:function(e){if(e){var t=this.__hotelMap;for(var r in e){var i=t[r];i&&(i.score=e[r])}}},_mergeRatesCounts:function(e){if(e){var t=this;e.forEach(function(e){var r=t.__hotelMap[e.hotelId];if(r){var i=e.providerCode,n=e.ratesCount,o=r.ratesCounts[i]||0;r.ratesCounts[i]=n,r.ratesCounts.total-=o,r.ratesCounts.total+=n}})}},_mergeFilter:function(e){if(e){var t=this.__filter,r=this;e.minPrice&&(t.minPrice=n.convertPrice(e.minPrice,this.currency)),e.maxPrice&&(t.maxPrice=n.convertPrice(e.maxPrice,this.currency)),e.maxBedroomsCount&&(t.airbnbMaxBedroomCount=e.maxBedroomsCount),this.__filterOptionTypes.forEach(function(t){(e[t]||[]).forEach(function(e){n.prepareFilterOption(e,t,r.__staticData),r.__filterOptionsMap[t][e.code]=e}),r._buildFilterOptions(t)}),this.__filter=i.cloneObject(this.__filter)}},_getEmptyStaticData:function(){var e={};return this.__staticDataTypes.forEach(function(t){e[t]={}}),e},_getEmptyFilterOptionsMap:function(){var e={};return this.__filterOptionTypes.forEach(function(t){e[t]={}}),e},_buildFilterOptions:function(e){this.__filter[e]=i.mapValues(this.__filterOptionsMap[e]).sort(function(e,t){return e.name<t.name?-1:e.name===t.name?0:1})},_getEmptyFilter:function(){var e={};return this.__filterOptionTypes.forEach(function(t){e[t]=[]}),e},_getUpdatedHotelIds:function(e){var t={},r=this;if(e.rates&&e.rates.forEach(function(e){t[e.hotelId]=!0}),e.scores)for(var i in e.scores)t[i]=!0;return e.providerRatesCounts&&e.providerRatesCounts.forEach(function(e){t[e.hotelId]=!0}),Object.keys(t).filter(function(e){return r.__hotelMap[e]})},_cloneHotels:function(e){var t=this.__hotelMap;e.forEach(function(e){var r=t[e];r?(r.rates=i.cloneArray(r.rates),r.ratesCounts=i.cloneObject(r.ratesCounts),t[e]=i.cloneObject(r)):console.error("Hotel with "+e+" is missing")}),this.__hotels=i.mapValues(t)},__staticDataTypes:["stars","brands","propertyTypes","districts","cities","amenities","rateAmenities","chains","providers","roomTypeCategories","destinationInfo"],__filterOptionTypes:["stars","brands","propertyTypes","districts","cities","amenities","rateAmenities","chains","reviewerGroups","roomTypeCategories"]},e.exports=o},function(e,t,r){var i=r(0);e.exports={sortHotels:function(e,t){if(!t)return e;function r(e){return e.rates&&e.rates.length>0?e.rates[0].price.amountUsd:null}function n(e){return e.rates&&e.rates.length>0}function o(e){return void 0!==e}function s(e){return function(t){var r=t.reviewMap[e];return r?r.score:null}}var a={PRICE:r,DISCOUNT:function(e){return n(e)&&o(e.rates[0].usualPrice)?Math.round(100*e.rates[0].usualPrice.discountToUsualAmount):null},SAVINGS:function(e){var t;return n(e)&&o(e.rates[0].usualPrice)?(t=e.rates[0].usualPrice,Math.round(t.usualAmountUsd*t.discountToUsualAmount)):null},ALL_REVIEW_SCORE:s("ALL"),FAMILY_REVIEW_SCORE:s("FAMILY"),BUSINESS_REVIEW_SCORE:s("BUSINESS"),COUPLE_REVIEW_SCORE:s("COUPLE"),SOLO_REVIEW_SCORE:s("SOLO"),STAR:function(e){return 0===e.star?void 0:e.star},SCORE:function(e){return e.score},DISTANCE_TO_CITY_CENTER:function(e){return e.distanceToCityCentre},DISTANCE_TO_NEAREST_AIRPORT:function(e){return e.distanceToNearestAirport}}[t.by]||function(){},c=i.cloneArray(e);return c.sort(function(e,n){var o=i.compare(e,n,a,t.order);return 0==o&&"PRICE"!=t.by?i.compare(e,n,r,"ASC"):o}),c}}},function(e,t,r){var i=r(0);e.exports={filterHotels:function(e,t){if(!t)return e;var r=i.arrayToMap(t.stars),n=i.arrayToMap(t.districtIds),o=i.arrayToMap(t.cityCodes),s=i.arrayToMap(t.propertyTypeIds),a=i.arrayToMap(t.airbnbTypes),c=i.arrayToMap(t.brandIds),u=i.arrayToMap(t.chainIds);return e.filter(function(e){var l=function(e,t){return!t||e.rates[0]&&i.filterByRange(e.rates[0].price.amountUsd,t)}(e,t.priceRange)&&i.filterByKey(e.star,r)&&i.filterByContainAllKeys(e.amenityIdMap,t.amenityIds)&&i.filterByKey(e.districtId,n)&&i.filterByKey(e.cityCode,o)&&i.filterByKey(e.propertyTypeId,s)&&i.filterByKey(e.brandId,c)&&function(e,t){if(!t)return!0;if(i.filterByTextMatching(e.name,t))return!0;if(!e.nameI18n)return!1;for(var r in e.nameI18n)if(i.filterByTextMatching(e.nameI18n[r],t))return!0;return!1}(e,t.name)&&i.filterByKey(e.chainId,u)&&function(e,t){if(!t||0===t.length)return!0;for(var r=0;r<t.length;r++){var i=e.reviewMap[t[r]];if(i&&i.score>=80&&i.count>=100)return!0}return!1}(e,t.reviewerGroups)&&function(e,t){if(!t||0===t.length)return!0;var r=e.rates;if(!r)return!1;for(var i=0;i<r.length;i++)for(var n=0;n<t.length;n++)if(r[i].rateAmenityIds.includes(parseInt(t[n])))return!0;return!1}(e,t.rateAmenityIds)&&function(e,t){if(!t||0===t.length)return!0;var r=e.rates;if(!r)return!1;for(var i=0;i<r.length;i++)if(t.includes(r[i].providerCode))return!0;return!1}(e,t.providerCodes)&&function(e,t){if(!t||0===t.length)return!0;var r=e.rates;if(!r)return!1;for(var i=0;i<r.length;i++)if(void 0!==r[i].usualPrice)return!0;return!1}(e,t.deals);return 39===e.propertyTypeId?l&&function(e,t){return!t||i.filterByRange(e.reviewsScore,t)}(e,t.reviewScoreRange)&&function(e,t){return!(t>0)||e.bedroomsCount>=t}(e,t.airbnbBedroomCount?t.airbnbBedroomCount:0)&&i.filterByKey(e.roomTypeCategoryId,a):l&&function(e,t){if(!t)return!0;var r=e.reviewMap.ALL||{};return i.filterByRange(r.score,t)}(e,t.reviewScoreRange)})}}},function(e,t,r){const i=r(1),n=r(2),o=[0,300,600,900,2400,3800,5e3,6e3];e.exports=class{constructor(e,t){let r=this;t=t||{},r.currency=t.currency||{},r.locale=t.locale,r.searchId=t.searchId,r.siteCode=t.siteCode,r.deviceType=t.deviceType||"DESKTOP",r.appType=t.appType||"WEB_APP",r.clientId=t.clientId,r.userLoggedIn=t.userLoggedIn,r.onProgressChanged=t.onProgressChanged||function(){},r.onHotelRatesChanged=t.onHotelRatesChanged||function(){},r.onSearchCreated=t.onSearchCreated||function(){},r.requestHeaders=t.requestHeaders,r.similarHotels=t.similarHotels||{},r.hotelDetailsEndpointUrl=e,r.poller=new n({delays:o,pollLimit:7,callApi:()=>{const e={currencyCode:r.currency.code,locale:r.locale,clientId:r.clientId,amountType:"NIGHTLY"};let t=r.trackingParams||{};for(let r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return r.similarHotels&&(e.similarHotelLimit=r.similarHotels.limit),r.searchId&&(e.searchId=r.searchId),i.fetchHotelRates(r.search.hotelId,e)},onSuccessResponse:e=>r.handleSearchResponse(e)}),r.reset()}searchHotelRates(e,t){let r=this;if(r.search=e,r.searchId=void 0,void 0!==t)r.reset(),r.onProgressChanged(r.poller.getProgress()),r.searchId=t,r.poller.start();else{const e={currencyCode:r.currency.code,locale:r.locale,clientId:r.clientId,amountType:"NIGHTLY"};i.searchHotel(r.hotelDetailsEndpointUrl,r.getSearchRequestBody(),e,r.requestHeaders).then(e=>{r.reset(),r.onProgressChanged(r.poller.getProgress()),r.searchId=e.search.id,r.onSearchCreated(e.search),r.poller.start()})}}handleSearchResponse(e){this.onProgressChanged(this.poller.getProgress()),this.onHotelRatesChanged(e)}reset(){this.poller.reset()}updateCurrency(e){this.currency=e}getSearchRequestBody(){let e=this,t=e.search||{},r=(e.currency||{}).code,i=e.locale,n={};return n={search:{cityCode:t.cityCode,rooms:t.rooms,hotelId:t.hotelId,checkIn:t.checkIn,checkOut:t.checkOut,locale:i,siteCode:e.siteCode,currencyCode:r,deviceType:e.deviceType,appType:e.appType,userLoggedIn:e.userLoggedIn}},void 0!==e.searchId&&(n.search.id=e.searchId),null!=e.similarHotels&&(n.similarHotels=e.similarHotels),n}}}])});