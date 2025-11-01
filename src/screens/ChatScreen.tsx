// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   FlatList,
// //   TextInput,
// //   ActivityIndicator,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Text,
// // } from 'react-native';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import {
// //   chatsRef,
// //   serverTimestamp,
// //   currentUser,
// //   chatDocRef,
// //   updateTypingStatus,
// //   groupMessagesRef,
// //   markAsRead,
// //   incrementUnreadCount,
// //   initializeChatDoc,
// // } from '../services/firebase';
// // import { usersRef } from '../services/firebase';
// // import { globalStyles, colors } from '../utils/styles';
// // import Header from '../components/Header';
// // import MessageBubble from '../components/MessageBubble';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import Layout from './Layout';
// // import ChatHeader from '../components/ChatHeader';
// // import { formatLastSeen } from '../utils/time';

// // const ChatScreen = () => {
// //   const route = useRoute();
// //   const { chatId, otherUser, group }: any = route.params;
// //   const isGroup = !!group;
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const navigation = useNavigation();
// //   const currentUid = currentUser()?.uid;
// //   const [isTyping, setIsTyping] = useState(false);
// //   const [isOtherTyping, setIsOtherTyping] = useState(false);
// //   const [senderNames, setSenderNames] = useState({});
// //   const typingTimeout = useRef<NodeJS.Timeout | null>(null);

// //   // Get all participants
// //   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

// //   // Fetch sender names for groups
// //   useEffect(() => {
// //     if (!isGroup || !messages.length) return;
// //     const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
// //     uniqueUids.forEach(uid => {
// //       if (!senderNames[uid]) {
// //         usersRef()
// //           .doc(uid)
// //           .get()
// //           .then(doc => {
// //             if (doc.exists) {
// //               setSenderNames(prev => ({ ...prev, [uid]: doc.data().name }));
// //             }
// //           })
// //           .catch(error => console.error('Fetch sender name error:', error));
// //       }
// //     });
// //   }, [messages, isGroup, senderNames]);

// //   useEffect(() => {
// //     if (!chatId || !currentUid) return;

// //     // Initialize chat document with all participants
// //     initializeChatDoc(chatId, allParticipants, isGroup);

// //     // Use groupMessagesRef if group, else chatsRef
// //     const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// //     const unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
// //       querySnapshot => {
// //         const msgList: any = [];
// //         querySnapshot.forEach(doc => {
// //           msgList.push({ id: doc.id, ...doc.data() });
// //         });
// //         setMessages(msgList);
// //         setLoading(false);
// //       },
// //       error => {
// //         console.error('Chat listen error:', error);
// //         setLoading(false);
// //       },
// //     );

// //     // Mark as read when entering chat
// //     markAsRead(chatId, currentUid, isGroup)
// //       .then(() => console.log('Marked read successfully for', chatId))
// //       .catch(error => {
// //         console.error('Mark read error:', error.message);
// //       });

// //     return unsubscribe;
// //   }, [chatId, currentUid, isGroup]);

// //   useEffect(() => {
// //     if (!chatId || !currentUid) return;

// //     const typingUnsub = chatDocRef(chatId).onSnapshot(doc => {
// //       if (doc.exists) {
// //         const typingBy = doc.data()?.typingBy || [];
// //         const otherTyping = typingBy.some(
// //           uid =>
// //             (isGroup ? group.members.includes(uid) : uid === otherUser.uid) &&
// //             uid !== currentUid,
// //         );
// //         setIsOtherTyping(otherTyping);
// //       }
// //     });

// //     return () => {
// //       typingUnsub();
// //       if (typingTimeout.current) {
// //         clearTimeout(typingTimeout.current);
// //         typingTimeout.current = null;
// //       }
// //     };
// //   }, [chatId, otherUser?.uid, group?.members, currentUid, isGroup]);

