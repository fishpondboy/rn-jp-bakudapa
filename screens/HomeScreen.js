import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Fire from '../Fire';
import * as firebase from 'firebase';

import { DestinationButton } from './components/DestinationButton';
import { CurrentLocationButton } from './components/CurrentLocationButton';

export default class PostScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: null,
      groupsData: [],
    };

    // this._getLocationAsync();
  }

  componentDidMount() {
    this._getLocationAsync();
    var ref = firebase.database().ref('groups');
    ref.once('value').then((snapshot) => {
      // console.log(snapshot.val());

      // get children as an array
      var items = [];
      snapshot.forEach((child) => {
        items.push({
          id: child.key,
          gambar: child.val().gambar,
          nama: child.val().nama,
          waktu: child.val().waktu,
          lokasi: child.val().lokasi,
        });
      });

      this.setState({ groupsData: items });
    });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted')
      console.log('Permission to access location was denied.');

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045,
    };

    this.setState({ region: region });
    // console.log(this.state.region.latitude);
    Fire.shared.addLocation(this.state.region);
  };

  centerMap() {
    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    } = this.state.region;

    this.map.animateToRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    });
  }

  renderGroups = (group) => {
    return (
      <View style={styles.feedItem}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('groupDetail', { uid: group.id })
          }
        >
          <Image
            source={
              group.gambar
                ? { uri: group.gambar }
                : require('../assets/tempAvatar.jpg')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <View style={styles.upper}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 7,
            }}
          >
            <Text>Groups</Text>
            <TouchableOpacity>
              <Text style={{ color: '#3E936A' }}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3 }}>
            <FlatList
              style={styles.feed}
              data={this.state.groupsData}
              renderItem={({ item }) => this.renderGroups(item)}
              keyExtractor={(item) => item.id}
              horizontal={true}
            />
          </View>
        </View>
        {/* <DestinationButton /> */}
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
          ref={(map) => {
            this.map = map;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3E936A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    borderRadius: 5,
    padding: 8,
    marginVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
    borderColor: '#3E936A',
    borderWidth: 2,
  },
  mapStyle: {
    height: Dimensions.get('window').height,
    marginHorizontal: 18,
  },
  upper: {
    height: 100,
    backgroundColor: '#fff',
    margin: 15,
    // borderColor: '#3E936A',
    // borderWidth: 1
  },
});
