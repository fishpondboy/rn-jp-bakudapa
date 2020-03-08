import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const CurrentLocationButton = function(props) {
  const cb = props.cb
    ? props.cb
    : () =>
        console.log('Callback function not passed to CurrentLocationButton!');
  const bottom = props.bottom ? props.bottom : 120;

  return (
    <View style={[styles.container, { top: HEIGHT - bottom }]}>
      <MaterialIcons
        name='my-location'
        color='black'
        size={25}
        onPress={() => {
          cb();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9,
    position: 'absolute',
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    left: WIDTH - 70,
    borderRadius: 50,
    shadowColor: 'black',
    elevation: 7,
    shadowRadius: 5,
    shadowOpacity: 1.0,
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});
