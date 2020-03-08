import FirebaseKeys from './config';
import firebase from 'firebase';
require('firebase/firestore');

class Fire {
  constructor() {
    firebase.initializeApp(FirebaseKeys);
  }

  uploadPhotoAsync = (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase
        .storage()
        .ref(filename)
        .put(file);

      upload.on(
        'state_changed',
        snapshot => {},
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  createUser = async user => {
    let remoteUri = null;

    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);

      // let db = this.firestore.collection('users').doc(this.uid);
      let db = firebase.database().ref('users/' + this.uid);

      // db.set({
      //   nama: user.name,
      //   email: user.email,
      //   avatar: null
      // });
      db.set({
        nama: user.name,
        email: user.email,
        avatar: null
      });

      if (user.avatar) {
        remoteUri = await this.uploadPhotoAsync(
          user.avatar,
          `avatars/${this.uid}`
        );

        db.set({ avatar: remoteUri }, { merge: true });
      }
    } catch (error) {
      alert('Error: ', error);
    }
  };

  addLocation = async region => {
    try {
      let db = firebase.database().ref('users/' + this.uid);

      db.update({
        latitude: region.latitude,
        longitude: region.longitude
      });
    } catch (error) {
      alert('Error: ', error);
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }

  get groupData() {
    return firebase.database();
  }
}

Fire.shared = new Fire();
export default Fire;
