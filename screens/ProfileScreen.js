import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import Fire from '../Fire';
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  state = {
    user: {}
  };

  // unsubscribe = null;

  componentDidMount() {
    const uid = this.props.uid || Fire.shared.uid;

    // this.unsubscribe = Fire.shared.firestore
    //   .collection('users')
    //   .doc(user)
    //   .onSnapshot(doc => {
    //     this.setState({ user: doc.data() });
    //   });

    var ref = firebase.database().ref('users/' + uid);
    ref.on('value', snapshot => {
      const user = snapshot.val();

      this.setState({ user }, () => console.log(this.state.user));
    });
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 64, alignItems: 'center' }}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                this.state.user.avatar
                  ? { uri: this.state.user.avatar }
                  : require('../assets/tempAvatar.jpg')
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>Hi, {this.state.user.nama}!</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            color='#0D6038'
            onPress={() => {
              Fire.shared.signOut();
            }}
            title='Log out'
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
  }
});
