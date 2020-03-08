import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import Fire from '../Fire';

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { CurrentLocationButton } from './components/CurrentLocationButton';

import MapViewDirections from 'react-native-maps-directions';

import Moment from 'react-moment';

const api = 'AIzaSyC9n4og6V7sDCw-tTRvlrOjo20Eq1EaM4w';

export default class GroupDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    var uid = props.navigation.state.params.uid;

    this.state = {
      uid: uid,
      data: '',
      region: null,
      destination: null,
      origin: null,
      membersData: [],
      durations: []
    };
  }

  componentDidMount() {
    //Mengambil _getLocationAsync
    this._getLocationAsync();
    //Mengambil data dari Firebase melalui UID yang di pass dari halaman sebelumnya
    var ref = firebase.database().ref('groups/' + this.state.uid);
    ref.on('value', snapshot => {
      const data = snapshot.val();
      let destination = snapshot.val().lokasi;
      this.setState({ data });
      this.setState({ destination });
    });

    firebase
      .database()
      .ref('groupmember/' + this.state.uid)
      .on('value', snapshot => {
        var membersId = this.snapshotToArray(snapshot);
        membersId.forEach(item => {
          firebase
            .database()
            .ref('users/' + item)
            .once('value')
            .then(childSnapshot => {
              // childSnapshot.forEach(child => {
              // console.log(childSnapshot.val().latitude);
              var childname = childSnapshot.val().nama;
              var childLat = childSnapshot.val().latitude;
              var childLng = childSnapshot.val().longitude;
              var coord = {
                name: childname,
                latitude: childLat,
                longitude: childLng
              };
              // console.log(childSnapshot.val());
              this.setState(
                { membersData: this.state.membersData.concat(coord) }
                // () => console.log(this.state.membersData)
              );
              // });
            });
        });
        this.setState({ membersId });
      });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted')
      console.log('Permission to access location was denied.');

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true
    });
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045
    };
    let origin = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    this.setState({ region });
    this.setState({ origin });
    Fire.shared.addLocation(this.state.region);
  };

  snapshotToArray = snapshot => {
    var returnArr = [];

    snapshot.forEach(childSnapshot => {
      var item = childSnapshot.key;
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

  centerMap() {
    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    } = this.state.region;

    this.map.animateToRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{this.state.data.nama}</Text>
        </View>

        <CurrentLocationButton
          cb={() => {
            this.centerMap();
          }}
        />
        <MapView
          style={styles.mapStyle}
          initialRegion={this.state.region}
          showsUserLocation={true}
          showsCompass={false}
          rotateEnabled={false}
          ref={map => {
            this.map = map;
          }}
        >
          {this.state.membersData.map((coordinate, index) => (
            <MapViewDirections
              key={index}
              origin={coordinate}
              destination={this.state.destination}
              apikey={api}
              strokeWidth={3}
              strokeColor={String(
                '#' +
                  (0x1000000 + Math.random() * 0xffffff)
                    .toString(16)
                    .substr(1, 6)
              )}
              onReady={result => {
                let durations = result.duration;
                this.setState(
                  { durations: this.state.durations.concat(durations) }
                  // () => console.log(this.state.membersData)
                );
              }}
              onError={errorMessage => {
                console.log(errorMessage);
              }}
            />
          ))}
          {this.state.membersData.map((coordinate, index) => (
            <MapView.Marker
              key={`coordinate_${index}`}
              coordinate={coordinate}
              title={coordinate.name}
            />
          ))}
        </MapView>
        <View>
          <Text>
            {'Meeting will start '}
            <Moment fromNow element={Text} locale='id-ID'>
              {this.state.data.waktu}
            </Moment>
          </Text>
          <Text>
            All Attendants will arrive at{' '}
            {Number(Math.max(...this.state.durations).toFixed(2))} miniutes.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.back}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons
            name='ios-arrow-round-back'
            size={32}
            color='#FFF'
          ></Ionicons>
        </TouchableOpacity>
        {console.log(this.state)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    flexDirection: 'column'
  },
  avatarContainer: {
    shadowColor: '#151734',
    shadowRadius: 30,
    shadowOpacity: 0.4
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68
  },
  name: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600'
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(21, 22, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3E936A'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'justify',
    textTransform: 'capitalize'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height:
      Dimensions.get('window').height -
      (Dimensions.get('window').height * 20) / 100
  }
});
