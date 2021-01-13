import {Alert, ClippingRectangle} from "react-native";
import React, {useRef} from 'react';
import * as Location from "expo-location";
import axios from "axios";
import Loading from "./Loading.js";
import Weather from "./Weather.js";
import TodoList from "./TodoList.js";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { StyleSheet, Text, View, Animated , StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const API_KEY_W = "5d1b494f274e3d05c3c482573b0e265b";
const API_KEY_G = "AIzaSyDwbQRz-Ohwv71K8x7mwcDLk6PRgCrzG_A";
const weatherOption = {
  Thunderstorm : {
      iconName: "ios-thunderstorm-outline",
      gradient: ["#485563","#29323c"]
  },
  Drizzle: {
      iconName:"rainy-outline",
      gradient: ["#5c258d", "#4389a2"]
  }, 
  Rain: {
      iconName: "rainy-outline",
      gradient: ["#bdc3c7", "#2c3e50"]
  },
  Snow: {
      iconName: "snow",
      gradient: ["#5c258d", "#4389a2"]
  },
  Clear: {
      iconName:"sunny-outline",
      gradient: ["#348ac7", "#7474bf"]
  },
  Clouds: {
      iconName: "cloudy-outline",
      gradient: ["#1f1c2c","#928dab"]
  },
  Mist: {
    iconName: "cloudy-outline",
    gradient: ["#1f1c2c","#928dab"]
},
Haze: {
  iconName: "cloudy-outline",
  gradient: ["#1f1c2c","#928dab"]
},
};


var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //



    function dfs_xy_conv(code, v1, v2) {
      var DEGRAD = Math.PI / 180.0;
      var RADDEG = 180.0 / Math.PI;

      var re = RE / GRID;
      var slat1 = SLAT1 * DEGRAD;
      var slat2 = SLAT2 * DEGRAD;
      var olon = OLON * DEGRAD;
      var olat = OLAT * DEGRAD;

      var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
      sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
      var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
      sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
      var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
      ro = re * sf / Math.pow(ro, sn);
      var rs = {};
      if (code == "toXY") {
          rs['lat'] = v1;
          rs['lng'] = v2;
          var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
          ra = re * sf / Math.pow(ra, sn);
          var theta = v2 * DEGRAD - olon;
          if (theta > Math.PI) theta -= 2.0 * Math.PI;
          if (theta < -Math.PI) theta += 2.0 * Math.PI;
          theta *= sn;
          rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
          rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
      }
      else {
          rs['x'] = v1;
          rs['y'] = v2;
          var xn = v1 - XO;
          var yn = ro - v2 + YO;
          ra = Math.sqrt(xn * xn + yn * yn);
          if (sn < 0.0) - ra;
          var alat = Math.pow((re * sf / ra), (1.0 / sn));
          alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

          if (Math.abs(xn) <= 0.0) {
              theta = 0.0;
          }
          else {
              if (Math.abs(yn) <= 0.0) {
                  theta = Math.PI * 0.5;
                  if (xn < 0.0) - theta;
              }
              else theta = Math.atan2(xn, yn);
          }
          var alon = theta / sn + olon;
          rs['lat'] = alat * RADDEG;
          rs['lng'] = alon * RADDEG;
      }
      return rs;
  }



export default class extends React.Component {

 

  state = {
    isLoading: true,
    swipe: false,
    fadeAnime: new Animated.Value(1)
  };


  swipeUp = (state)=>{
    this.setState({swipe: true});
    Animated.timing(this.state.fadeAnime, 
      {
        toValue: 6,
        duration: 200,
        useNativeDriver: false
      }).start()
}


swipeDown = (state)=> {
  this.setState({swipe: false});
  Animated.timing(this.state.fadeAnime, 
    {
      toValue: 1,
      duration: 200,
      useNativeDriver: false
    }).start()
}
  
  getWeather = async(latitude, longitude) => {
    const {data: {main: {temp}, weather}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY_W}&units=metric`);
    
    const Adress = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY_G}&language=ko`);
    this.setState({isLoading: false, temp: temp, location: Adress.data.results[0].address_components[1].long_name, weather: weather[0].main});
  };

  getLocation = async() =>{

    try{
      await Location.requestPermissionsAsync();
      const {coords: { latitude, longitude}} = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      const position = dfs_xy_conv("toXY",latitude,longitude);
    }
    catch(error){
      Alert.alert("위치정보 확인 실패", "위치정보 제공에 동의해 주세요");
    }
  };

  componentDidMount() { 
    this.getLocation();
  }
  
  render() {
    const {isLoading, temp, location, weather, swipe, fadeAnime} = this.state;
    
    return (
        
        isLoading ? (<Loading /> ): 
          
        (
        <LinearGradient
           colors={weatherOption[weather].gradient}
           style={styles.background}
         >
           <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true}/>
          <GestureRecognizer
            style={styles.container}
            onSwipeDown={(state) => this.swipeDown(state)}
            onSwipeUp={(state) => this.swipeUp(state)}>
                <Animated.View style={styles.weather} >
                  <Weather temp={Math.round(temp)} location={location} weather={weatherOption[weather].iconName} swipe={swipe}/>  
                </Animated.View>
                <Animated.View style={styles.todoList} flex={fadeAnime}>
                  <TodoList swipe={swipe}/>
                </Animated.View>  
        </GestureRecognizer>
                </ LinearGradient>
        )
        
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
  },
  weather: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
  }
});