// //   const handleInputChange = (newText: string) => {
// //     setText(newText);
// //     if (newText.trim() && !isTyping) {
// //       setIsTyping(true);
// //       updateTypingStatus(chatId, currentUid, true);
// //     }
// //     if (typingTimeout.current) clearTimeout(typingTimeout.current);
// //     typingTimeout.current = setTimeout(() => {
// //       if (isTyping) {
// //         setIsTyping(false);
// //         updateTypingStatus(chatId, currentUid, false);
// //       }
// //     }, 1500);
// //   };

// //   const sendMessage = async () => {
// //     if (!text.trim()) return;

// //     const messageText = text.trim();
// //     setText(''); // Clear input immediately
// //     setIsTyping(false);
// //     if (typingTimeout.current) {
// //       clearTimeout(typingTimeout.current);
// //       typingTimeout.current = null;
// //     }
// //     updateTypingStatus(chatId, currentUid, false);

// //     try {
// //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);

// //       // Send message
// //       await ref.add({
// //         text: messageText,
// //         senderUid: currentUid,
// //         timestamp: serverTimestamp(),
// //         read: false,
// //       });

// //       // Increment unread count for other participants
// //       await incrementUnreadCount(chatId, currentUid, isGroup, allParticipants);

// //       console.log('Message sent and unread count updated');
// //     } catch (error) {
// //       console.error('Send message error:', error);
// //       // Optionally show error to user
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <View
// //         style={[globalStyles.center, { backgroundColor: colors.background }]}
// //       >
// //         <ActivityIndicator size="large" color={colors.primary} />
// //       </View>
// //     );
// //   }

// //   const typingText = isOtherTyping
// //     ? isGroup
// //       ? 'Someone is typing...'
// //       : `${otherUser.name} is typing...`
// //     : null;

// //   return (
// //     <Layout statusBarColor={colors.primary}>
// //       <View style={globalStyles.container}>
// //         <ChatHeader
// //           name={isGroup ? group.name : otherUser.name}
// //           lastSeen={
// //             isGroup
// //               ? group.isOnline
// //                 ? ''
// //                 : group.lastSeen
// //               : otherUser.isOnline
// //               ? ''
// //               : formatLastSeen(otherUser.lastSeen)
// //           }
// //           isOnline={isGroup ? group.isOnline : otherUser.isOnline}
// //           onBack={() => navigation.goBack()}
// //         />

