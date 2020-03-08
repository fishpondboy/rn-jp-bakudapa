import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupsData: []
    };
  }

  componentDidMount() {
    var ref = firebase.database().ref('groups');
    ref.once('value').then(snapshot => {
      // console.log(snapshot.val());

      // get children as an array
      var items = [];
      snapshot.forEach(child => {
        items.push({
          id: child.key,
          gambar: child.val().gambar,
          nama: child.val().nama,
          waktu: child.val().waktu,
          lokasi: child.val().lokasi
        });
      });

      this.setState({ groupsData: items });
      console.log(this.state.groupsData);
    });
  }

  renderGroups = group => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('groupDetail', { uid: group.id })
        }
      >
        <View style={styles.feedItem}>
          <Image
            source={
              group.gambar
                ? { uri: group.gambar }
                : require('../assets/tempAvatar.jpg')
            }
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.groupName}>{group.nama}</Text>
            <Text style={styles.detail}>
              Time: {group.waktu}
              {'\n'}
              Location: {group.lokasi.nama}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Groups</Text>
        </View>
        {/* <View style={styles.titleContainer}>
          <Text style={styles.title}>Groups</Text>
          <TouchableOpacity>
            <Ionicons
              name='ios-add-circle'
              size={50}
              color='#3E936A'
              style={{ padding: 15 }}
            ></Ionicons>
          </TouchableOpacity>
        </View> */}
        <View style={styles.mainContainer}>
          <FlatList
            style={styles.feed}
            data={this.state.groupsData}
            renderItem={({ item }) => this.renderGroups(item)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#ebebeb'
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
  groupName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#454D65',
    textTransform: 'capitalize'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'justify'
  },
  title: {
    color: '#3E936A',
    fontSize: 40,
    margin: 15
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainContainer: {
    margin: 15,
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    flex: 7
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    flexDirection: 'row',
    padding: 8,
    marginVertical: 8,
    justifyContent: 'space-between'
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 18,
    marginRight: 16
  },
  detail: {
    fontSize: 11,
    color: '#C4C6CE',
    marginTop: 4
  }
});
