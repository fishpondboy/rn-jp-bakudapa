import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;

export const DestinationButton = function(props) {
  return (
    <TouchableOpacity onPress={() => {}} style={styles.container}>
      <View style={styles.leftCol}>
        <Text style={{ fontSize: 8 }}>{`\u25A0`}</Text>
      </View>
      <View style={styles.centerCol}>
        <Text
          style={{
            fontFamily: 'sans-serif-thin',
            fontSize: 21,
            color: '#545454'
          }}
        >
          Where To?
        </Text>
      </View>
      <View style={styles.rightCol}>
        <Ionicons
          name='md-car'
          color='black'
          size={25}
          style={{ alignSelf: 'center' }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9,
    position: 'absolute',
    flexDirection: 'row',
    width: WIDTH - 70,
    height: 60,
    top: 270,
    left: 35,
    borderRadius: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: 'black',
    elevation: 7,
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  leftCol: {
    flex: 1,
    alignItems: 'center'
  },
  centerCol: {
    flex: 4
  },
  rightCol: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: '#ededed'
  }
});