// //         <FlatList
// //           data={messages}
// //           keyExtractor={(item: any) => item.id}
// //           renderItem={({ item }: any) => (
// //             <MessageBubble
// //               text={item.text}
// //               isMe={item.senderUid === currentUid}
// //               timestamp={item.timestamp}
// //               senderName={
// //                 isGroup && item.senderUid !== currentUid
// //                   ? senderNames[item.senderUid] || 'Unknown'
// //                   : undefined
// //               }
// //             />
// //           )}
// //           style={{ flex: 1, padding: 10 }}
// //           contentContainerStyle={{ paddingBottom: 100 }}
// //           ListFooterComponent={
// //             typingText ? (
// //               <View style={styles.typingIndicator}>
// //                 <Text style={styles.typingText}>{typingText}</Text>
// //               </View>
// //             ) : null
// //           }
// //         />
// //         <View style={styles.inputContainer}>
// //           <TextInput
// //             style={styles.textInput}
// //             value={text}
// //             onChangeText={handleInputChange}
// //             placeholder="Type a message..."
// //             multiline
// //             maxLength={500}
// //           />
// //           <TouchableOpacity
// //             onPress={sendMessage}
// //             style={styles.sendButton}
// //             disabled={!text.trim()}
// //           >
// //             <Icon
// //               name="send"
// //               size={24}
// //               color={text.trim() ? colors.primary : colors.textSecondary}
// //             />
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </Layout>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   inputContainer: {
// //     flexDirection: 'row',
// //     padding: 10,
// //     backgroundColor: colors.background,
// //     borderTopWidth: 1,
// //     borderTopColor: colors.textSecondary,
// //     alignItems: 'flex-end',
// //   },
// //   textInput: {
// //     flex: 1,
// //     borderWidth: 1,
// //     borderColor: colors.textSecondary,
// //     padding: 12,
// //     marginRight: 10,
// //     borderRadius: 20,
// //     backgroundColor: '#fff',
// //     maxHeight: 100,
// //   },
// //   sendButton: {
// //     padding: 10,
// //     justifyContent: 'center',
// //   },
// //   typingIndicator: {
// //     alignSelf: 'flex-start',
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     backgroundColor: '#E5E5EA',
// //     borderRadius: 15,
// //     margin: 10,
// //     maxWidth: '80%',
// //   },
// //   typingText: {
// //     fontSize: 14,
// //     color: colors.textSecondary,
// //     fontStyle: 'italic',
// //   },
// // });

// // export default ChatScreen;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   FlatList,
//   TextInput,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { globalStyles, colors } from '../utils/styles';
// import Layout from './Layout';
// import ChatHeader from '../components/ChatHeader';
// import MessageBubble from '../components/MessageBubble';
// import {
//   chatsRef,
//   serverTimestamp,
//   currentUser,
//   chatDocRef,
//   updateTypingStatus,
//   groupMessagesRef,
//   markAsRead,
//   incrementUnreadCount,
//   initializeChatDoc,
// } from '../services/firebase';
// import { usersRef } from '../services/firebase';
// import { formatLastSeen } from '../utils/time';

// const ChatScreen = () => {
//   const route = useRoute();
//   const { chatId, otherUser, group }: any = route.params;
//   const isGroup = !!group;
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();
//   const currentUid = currentUser()?.uid;
//   const [isTyping, setIsTyping] = useState(false);
//   const [isOtherTyping, setIsOtherTyping] = useState(false);
//   const [senderNames, setSenderNames] = useState({});
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const flatListRef = useRef<FlatList>(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

//   useEffect(() => {
//     if (!isGroup || !messages.length) return;
//     const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
//     uniqueUids.forEach(uid => {
//       if (!senderNames[uid]) {
//         usersRef()
//           .doc(uid)
//           .get()
//           .then(doc => {
//             if (doc.exists) {
//               setSenderNames(prev => ({ ...prev, [uid]: doc.data().name }));
//             }
//           })
//           .catch(console.error);
//       }
//     });
//   }, [messages, isGroup, senderNames]);

//   useEffect(() => {
//     if (!chatId || !currentUid) return;

//     let unsubscribe;

//     const setupChat = async () => {
//       try {
//         // Ensure chat document exists
//         await initializeChatDoc(chatId, allParticipants, isGroup);

//         // Now set up message listener
//         const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//         unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
//           async querySnapshot => {
//             // Make callback async
//             const msgList: any = [];
//             querySnapshot.forEach(doc =>
//               msgList.push({ id: doc.id, ...doc.data() }),
//             );
//             setMessages(msgList);
//             setLoading(false);
//             setTimeout(
//               () => flatListRef.current?.scrollToEnd({ animated: true }),
//               300,
//             );

//             // Mark as read on every snapshot change (initial + new messages)
//             // This ensures unread resets immediately for incoming messages
//             await markAsRead(chatId, currentUid, isGroup).catch(console.error);
//           },
//           error => {
//             console.error('Chat listen error:', error);
//             setLoading(false);
//           },
//         );
//       } catch (error) {
//         console.error('Setup chat error:', error);
//         setLoading(false);
//       }
//     };

//     setupChat();

//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, [chatId, currentUid, isGroup]);

//   useEffect(() => {
//     if (!chatId || !currentUid) return;

//     const typingUnsub = chatDocRef(chatId).onSnapshot(doc => {
//       if (doc.exists) {
//         const typingBy = doc.data()?.typingBy || [];
//         const otherTyping = typingBy.some(
//           uid =>
//             (isGroup ? group.members.includes(uid) : uid === otherUser.uid) &&
//             uid !== currentUid,
//         );
//         setIsOtherTyping(otherTyping);
//       }
//     });

//     return () => {
//       typingUnsub();
//       if (typingTimeout.current) clearTimeout(typingTimeout.current);
//     };
//   }, [chatId, otherUser?.uid, group?.members, currentUid, isGroup]);

//   const handleInputChange = (newText: string) => {
//     setText(newText);
//     if (newText.trim() && !isTyping) {
//       setIsTyping(true);
//       updateTypingStatus(chatId, currentUid, true);
//     }
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);
//     typingTimeout.current = setTimeout(() => {
//       setIsTyping(false);
//       updateTypingStatus(chatId, currentUid, false);
//     }, 1500);
//   };

//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     const messageText = text.trim();
//     setText('');
//     setIsTyping(false);
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);
//     updateTypingStatus(chatId, currentUid, false);

