// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const Stack = createStackNavigator();

// // Register Screen
// const RegisterScreen = ({ navigation }: any) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!name || !email || !password) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }
//     setLoading(true);
//     try {
//       const { user } = await auth().createUserWithEmailAndPassword(
//         email,
//         password,
//       );
//       // Save user profile to Firestore
//       await firestore().collection('users').doc(user.uid).set({
//         name,
//         email: user.email,
//         uid: user.uid,
//         createdAt: firestore.FieldValue.serverTimestamp(),
//         lastSeen: firestore.FieldValue.serverTimestamp(),
//         isOnline: true,
//       });
//       Alert.alert('Success', 'Account created! Logging in...');
//       // Auto-navigate handled by auth listener in App
//     } catch (error: any) {
//       Alert.alert('Error', error.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button
//         title={loading ? 'Creating...' : 'Register'}
//         onPress={handleRegister}
//         disabled={loading}
//       />
//       <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
//         Already have an account? Login
//       </Text>
//     </View>
//   );
// };

// // Login Screen
// const LoginScreen = ({ navigation }: any) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }
//     setLoading(true);
//     try {
//       await auth().signInWithEmailAndPassword(email, password);
//       // Update online status in Firestore
//       const { uid }: any = auth().currentUser;
//       await firestore().collection('users').doc(uid).update({
//         isOnline: true,
//         lastSeen: firestore.FieldValue.serverTimestamp(),
//       });
//       Alert.alert('Success', 'Logged in!');
//       // Auto-navigate handled by auth listener
//     } catch (error: any) {
//       Alert.alert('Error', error.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button
//         title={loading ? 'Signing in...' : 'Login'}
//         onPress={handleLogin}
//         disabled={loading}
//       />
//       <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
//         Don't have an account? Register
//       </Text>
//     </View>
//   );
// };

// // Home Screen: List of users
// const HomeScreen = ({ navigation }: any) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const currentUid = auth().currentUser?.uid;

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('users')
//       .where('uid', '!=', currentUid) // Exclude self
//       .onSnapshot(querySnapshot => {
//         const userList: any = [];
//         querySnapshot.forEach(doc => {
//           userList.push({ id: doc.id, ...doc.data() });
//         });
//         setUsers(userList);
//         setLoading(false);
//       });
//     return unsubscribe;
//   }, [currentUid]);

//   const startChat = (otherUser: any) => {
//     const chatId = [currentUid, otherUser.uid].sort().join('_'); // Deterministic ID
//     navigation.navigate('Chat', { chatId, otherUser });
//   };

//   const handleLogout = async () => {
//     const { uid }: any = auth().currentUser;
//     await firestore().collection('users').doc(uid).update({ isOnline: false });
//     await auth().signOut();
//   };

//   if (loading) return <ActivityIndicator size="large" style={styles.center} />;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Chats</Text>
//         <Button title="Logout" onPress={handleLogout} />
//       </View>
//       <FlatList
//         data={users}
//         keyExtractor={item => item.uid}
//         renderItem={({ item }: any) => (
//           <TouchableOpacity
//             onPress={() => startChat(item)}
//             style={styles.userItem}
//           >
//             <Text style={styles.userName}>{item.name}</Text>
//             <Text style={styles.userStatus}>
//               {item.isOnline
//                 ? 'Online'
//                 : `Last seen: ${item.lastSeen?.toDate?.() || 'Never'}`}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// // Chat Screen
// const ChatScreen = ({ route, navigation }: any) => {
//   const { chatId, otherUser } = route.params;
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const currentUid = auth().currentUser.uid;

//   useEffect(() => {
//     // Listen to messages
//     const unsubscribe = firestore()
//       .collection('chats')
//       .doc(chatId)
//       .collection('messages')
//       .orderBy('timestamp', 'asc')
//       .onSnapshot(querySnapshot => {
//         const msgList: any = [];
//         querySnapshot.forEach(doc => {
//           msgList.push({ id: doc.id, ...doc.data() });
//         });
//         setMessages(msgList);
//         setLoading(false);
//       });

//     // Create chat doc if doesn't exist (with participants)
//     firestore()
//       .collection('chats')
//       .doc(chatId)
//       .set(
//         {
//           participants: [currentUid, otherUser.uid],
//           createdAt: firestore.FieldValue.serverTimestamp(),
//         },
//         { merge: true },
//       );

//     return unsubscribe;
//   }, [chatId, otherUser.uid, currentUid]);

//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     await firestore()
//       .collection('chats')
//       .doc(chatId)
//       .collection('messages')
//       .add({
//         text: text.trim(),
//         senderUid: currentUid,
//         timestamp: firestore.FieldValue.serverTimestamp(),
//         read: false,
//       });
//     setText('');
//   };

