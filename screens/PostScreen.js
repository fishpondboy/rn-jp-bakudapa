import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Fire from '../Fire';

import { DestinationButton } from './components/DestinationButton';
import { CurrentLocationButton } from './components/CurrentLocationButton';

posts = [
  {
    id: '1',
    avatar: require('../assets/tempAvatar.jpg')
  },
  {
    id: '2',
    avatar: require('../assets/tempAvatar.jpg')
  }
];

export default class PostScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: null
    };

    this._getLocationAsync();
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

    this.setState({ region: region });
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

  renderPost = post => {
    return (
      <View style={styles.feedItem}>
        <Image source={post.avatar} style={styles.avatar} />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <View style={{ height: 100, backgroundColor: '#fff', margin: 15 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 7
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
              data={posts}
              renderItem={({ item }) => this.renderPost(item)}
              keyExtractor={item => item.id}
              horizontal={true}
            />
          </View>
        </View>
        <DestinationButton />
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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  header: {
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3E936A'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    borderRadius: 5,
    padding: 8,
    marginVertical: 8
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16
  },
  mapStyle: {
    height: Dimensions.get('window').height,
    marginHorizontal: 18
  }
});