//     try {
//       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//       await ref.add({
//         text: messageText,
//         senderUid: currentUid,
//         timestamp: serverTimestamp(),
//         read: false,
//       });
//       await incrementUnreadCount(chatId, currentUid, isGroup, allParticipants);
//       flatListRef.current?.scrollToEnd({ animated: true });
//     } catch (error) {
//       console.error('Send message error:', error);
//     }
//   };

//   const typingText = isOtherTyping
//     ? isGroup
//       ? 'Someone is typing...'
//       : `${otherUser.name} is typing...`
//     : null;

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 600,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   if (loading) {
//     return (
//       <View
//         style={[globalStyles.center, { backgroundColor: colors.background }]}
//       >
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <Layout statusBarColor={colors.primary} paddingBottom={1}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={80}
//       >
//         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
//           <ChatHeader
//             name={isGroup ? group.name : otherUser.name}
//             lastSeen={
//               isGroup
//                 ? group.isOnline
//                   ? ''
//                   : group.lastSeen
//                 : otherUser.isOnline
//                 ? ''
//                 : formatLastSeen(otherUser.lastSeen)
//             }
//             isOnline={isGroup ? group.isOnline : otherUser.isOnline}
//             onBack={() => navigation.goBack()}
//             typing={isOtherTyping}
//           />

//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(item: any) => item.id}
//             renderItem={({ item }: any) => (
//               <MessageBubble
//                 text={item.text}
//                 isMe={item.senderUid === currentUid}
//                 timestamp={item.timestamp}
//                 senderName={
//                   isGroup && item.senderUid !== currentUid
//                     ? senderNames[item.senderUid] || 'Unknown'
//                     : undefined
//                 }
//               />
//             )}
//             style={{ flex: 1, paddingHorizontal: 10 }}
//             contentContainerStyle={{ paddingBottom: 100 }}
//             onContentSizeChange={() =>
//               flatListRef.current?.scrollToEnd({ animated: true })
//             }
//           />

//           {typingText ? (
//             <View style={styles.typingIndicator}>
//               <Text style={styles.typingText}>{typingText}</Text>
//             </View>
//           ) : null}

//           <View style={styles.inputWrapper}>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.textInput}
//                 value={text}
//                 onChangeText={handleInputChange}
//                 placeholder="Type a message..."
//                 multiline
//               />
//               <TouchableOpacity
//                 onPress={sendMessage}
//                 style={[
//                   styles.sendButton,
//                   !text.trim() && { backgroundColor: '#ddd' },
//                 ]}
//                 disabled={!text.trim()}
//               >
//                 <Icon
//                   name="send"
//                   size={22}
//                   color={text.trim() ? '#fff' : '#999'}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   inputWrapper: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: 'transparent',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginHorizontal: 10,
//     marginBottom: 10,
//     borderRadius: 30,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   textInput: {
//     flex: 1,
//     paddingHorizontal: 12,
//     maxHeight: 120,
//     fontSize: 16,
//     color: '#333',
//   },
//   sendButton: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 20,
//     marginLeft: 8,
//   },
//   typingIndicator: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#eee',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginLeft: 15,
//     marginBottom: 10,
//   },
//   typingText: {
//     fontStyle: 'italic',
//     color: '#666',
//   },
// });

// export default ChatScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageDeleteIcon from 'react-native-vector-icons/Entypo';
import { globalStyles, colors } from '../utils/styles';
import Layout from './Layout';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import {
  chatsRef,
  serverTimestamp,
  currentUser,
  chatDocRef,
  updateTypingStatus,
  groupMessagesRef,
  markAsRead,
  incrementUnreadCount,
  initializeChatDoc,
} from '../services/firebase';
import { usersRef } from '../services/firebase';
import { formatLastSeen } from '../utils/time';

const ChatScreen = () => {
  const route = useRoute();
  const { chatId, otherUser, group }: any = route.params;
  const isGroup = !!group;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentUid = currentUser()?.uid;
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [senderNames, setSenderNames] = useState({});
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

  useEffect(() => {
    if (!isGroup || !messages.length) return;
    const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
    uniqueUids.forEach(uid => {
      if (!senderNames[uid]) {
        usersRef()
          .doc(uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              setSenderNames(prev => ({ ...prev, [uid]: doc.data().name }));
            }
          })
          .catch(console.error);
      }
    });
  }, [messages, isGroup, senderNames]);

  useEffect(() => {
    if (!chatId || !currentUid) return;

    let unsubscribe;

    const setupChat = async () => {
      try {
        // Ensure chat document exists
        await initializeChatDoc(chatId, allParticipants, isGroup);

        // Now set up message listener
        const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
        unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
          async querySnapshot => {
            // Make callback async
            const msgList: any = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
              // Filter out messages deleted for current user (but not if globally deleted)
              if (
                data.deletedFor &&
                data.deletedFor[currentUid] &&
                !data.deletedGlobally
              ) {
                return;
              }
              msgList.push({ id: doc.id, ...data });
            });
            setMessages(msgList);
            setLoading(false);
            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: true }),
              300,
            );

            // Mark as read on every snapshot change (initial + new messages)
            // This ensures unread resets immediately for incoming messages
            await markAsRead(chatId, currentUid, isGroup).catch(console.error);
          },
          error => {
            console.error('Chat listen error:', error);
            setLoading(false);
          },
        );
      } catch (error) {
        console.error('Setup chat error:', error);
        setLoading(false);
      }
    };

    setupChat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId, currentUid, isGroup]);

  useEffect(() => {
    if (!chatId || !currentUid) return;

    const typingUnsub = chatDocRef(chatId).onSnapshot(doc => {
      if (doc.exists) {
        const typingBy = doc.data()?.typingBy || [];
        const otherTyping = typingBy.some(
          uid =>
            (isGroup ? group.members.includes(uid) : uid === otherUser.uid) &&
            uid !== currentUid,
        );
        setIsOtherTyping(otherTyping);
      }
    });

    return () => {
      typingUnsub();
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [chatId, otherUser?.uid, group?.members, currentUid, isGroup]);

  const handleInputChange = (newText: string) => {
    setText(newText);
    if (newText.trim() && !isTyping) {
      setIsTyping(true);
      updateTypingStatus(chatId, currentUid, true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(chatId, currentUid, false);
    }, 1500);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const messageText = text.trim();
    setText('');
    setIsTyping(false);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    updateTypingStatus(chatId, currentUid, false);

    try {
      const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
      await ref.add({
        text: messageText,
        senderUid: currentUid,
        timestamp: serverTimestamp(),
        read: false,
        deletedGlobally: false,
        deletedFor: {},
      });
      await incrementUnreadCount(chatId, currentUid, isGroup, allParticipants);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const deleteForMe = async (messageId: string) => {
    try {
      const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
      await ref.doc(messageId).update({
        [`deletedFor.${currentUid}`]: true,
      });
      // Immediately remove from local state for instant feedback
      setMessages(prev => prev.filter((m: any) => m.id !== messageId));
    } catch (error) {
      console.error('Delete for me error:', error);
      Alert.alert('Error', 'Failed to delete message for you.');
    }
  };

  const deleteForEveryone = async (messageId: string) => {
    try {
      const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
      await ref.doc(messageId).update({
        deletedGlobally: true,
      });
      // Immediately update local state for instant feedback
      setMessages(prev =>
        prev.map((m: any) =>
          m.id === messageId ? { ...m, deletedGlobally: true } : m,
        ),
      );
    } catch (error) {
      console.error('Delete for everyone error:', error);
      Alert.alert('Error', 'Failed to delete message for everyone.');
    }
  };

  const handleLongPress = (item: any) => {
    if (item.senderUid !== currentUid || item.deletedGlobally) {
      Alert.alert('Error', 'You can only delete your own messages.');
      return;
    }
    setSelectedMessageId(item.id);
    setShowDeleteModal(true);
  };

  const typingText = isOtherTyping
    ? isGroup
      ? 'Someone is typing...'
      : `${otherUser.name} is typing...`
    : null;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading) {
    return (
      <View
        style={[globalStyles.center, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Layout statusBarColor={colors.primary} paddingBottom={1}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ChatHeader
            name={isGroup ? group.name : otherUser.name}
            lastSeen={
              isGroup
                ? group.isOnline
                  ? ''
                  : group.lastSeen
                : otherUser.isOnline
                ? ''
                : formatLastSeen(otherUser.lastSeen)
            }
            isOnline={isGroup ? group.isOnline : otherUser.isOnline}
            onBack={() => navigation.goBack()}
            typing={isOtherTyping}
          />

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }: any) => {
              if (item.deletedGlobally) {
                return (
                  <View
                    style={{
                      alignSelf:
                        item.senderUid === currentUid
                          ? 'flex-end'
                          : 'flex-start',
                      marginVertical: 5,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#8d8888ff',
                      padding: 8,
                      borderRadius: 12,
                      gap: 5,
                    }}
                  >
                    <MessageDeleteIcon name="block" color={'white'} />

                    <Text
                      style={{
                        color: '#ffffffff',
                        fontStyle: 'italic',
                        fontSize: 14,
                      }}
                    >
                      This message was deleted
                    </Text>
                  </View>
                );
              }
              return (
                <TouchableWithoutFeedback
                  onLongPress={() => handleLongPress(item)}
                >
                  <View>
                    <MessageBubble
                      text={item.text}
                      isMe={item.senderUid === currentUid}
                      timestamp={item.timestamp}
                      senderName={
                        isGroup && item.senderUid !== currentUid
                          ? senderNames[item.senderUid] || 'Unknown'
                          : undefined
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
            style={{ flex: 1, paddingHorizontal: 10 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {typingText ? (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>{typingText}</Text>
            </View>
          ) : null}

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={handleInputChange}
                placeholder="Type a message..."
                multiline
              />
              <TouchableOpacity
                onPress={sendMessage}
                style={[
                  styles.sendButton,
                  !text.trim() && { backgroundColor: '#ddd' },
                ]}
                disabled={!text.trim()}
              >
                <Icon
                  name="send"
                  size={22}
                  color={text.trim() ? '#fff' : '#999'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
          statusBarTranslucent={true}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: colors.background,
                padding: 20,
                borderRadius: 10,
                width: '80%',
              }}
            >
              <Text
                style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}
              >
                Delete Message
              </Text>
              <Text
                style={{ marginBottom: 22, fontSize: 16, fontStyle: 'italic' }}
              >
                Are you sure you want to delete this message?
              </Text>
              <TouchableOpacity
                style={{
                  // backgroundColor: '#ddd',
                  paddingHorizontal: 10,
                  marginBottom: 16,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setShowDeleteModal(false);
                  deleteForMe(selectedMessageId);
                }}
              >
                <Text style={{ textAlign: 'right', fontSize: 16 }}>
                  Delete for me
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  // backgroundColor: '#ff4444',
                  paddingHorizontal: 10,
                  marginBottom: 16,
                  borderRadius: 5,
                }}
                onPress={async () => {
                  setShowDeleteModal(false);
                  // setShowConfirmModal(true);
                  await deleteForEveryone(selectedMessageId);
                }}
              >
                <Text
                  style={{ color: 'red', textAlign: 'right', fontSize: 16 }}
                >
                  Delete for everyone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                style={{ paddingHorizontal: 10 }}
              >
                <Text
                  style={{ color: 'blue', textAlign: 'right', fontSize: 16 }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    maxHeight: 120,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 15,
    marginBottom: 10,
  },
  typingText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default ChatScreen;