//   if (loading) return <ActivityIndicator size="large" style={styles.center} />;

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.chatContainer}>
//         <View style={styles.chatHeader}>
//           <Text style={styles.otherUserName}>{otherUser.name}</Text>
//           <Button title="Back" onPress={() => navigation.goBack()} />
//         </View>
//         <FlatList
//           data={messages}
//           keyExtractor={item => item.id}
//           renderItem={({ item }: any) => (
//             <View
//               style={[
//                 styles.message,
//                 item.senderUid === currentUid
//                   ? styles.myMessage
//                   : styles.otherMessage,
//               ]}
//             >
//               <Text>{item.text}</Text>
//               <Text style={styles.timestamp}>
//                 {item.timestamp?.toDate?.().toLocaleTimeString()}
//               </Text>
//             </View>
//           )}
//           style={styles.messagesList}
//         />
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             value={text}
//             onChangeText={setText}
//             placeholder="Type a message..."
//           />
//           <Button title="Send" onPress={sendMessage} />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const App = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(user => {
//       setUser(user);
//       if (initializing) setInitializing(false);
//     });
//     return subscriber;
//   }, [initializing]);

//   if (initializing)
//     return <ActivityIndicator size="large" style={styles.center} />;

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {user ? (
//             <>
//               <Stack.Screen name="Home" component={HomeScreen} />
//               <Stack.Screen name="Chat" component={ChatScreen} />
//             </>
//           ) : (
//             <>
//               <Stack.Screen name="Login" component={LoginScreen} />
//               <Stack.Screen name="Register" component={RegisterScreen} />
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#F5FCFF',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   link: {
//     marginTop: 10,
//     textAlign: 'center',
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#ddd',
//   },
//   userItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   userStatus: {
//     fontSize: 12,
//     color: '#666',
//   },
//   chatContainer: {
//     flex: 1,
//   },
//   chatHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#ddd',
//   },
//   otherUserName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   messagesList: {
//     flex: 1,
//     padding: 10,
//   },
//   message: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//     maxWidth: '80%',
//   },
//   myMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//   },
//   otherMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#E5E5EA',
//   },
//   timestamp: {
//     fontSize: 10,
//     color: '#999',
//     alignSelf: 'flex-end',
//     marginTop: 5,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginRight: 10,
//     borderRadius: 20,
//   },
// });

// export default App;
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles, colors } from './src/utils/styles';
import {
  onAuthStateChanged,
  usersRef,
  serverTimestamp,
} from './src/services/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import { ConversationProvider } from './src/context/ConversationContext';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const currentUidRef = useRef<string | null>(null);
  const graceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Single auth listener
  useEffect(() => {
    const subscriber = onAuthStateChanged((user: any) => {
      console.log(
        'Auth change:',
        user ? `Logged in: ${user.uid}` : 'Logged out',
      );
      setUser(user);
      if (initializing) setInitializing(false);

      if (user) {
        currentUidRef.current = user.uid;
        // Manual online set with verify
        usersRef()
          .doc(user.uid)
          .update({ isOnline: true })
          .then(() => {
            console.log('Manual online set SUCCESS for', user.uid);
            // Verify
            return usersRef().doc(user.uid).get();
          })
          .then(doc => {
            const isOnline = doc.data()?.isOnline;
            console.log(
              'Verify isOnline after set:',
              isOnline ? 'true' : 'false',
            );
            if (!isOnline) console.error('Write failed—check rules/data!');
          })
          .catch(error => {
            console.error('Online set ERROR:', error.code, error.message);
          });
      } else {
        // Logout offline
        const lastUid = currentUidRef.current;
        if (lastUid) {
          usersRef()
            .doc(lastUid)
            .update({ isOnline: false, lastSeen: serverTimestamp() })
            .then(() => console.log('Manual offline set for', lastUid))
            .catch(error => console.error('Offline set error:', error));
          currentUidRef.current = null;
        }
      }
    });
    return subscriber;
  }, [initializing]);

  // AppState listener (no DB)
  useEffect(() => {
    let isGracePeriod = true; // Start in grace
    const handleAppStateChange = (nextAppState: string) => {
      const uid = currentUidRef.current;
      if (!uid || isGracePeriod) return;

      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('App background - setting offline for', uid);
        usersRef()
          .doc(uid)
          .update({ isOnline: false, lastSeen: serverTimestamp() })
          .then(() => console.log('Background offline set'))
          .catch(error => console.error('Background offline error:', error));
      } else if (nextAppState === 'active') {
        console.log('App foreground - setting online for', uid);
        usersRef()
          .doc(uid)
          .update({ isOnline: true })
          .then(() => console.log('Foreground online set'))
          .catch(error => console.error('Foreground online error:', error));
      }
    };

    // Grace: Enable after 10s (covers login/mount)
    graceTimerRef.current = setTimeout(() => {
      isGracePeriod = false;
      console.log('AppState grace ended - listener active');
    }, 10000);

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription?.remove();
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, []);

  if (initializing) {
    return <ActivityIndicator size="large" style={globalStyles.center} />;
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <NavigationContainer>
        <SafeAreaView
          edges={['bottom']}
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          <ConversationProvider>
            <AppNavigator user={user} />
          </ConversationProvider>
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
