import React, {useState, useEffect} from 'react';
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';

function App(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState({
    visible: false,
    textContent: '',
  });

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '1055576109862-u2pqgi7o5j4aruvju1q4jqooc1a5ftdh.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const createAlert = (title, message) => {
    Alert.alert(title, message, [
      {
        text: 'Cancel',
      },
      {
        text: 'Retry',
        onPress: () => signIn(),
      },
    ]);
  };

  const signIn = async () => {
    setLoading({
      visible: true,
      textContent: 'Please wait while we sign you in',
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
      setLoggedIn(true);
    } catch (error) {
      createAlert(`Error Code ${error.code}`, error.message);
    } finally {
      setLoading({
        visible: false,
        textContent: '',
      });
    }
  };

  const signOut = async () => {
    setLoading({
      visible: true,
      textContent: 'Signing you out...',
    });
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setLoggedIn(false);
    } catch (error) {
      createAlert(`Error Code ${error.code}`, error.message);
    } finally {
      setLoading({
        visible: false,
        textContent: '',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {loading && (
          <Spinner
            visible={loading.visible}
            color={styles.spinnerColor.color}
            textContent={loading.textContent}
            textStyle={styles.spinnerColor}
          />
        )}
        <View style={styles.container}>
          {loggedIn && user ? (
            <View style={styles.container_view}>
              <Text style={styles.text_h3}>
                Hey, {user.user.name} 👋 ! Welcome.
              </Text>
              <Image
                source={{uri: user.user.photo}}
                style={{width: 150, height: 150, margin: 16}}
              />
              <Text style={styles.text_p}>Name: {user.user.name}</Text>
              <Text style={styles.text_p}>Email: {user.user.email}</Text>
              <View style={styles.signout_container}>
                <Text style={styles.text_p}>
                  Press the button below to sign out
                </Text>
                <TouchableOpacity style={styles.signout_btn}>
                  <Button onPress={signOut} title="signout">
                    Sign Out
                  </Button>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.container_view}>
              <Text style={styles.text_h3}>
                Please sign in using your Google Account
              </Text>
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  container_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#6082b6',
    borderWidth: 2,
    padding: 16,
  },
  text_h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  text_p: {
    fontSize: 16,
    color: '#000',
  },
  spinnerColor: {
    color: '#36454f',
  },
  signout_container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    color: '#000',
  },
  signout_btn: {
    marginTop: 16,
    width: 150,
    color: '#000',
  },
});

export default App;
