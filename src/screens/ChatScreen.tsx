// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   FlatList,
//   TextInput,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
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
// import { globalStyles, colors } from '../utils/styles';
// import Header from '../components/Header';
// import MessageBubble from '../components/MessageBubble';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Layout from './Layout';
// import ChatHeader from '../components/ChatHeader';
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

//   // Get all participants
//   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

//   // Fetch sender names for groups
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
//           .catch(error => console.error('Fetch sender name error:', error));
//       }
//     });
//   }, [messages, isGroup, senderNames]);

//   useEffect(() => {
//     if (!chatId || !currentUid) return;

//     // Initialize chat document with all participants
//     initializeChatDoc(chatId, allParticipants, isGroup);

//     // Use groupMessagesRef if group, else chatsRef
//     const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//     const unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
//       querySnapshot => {
//         const msgList: any = [];
//         querySnapshot.forEach(doc => {
//           msgList.push({ id: doc.id, ...doc.data() });
//         });
//         setMessages(msgList);
//         setLoading(false);
//       },
//       error => {
//         console.error('Chat listen error:', error);
//         setLoading(false);
//       },
//     );

//     // Mark as read when entering chat
//     markAsRead(chatId, currentUid, isGroup)
//       .then(() => console.log('Marked read successfully for', chatId))
//       .catch(error => {
//         console.error('Mark read error:', error.message);
//       });

//     return unsubscribe;
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
//       if (typingTimeout.current) {
//         clearTimeout(typingTimeout.current);
//         typingTimeout.current = null;
//       }
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
//       if (isTyping) {
//         setIsTyping(false);
//         updateTypingStatus(chatId, currentUid, false);
//       }
//     }, 1500);
//   };

//   const sendMessage = async () => {
//     if (!text.trim()) return;

//     const messageText = text.trim();
//     setText(''); // Clear input immediately
//     setIsTyping(false);
//     if (typingTimeout.current) {
//       clearTimeout(typingTimeout.current);
//       typingTimeout.current = null;
//     }
//     updateTypingStatus(chatId, currentUid, false);

//     try {
//       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);

//       // Send message
//       await ref.add({
//         text: messageText,
//         senderUid: currentUid,
//         timestamp: serverTimestamp(),
//         read: false,
//       });

//       // Increment unread count for other participants
//       await incrementUnreadCount(chatId, currentUid, isGroup, allParticipants);

//       console.log('Message sent and unread count updated');
//     } catch (error) {
//       console.error('Send message error:', error);
//       // Optionally show error to user
//     }
//   };

//   if (loading) {
//     return (
//       <View
//         style={[globalStyles.center, { backgroundColor: colors.background }]}
//       >
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   const typingText = isOtherTyping
//     ? isGroup
//       ? 'Someone is typing...'
//       : `${otherUser.name} is typing...`
//     : null;

//   return (
//     <Layout statusBarColor={colors.primary}>
//       <View style={globalStyles.container}>
//         <ChatHeader
//           name={isGroup ? group.name : otherUser.name}
//           lastSeen={
//             isGroup
//               ? group.isOnline
//                 ? ''
//                 : group.lastSeen
//               : otherUser.isOnline
//               ? ''
//               : formatLastSeen(otherUser.lastSeen)
//           }
//           isOnline={isGroup ? group.isOnline : otherUser.isOnline}
//           onBack={() => navigation.goBack()}
//         />

//         <FlatList
//           data={messages}
//           keyExtractor={(item: any) => item.id}
//           renderItem={({ item }: any) => (
//             <MessageBubble
//               text={item.text}
//               isMe={item.senderUid === currentUid}
//               timestamp={item.timestamp}
//               senderName={
//                 isGroup && item.senderUid !== currentUid
//                   ? senderNames[item.senderUid] || 'Unknown'
//                   : undefined
//               }
//             />
//           )}
//           style={{ flex: 1, padding: 10 }}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           ListFooterComponent={
//             typingText ? (
//               <View style={styles.typingIndicator}>
//                 <Text style={styles.typingText}>{typingText}</Text>
//               </View>
//             ) : null
//           }
//         />
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             value={text}
//             onChangeText={handleInputChange}
//             placeholder="Type a message..."
//             multiline
//             maxLength={500}
//           />
//           <TouchableOpacity
//             onPress={sendMessage}
//             style={styles.sendButton}
//             disabled={!text.trim()}
//           >
//             <Icon
//               name="send"
//               size={24}
//               color={text.trim() ? colors.primary : colors.textSecondary}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: colors.background,
//     borderTopWidth: 1,
//     borderTopColor: colors.textSecondary,
//     alignItems: 'flex-end',
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: colors.textSecondary,
//     padding: 12,
//     marginRight: 10,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     maxHeight: 100,
//   },
//   sendButton: {
//     padding: 10,
//     justifyContent: 'center',
//   },
//   typingIndicator: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#E5E5EA',
//     borderRadius: 15,
//     margin: 10,
//     maxWidth: '80%',
//   },
//   typingText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     fontStyle: 'italic',
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
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
          querySnapshot => {
            const msgList: any = [];
            querySnapshot.forEach(doc =>
              msgList.push({ id: doc.id, ...doc.data() }),
            );
            setMessages(msgList);
            setLoading(false);
            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: true }),
              300,
            );
          },
          error => {
            console.error('Chat listen error:', error);
            setLoading(false);
          },
        );

        // Mark as read
        await markAsRead(chatId, currentUid, isGroup).catch(console.error);
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
      });
      await incrementUnreadCount(chatId, currentUid, isGroup, allParticipants);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Send message error:', error);
    }
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
            renderItem={({ item }: any) => (
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
            )}
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
