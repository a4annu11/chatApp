// // // // // //working with edited messages
// // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // import {
// // // //   View,
// // // //   FlatList,
// // // //   TextInput,
// // // //   ActivityIndicator,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   Text,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // //   Animated,
// // // //   Alert,
// // // //   TouchableWithoutFeedback,
// // // //   Modal,
// // // // } from 'react-native';
// // // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import CancelIcon from 'react-native-vector-icons/MaterialIcons';
// // // // import MessageDeleteIcon from 'react-native-vector-icons/Entypo';
// // // // import { globalStyles, colors } from '../utils/styles';
// // // // import Layout from './Layout';
// // // // import ChatHeader from '../components/ChatHeader';
// // // // import MessageBubble from '../components/MessageBubble';
// // // // import {
// // // //   chatsRef,
// // // //   serverTimestamp,
// // // //   currentUser,
// // // //   chatDocRef,
// // // //   updateTypingStatus,
// // // //   groupMessagesRef,
// // // //   markAsRead,
// // // //   incrementUnreadCount,
// // // //   initializeChatDoc,
// // // // } from '../services/firebase';
// // // // import { usersRef } from '../services/firebase';
// // // // import { formatLastSeen } from '../utils/time';

// // // // const ChatScreen = () => {
// // // //   const route = useRoute();
// // // //   const { chatId, otherUser, group }: any = route.params;
// // // //   const isGroup = !!group;
// // // //   const [messages, setMessages] = useState([]);
// // // //   const [text, setText] = useState('');
// // // //   const [loading, setLoading] = useState(true);
// // // //   const navigation = useNavigation();
// // // //   const currentUid = currentUser()?.uid;
// // // //   const [isTyping, setIsTyping] = useState(false);
// // // //   const [isOtherTyping, setIsOtherTyping] = useState(false);
// // // //   const [senderNames, setSenderNames] = useState({});
// // // //   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
// // // //   const [showActionModal, setShowActionModal] = useState(false);
// // // //   const [selectedMessage, setSelectedMessage] = useState<any>(null);
// // // //   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
// // // //   const flatListRef = useRef<FlatList>(null);
// // // //   const fadeAnim = useRef(new Animated.Value(0)).current;
// // // //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// // // //   const [showConfirmModal, setShowConfirmModal] = useState(false);
// // // //   const [selectedMessageId, setSelectedMessageId] = useState(null);

// // // //   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

// // // //   useEffect(() => {
// // // //     if (!isGroup || !messages.length) return;
// // // //     const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
// // // //     uniqueUids.forEach(uid => {
// // // //       if (!senderNames[uid]) {
// // // //         usersRef()
// // // //           .doc(uid)
// // // //           .get()
// // // //           .then(doc => {
// // // //             if (doc.exists) {
// // // //               setSenderNames(prev => ({ ...prev, [uid]: doc.data().name }));
// // // //             }
// // // //           })
// // // //           .catch(console.error);
// // // //       }
// // // //     });
// // // //   }, [messages, isGroup, senderNames]);

// // // //   useEffect(() => {
// // // //     if (!chatId || !currentUid) return;

// // // //     let unsubscribe;

// // // //     const setupChat = async () => {
// // // //       try {
// // // //         // Ensure chat document exists
// // // //         await initializeChatDoc(chatId, allParticipants, isGroup);

// // // //         // Now set up message listener
// // // //         const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // // //         unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
// // // //           async querySnapshot => {
// // // //             // Make callback async
// // // //             const msgList: any = [];
// // // //             querySnapshot.forEach(doc => {
// // // //               const data = doc.data();
// // // //               // Filter out messages deleted for current user (but not if globally deleted)
// // // //               if (
// // // //                 data.deletedFor &&
// // // //                 data.deletedFor[currentUid] &&
// // // //                 !data.deletedGlobally
// // // //               ) {
// // // //                 return;
// // // //               }
// // // //               msgList.push({ id: doc.id, ...data });
// // // //             });
// // // //             setMessages(msgList);
// // // //             setLoading(false);
// // // //             setTimeout(
// // // //               () => flatListRef.current?.scrollToEnd({ animated: true }),
// // // //               300,
// // // //             );

// // // //             // Mark as read on every snapshot change (initial + new messages)
// // // //             // This ensures unread resets immediately for incoming messages
// // // //             await markAsRead(chatId, currentUid, isGroup).catch(console.error);
// // // //           },
// // // //           error => {
// // // //             console.error('Chat listen error:', error);
// // // //             setLoading(false);
// // // //           },
// // // //         );
// // // //       } catch (error) {
// // // //         console.error('Setup chat error:', error);
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     setupChat();

// // // //     return () => {
// // // //       if (unsubscribe) {
// // // //         unsubscribe();
// // // //       }
// // // //     };
// // // //   }, [chatId, currentUid, isGroup]);

// // // //   useEffect(() => {
// // // //     if (!chatId || !currentUid) return;

// // // //     const typingUnsub = chatDocRef(chatId).onSnapshot(doc => {
// // // //       if (doc.exists) {
// // // //         const typingBy = doc.data()?.typingBy || [];
// // // //         const otherTyping = typingBy.some(
// // // //           uid =>
// // // //             (isGroup ? group.members.includes(uid) : uid === otherUser.uid) &&
// // // //             uid !== currentUid,
// // // //         );
// // // //         setIsOtherTyping(otherTyping);
// // // //       }
// // // //     });

// // // //     return () => {
// // // //       typingUnsub();
// // // //       if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // // //     };
// // // //   }, [chatId, otherUser?.uid, group?.members, currentUid, isGroup]);

// // // //   const handleInputChange = (newText: string) => {
// // // //     setText(newText);
// // // //     if (newText.trim() && !isTyping) {
// // // //       setIsTyping(true);
// // // //       updateTypingStatus(chatId, currentUid, true);
// // // //     }
// // // //     if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // // //     typingTimeout.current = setTimeout(() => {
// // // //       setIsTyping(false);
// // // //       updateTypingStatus(chatId, currentUid, false);
// // // //     }, 1500);
// // // //   };

// // // //   const handleLongPress = useCallback(
// // // //     (item: any) => {
// // // //       if (item.senderUid !== currentUid) {
// // // //         // Alert.alert('Error', 'You can only edit or delete your own messages.');
// // // //         return;
// // // //       }
// // // //       setSelectedMessage(item);
// // // //       setShowActionModal(true);
// // // //     },
// // // //     [currentUid],
// // // //   );

// // // //   const handleEdit = useCallback((item: any) => {
// // // //     setEditingMessageId(item.id);
// // // //     setText(item.text);
// // // //     setShowActionModal(false);
// // // //   }, []);

// // // //   const handleDelete = useCallback((messageId: string) => {
// // // //     setSelectedMessageId(messageId);
// // // //     setShowActionModal(false);
// // // //     setShowDeleteModal(true);
// // // //   }, []);

// // // //   const sendMessage = async () => {
// // // //     if (!text.trim()) return;
// // // //     const messageText = text.trim();
// // // //     setText('');
// // // //     setIsTyping(false);
// // // //     if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // // //     updateTypingStatus(chatId, currentUid, false);

// // // //     try {
// // // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // // //       if (editingMessageId) {
// // // //         await ref.doc(editingMessageId).update({
// // // //           text: messageText,
// // // //           edited: true,
// // // //           editedTimestamp: serverTimestamp(),
// // // //         });
// // // //         setEditingMessageId(null);
// // // //       } else {
// // // //         await ref.add({
// // // //           text: messageText,
// // // //           senderUid: currentUid,
// // // //           timestamp: serverTimestamp(),
// // // //           read: false,
// // // //           deletedGlobally: false,
// // // //           deletedFor: {},
// // // //           edited: false,
// // // //         });
// // // //         await incrementUnreadCount(
// // // //           chatId,
// // // //           currentUid,
// // // //           isGroup,
// // // //           allParticipants,
// // // //         );
// // // //       }
// // // //       flatListRef.current?.scrollToEnd({ animated: true });
// // // //     } catch (error) {
// // // //       console.error('Send message error:', error);
// // // //     }
// // // //   };

// // // //   const deleteForMe = async (messageId: string) => {
// // // //     try {
// // // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // // //       await ref.doc(messageId).update({
// // // //         [`deletedFor.${currentUid}`]: true,
// // // //       });
// // // //       // Immediately remove from local state for instant feedback
// // // //       setMessages(prev => prev.filter((m: any) => m.id !== messageId));
// // // //     } catch (error) {
// // // //       console.error('Delete for me error:', error);
// // // //       Alert.alert('Error', 'Failed to delete message for you.');
// // // //     }
// // // //   };

// // // //   const deleteForEveryone = async (messageId: string) => {
// // // //     try {
// // // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // // //       await ref.doc(messageId).update({
// // // //         deletedGlobally: true,
// // // //       });
// // // //       // Immediately update local state for instant feedback
// // // //       setMessages(prev =>
// // // //         prev.map((m: any) =>
// // // //           m.id === messageId ? { ...m, deletedGlobally: true } : m,
// // // //         ),
// // // //       );
// // // //     } catch (error) {
// // // //       console.error('Delete for everyone error:', error);
// // // //       Alert.alert('Error', 'Failed to delete message for everyone.');
// // // //     }
// // // //   };

// // // //   const typingText = isOtherTyping
// // // //     ? isGroup
// // // //       ? 'Someone is typing...'
// // // //       : `${otherUser.name} is typing...`
// // // //     : null;

// // // //   useEffect(() => {
// // // //     Animated.timing(fadeAnim, {
// // // //       toValue: 1,
// // // //       duration: 600,
// // // //       useNativeDriver: true,
// // // //     }).start();
// // // //   }, []);

// // // //   if (loading) {
// // // //     return (
// // // //       <View
// // // //         style={[globalStyles.center, { backgroundColor: colors.background }]}
// // // //       >
// // // //         <ActivityIndicator size="large" color={colors.primary} />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <Layout statusBarColor={colors.primary} paddingBottom={1}>
// // // //       <KeyboardAvoidingView
// // // //         style={{ flex: 1 }}
// // // //         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// // // //         keyboardVerticalOffset={80}
// // // //       >
// // // //         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// // // //           <ChatHeader
// // // //             name={isGroup ? group.name : otherUser.name}
// // // //             lastSeen={
// // // //               isGroup
// // // //                 ? group.isOnline
// // // //                   ? ''
// // // //                   : group.lastSeen
// // // //                 : otherUser.isOnline
// // // //                 ? ''
// // // //                 : formatLastSeen(otherUser.lastSeen)
// // // //             }
// // // //             isOnline={isGroup ? group.isOnline : otherUser.isOnline}
// // // //             onBack={() => navigation.goBack()}
// // // //             typing={isOtherTyping}
// // // //           />

// // // //           <FlatList
// // // //             ref={flatListRef}
// // // //             data={messages}
// // // //             keyExtractor={(item: any) => item.id}
// // // //             renderItem={({ item }: any) => {
// // // //               if (item.deletedGlobally) {
// // // //                 return (
// // // //                   <View
// // // //                     style={{
// // // //                       alignSelf:
// // // //                         item.senderUid === currentUid
// // // //                           ? 'flex-end'
// // // //                           : 'flex-start',
// // // //                       marginVertical: 5,
// // // //                       paddingHorizontal: 10,
// // // //                       flexDirection: 'row',
// // // //                       alignItems: 'center',
// // // //                       backgroundColor: '#8d8888ff',
// // // //                       padding: 8,
// // // //                       borderRadius: 12,
// // // //                       gap: 5,
// // // //                     }}
// // // //                   >
// // // //                     <MessageDeleteIcon name="block" color={'white'} />

// // // //                     <Text
// // // //                       style={{
// // // //                         color: '#ffffffff',
// // // //                         fontStyle: 'italic',
// // // //                         fontSize: 14,
// // // //                       }}
// // // //                     >
// // // //                       This message was deleted
// // // //                     </Text>
// // // //                   </View>
// // // //                 );
// // // //               }
// // // //               return (
// // // //                 <TouchableWithoutFeedback
// // // //                   onLongPress={() => handleLongPress(item)}
// // // //                 >
// // // //                   <View>
// // // //                     <MessageBubble
// // // //                       text={item.text}
// // // //                       isMe={item.senderUid === currentUid}
// // // //                       timestamp={item.timestamp}
// // // //                       senderName={
// // // //                         isGroup && item.senderUid !== currentUid
// // // //                           ? senderNames[item.senderUid] || 'Unknown'
// // // //                           : undefined
// // // //                       }
// // // //                       edited={item.edited}
// // // //                     />
// // // //                   </View>
// // // //                 </TouchableWithoutFeedback>
// // // //               );
// // // //             }}
// // // //             style={{ flex: 1, paddingHorizontal: 10 }}
// // // //             contentContainerStyle={{
// // // //               paddingBottom: 10,
// // // //             }}
// // // //             onContentSizeChange={() =>
// // // //               flatListRef.current?.scrollToEnd({ animated: true })
// // // //             }
// // // //           />

// // // //           {typingText ? (
// // // //             <View style={styles.typingIndicator}>
// // // //               <Text style={styles.typingText}>{typingText}</Text>
// // // //             </View>
// // // //           ) : null}

// // // //           <View style={styles.inputWrapper}>
// // // //             <View style={styles.inputContainer}>
// // // //               {editingMessageId && (
// // // //                 <TouchableOpacity
// // // //                   onPress={() => {
// // // //                     setEditingMessageId(null);
// // // //                     setText('');
// // // //                   }}
// // // //                   style={[styles.cancelButton]}
// // // //                 >
// // // //                   {/* <Text style={styles.cancelText}>Cancel</Text> */}
// // // //                   <CancelIcon name="cancel" size={32} color={colors.primary} />
// // // //                 </TouchableOpacity>
// // // //               )}
// // // //               <TextInput
// // // //                 style={styles.textInput}
// // // //                 value={text}
// // // //                 onChangeText={handleInputChange}
// // // //                 placeholder={
// // // //                   editingMessageId ? 'Edit message...' : 'Type a message...'
// // // //                 }
// // // //               />

// // // //               <TouchableOpacity
// // // //                 onPress={sendMessage}
// // // //                 style={[
// // // //                   styles.sendButton,
// // // //                   !text.trim() && { backgroundColor: '#ddd' },
// // // //                 ]}
// // // //                 disabled={!text.trim()}
// // // //               >
// // // //                 <Icon
// // // //                   name="send"
// // // //                   size={22}
// // // //                   color={text.trim() ? '#fff' : '#999'}
// // // //                 />
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </Animated.View>

// // // //         {/* Action Modal for Edit/Delete */}
// // // //         <Modal
// // // //           visible={showActionModal}
// // // //           transparent
// // // //           animationType="fade"
// // // //           onRequestClose={() => setShowActionModal(false)}
// // // //           statusBarTranslucent={true}
// // // //         >
// // // //           <TouchableWithoutFeedback onPress={() => setShowActionModal(false)}>
// // // //             <View
// // // //               style={{
// // // //                 flex: 1,
// // // //                 backgroundColor: 'rgba(0,0,0,0.35)',
// // // //                 justifyContent: 'flex-end',
// // // //               }}
// // // //             >
// // // //               <TouchableWithoutFeedback>
// // // //                 <View
// // // //                   style={{
// // // //                     maxHeight: '60%',
// // // //                     backgroundColor: '#fff',
// // // //                     borderTopLeftRadius: 18,
// // // //                     borderTopRightRadius: 18,
// // // //                     paddingBottom: 50,
// // // //                   }}
// // // //                 >
// // // //                   <Text
// // // //                     style={{
// // // //                       fontSize: 20,
// // // //                       fontWeight: 'bold',
// // // //                       marginBottom: 20,
// // // //                       textAlign: 'center',
// // // //                       marginTop: 20,
// // // //                     }}
// // // //                   >
// // // //                     Message Actions
// // // //                   </Text>
// // // //                   <TouchableOpacity
// // // //                     style={[
// // // //                       styles.actionButton,
// // // //                       { borderBottomColor: '#f0f0f0' },
// // // //                     ]}
// // // //                     onPress={() => handleEdit(selectedMessage)}
// // // //                   >
// // // //                     <Text
// // // //                       style={[styles.actionText, { color: colors.primary }]}
// // // //                     >
// // // //                       Edit
// // // //                     </Text>
// // // //                   </TouchableOpacity>
// // // //                   <TouchableOpacity
// // // //                     style={styles.actionButton}
// // // //                     onPress={() => handleDelete(selectedMessage.id)}
// // // //                   >
// // // //                     <Text style={[styles.actionText, { color: '#FF3B30' }]}>
// // // //                       Delete
// // // //                     </Text>
// // // //                   </TouchableOpacity>
// // // //                   <TouchableOpacity
// // // //                     style={styles.actionButton}
// // // //                     onPress={() => setShowActionModal(false)}
// // // //                   >
// // // //                     <Text style={[styles.actionText, { color: 'blue' }]}>
// // // //                       Cancel
// // // //                     </Text>
// // // //                   </TouchableOpacity>
// // // //                 </View>
// // // //               </TouchableWithoutFeedback>
// // // //             </View>
// // // //           </TouchableWithoutFeedback>
// // // //         </Modal>

// // // //         <Modal
// // // //           visible={showDeleteModal}
// // // //           transparent
// // // //           animationType="fade"
// // // //           onRequestClose={() => setShowDeleteModal(false)}
// // // //           statusBarTranslucent={true}
// // // //         >
// // // //           <View
// // // //             style={{
// // // //               flex: 1,
// // // //               justifyContent: 'center',
// // // //               alignItems: 'center',
// // // //               backgroundColor: 'rgba(0,0,0,0.5)',
// // // //             }}
// // // //           >
// // // //             <View
// // // //               style={{
// // // //                 backgroundColor: colors.background,
// // // //                 padding: 20,
// // // //                 borderRadius: 10,
// // // //                 width: '80%',
// // // //               }}
// // // //             >
// // // //               <Text
// // // //                 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}
// // // //               >
// // // //                 Delete Message
// // // //               </Text>
// // // //               <Text
// // // //                 style={{
// // // //                   marginBottom: 22,
// // // //                   fontSize: 16,
// // // //                   fontStyle: 'italic',
// // // //                 }}
// // // //               >
// // // //                 Are you sure you want to delete this message?
// // // //               </Text>
// // // //               <TouchableOpacity
// // // //                 style={{
// // // //                   // backgroundColor: '#ddd',
// // // //                   paddingHorizontal: 10,
// // // //                   marginBottom: 16,
// // // //                   borderRadius: 5,
// // // //                 }}
// // // //                 onPress={() => {
// // // //                   setShowDeleteModal(false);
// // // //                   deleteForMe(selectedMessageId);
// // // //                 }}
// // // //               >
// // // //                 <Text style={{ textAlign: 'right', fontSize: 16 }}>
// // // //                   Delete for me
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //               <TouchableOpacity
// // // //                 style={{
// // // //                   // backgroundColor: '#ff4444',
// // // //                   paddingHorizontal: 10,
// // // //                   marginBottom: 16,
// // // //                   borderRadius: 5,
// // // //                 }}
// // // //                 onPress={async () => {
// // // //                   setShowDeleteModal(false);
// // // //                   // setShowConfirmModal(true);
// // // //                   await deleteForEveryone(selectedMessageId);
// // // //                 }}
// // // //               >
// // // //                 <Text
// // // //                   style={{ color: 'red', textAlign: 'right', fontSize: 16 }}
// // // //                 >
// // // //                   Delete for everyone
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //               <TouchableOpacity
// // // //                 onPress={() => setShowDeleteModal(false)}
// // // //                 style={{ paddingHorizontal: 10 }}
// // // //               >
// // // //                 <Text
// // // //                   style={{ color: 'blue', textAlign: 'right', fontSize: 16 }}
// // // //                 >
// // // //                   Cancel
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </Modal>
// // // //       </KeyboardAvoidingView>
// // // //     </Layout>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   inputWrapper: {
// // // //     // position: 'absolute',
// // // //     // bottom: 0,
// // // //     width: '100%',
// // // //     backgroundColor: 'transparent',
// // // //   },
// // // //   inputContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginHorizontal: 10,
// // // //     marginBottom: 10,
// // // //     borderRadius: 30,
// // // //     paddingHorizontal: 15,
// // // //     paddingVertical: 8,
// // // //     backgroundColor: '#fff',
// // // //     shadowColor: '#000',
// // // //     shadowOpacity: 0.1,
// // // //     shadowOffset: { width: 0, height: 3 },
// // // //     shadowRadius: 5,
// // // //     elevation: 4,
// // // //   },
// // // //   textInput: {
// // // //     flex: 1,
// // // //     paddingHorizontal: 12,
// // // //     // maxHeight: 120,
// // // //     fontSize: 16,
// // // //     color: '#333',
// // // //   },
// // // //   sendButton: {
// // // //     backgroundColor: colors.primary,
// // // //     padding: 10,
// // // //     borderRadius: 20,
// // // //     marginLeft: 8,
// // // //   },
// // // //   cancelButton: {
// // // //     // paddingHorizontal: 10,
// // // //     // paddingVertical: 5,
// // // //     // height: '100%',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   cancelText: {
// // // //     color: colors.primary,
// // // //     fontSize: 16,
// // // //   },
// // // //   typingIndicator: {
// // // //     alignSelf: 'flex-start',
// // // //     backgroundColor: '#eee',
// // // //     borderRadius: 20,
// // // //     paddingHorizontal: 15,
// // // //     paddingVertical: 8,
// // // //     marginLeft: 15,
// // // //     marginBottom: 10,
// // // //   },
// // // //   typingText: {
// // // //     fontStyle: 'italic',
// // // //     color: '#666',
// // // //   },
// // // //   actionButton: {
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 16,
// // // //     alignItems: 'center',
// // // //   },
// // // //   actionText: {
// // // //     fontSize: 16,
// // // //     fontWeight: '500',
// // // //   },
// // // // });

// // // // export default ChatScreen;

// // // //working fine with reaction
// // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // import {
// // //   View,
// // //   FlatList,
// // //   TextInput,
// // //   ActivityIndicator,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Text,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   Animated,
// // //   Alert,
// // //   TouchableWithoutFeedback,
// // //   Modal,
// // //   StatusBar,
// // // } from 'react-native';
// // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import CancelIcon from 'react-native-vector-icons/MaterialIcons';
// // // import MessageDeleteIcon from 'react-native-vector-icons/Entypo';
// // // import { globalStyles, colors } from '../utils/styles';
// // // import Layout from './Layout';
// // // import ChatHeader from '../components/ChatHeader';
// // // import MessageBubble from '../components/MessageBubble';
// // // import {
// // //   chatsRef,
// // //   serverTimestamp,
// // //   currentUser,
// // //   chatDocRef,
// // //   updateTypingStatus,
// // //   groupMessagesRef,
// // //   markAsRead,
// // //   incrementUnreadCount,
// // //   initializeChatDoc,
// // // } from '../services/firebase';
// // // import { usersRef } from '../services/firebase';
// // // import { formatLastSeen } from '../utils/time';

// // // const REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍'];

// // // const ChatScreen = () => {
// // //   const route = useRoute();
// // //   const { chatId, otherUser, group }: any = route.params;
// // //   const isGroup = !!group;
// // //   const [messages, setMessages] = useState([]);
// // //   const [text, setText] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const navigation = useNavigation();
// // //   const currentUid = currentUser()?.uid;
// // //   const [isTyping, setIsTyping] = useState(false);
// // //   const [isOtherTyping, setIsOtherTyping] = useState(false);
// // //   const [senderNames, setSenderNames] = useState({});
// // //   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
// // //   const [showActionModal, setShowActionModal] = useState(false);
// // //   const [selectedMessage, setSelectedMessage] = useState<any>(null);
// // //   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
// // //   const flatListRef = useRef<FlatList>(null);
// // //   const fadeAnim = useRef(new Animated.Value(0)).current;
// // //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// // //   const [showConfirmModal, setShowConfirmModal] = useState(false);
// // //   const [selectedMessageId, setSelectedMessageId] = useState(null);
// // //   const [selectedMessageForMenu, setSelectedMessageForMenu] =
// // //     useState<any>(null);
// // //   const [showReactionPicker, setShowReactionPicker] = useState(false);

// // //   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

// // //   useEffect(() => {
// // //     if (!isGroup || !messages.length) return;
// // //     const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
// // //     uniqueUids.forEach(uid => {
// // //       if (!senderNames[uid]) {
// // //         usersRef()
// // //           .doc(uid)
// // //           .get()
// // //           .then(doc => {
// // //             if (doc.exists) {
// // //               setSenderNames(prev => ({ ...prev, [uid]: doc.data().name }));
// // //             }
// // //           })
// // //           .catch(console.error);
// // //       }
// // //     });
// // //   }, [messages, isGroup, senderNames]);

// // //   useEffect(() => {
// // //     if (!chatId || !currentUid) return;

// // //     let unsubscribe;

// // //     const setupChat = async () => {
// // //       try {
// // //         await initializeChatDoc(chatId, allParticipants, isGroup);

// // //         const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // //         unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
// // //           async querySnapshot => {
// // //             const msgList: any = [];
// // //             querySnapshot.forEach(doc => {
// // //               const data = doc.data();
// // //               if (
// // //                 data.deletedFor &&
// // //                 data.deletedFor[currentUid] &&
// // //                 !data.deletedGlobally
// // //               ) {
// // //                 return;
// // //               }
// // //               msgList.push({ id: doc.id, ...data });
// // //             });
// // //             setMessages(msgList);
// // //             setLoading(false);
// // //             setTimeout(
// // //               () => flatListRef.current?.scrollToEnd({ animated: true }),
// // //               300,
// // //             );

// // //             await markAsRead(chatId, currentUid, isGroup).catch(console.error);
// // //           },
// // //           error => {
// // //             console.error('Chat listen error:', error);
// // //             setLoading(false);
// // //           },
// // //         );
// // //       } catch (error) {
// // //         console.error('Setup chat error:', error);
// // //         setLoading(false);
// // //       }
// // //     };

// // //     setupChat();

// // //     return () => {
// // //       if (unsubscribe) {
// // //         unsubscribe();
// // //       }
// // //     };
// // //   }, [chatId, currentUid, isGroup]);

// // //   useEffect(() => {
// // //     if (!chatId || !currentUid) return;

// // //     const typingUnsub = chatDocRef(chatId).onSnapshot(doc => {
// // //       if (doc.exists) {
// // //         const typingBy = doc.data()?.typingBy || [];
// // //         const otherTyping = typingBy.some(
// // //           uid =>
// // //             (isGroup ? group.members.includes(uid) : uid === otherUser.uid) &&
// // //             uid !== currentUid,
// // //         );
// // //         setIsOtherTyping(otherTyping);
// // //       }
// // //     });

// // //     return () => {
// // //       typingUnsub();
// // //       if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // //     };
// // //   }, [chatId, otherUser?.uid, group?.members, currentUid, isGroup]);

// // //   const handleInputChange = (newText: string) => {
// // //     setText(newText);
// // //     if (newText.trim() && !isTyping) {
// // //       setIsTyping(true);
// // //       updateTypingStatus(chatId, currentUid, true);
// // //     }
// // //     if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // //     typingTimeout.current = setTimeout(() => {
// // //       setIsTyping(false);
// // //       updateTypingStatus(chatId, currentUid, false);
// // //     }, 1500);
// // //   };

// // //   const handleLongPress = useCallback((item: any) => {
// // //     setSelectedMessageForMenu(item);
// // //   }, []);

// // //   const closeMessageMenu = () => {
// // //     setSelectedMessageForMenu(null);
// // //     setShowReactionPicker(false);
// // //   };

// // //   const handleEdit = useCallback(
// // //     (item: any) => {
// // //       if (item.senderUid !== currentUid) {
// // //         Alert.alert('Error', 'You can only edit your own messages.');
// // //         return;
// // //       }
// // //       setEditingMessageId(item.id);
// // //       setText(item.text);
// // //       closeMessageMenu();
// // //     },
// // //     [currentUid],
// // //   );

// // //   const handleDelete = useCallback(
// // //     (messageId: string, senderUid: string) => {
// // //       if (senderUid !== currentUid) {
// // //         Alert.alert('Error', 'You can only delete your own messages.');
// // //         return;
// // //       }
// // //       setSelectedMessageId(messageId);
// // //       closeMessageMenu();
// // //       setShowDeleteModal(true);
// // //     },
// // //     [currentUid],
// // //   );

// // //   const handleReaction = async (emoji: string) => {
// // //     if (!selectedMessageForMenu) return;

// // //     try {
// // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // //       const messageRef = ref.doc(selectedMessageForMenu.id);

// // //       const currentReactions = selectedMessageForMenu.reactions || {};

// // //       // Check if user already reacted with this emoji
// // //       if (currentReactions[currentUid] === emoji) {
// // //         // Remove reaction
// // //         await messageRef.update({
// // //           [`reactions.${currentUid}`]: null,
// // //         });
// // //       } else {
// // //         // Add or update reaction (one reaction per user)
// // //         await messageRef.update({
// // //           [`reactions.${currentUid}`]: emoji,
// // //         });
// // //       }

// // //       closeMessageMenu();
// // //     } catch (error) {
// // //       console.error('Reaction error:', error);
// // //       Alert.alert('Error', 'Failed to add reaction.');
// // //     }
// // //   };

// // //   const sendMessage = async () => {
// // //     if (!text.trim()) return;
// // //     const messageText = text.trim();
// // //     setText('');
// // //     setIsTyping(false);
// // //     if (typingTimeout.current) clearTimeout(typingTimeout.current);
// // //     updateTypingStatus(chatId, currentUid, false);

// // //     try {
// // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // //       if (editingMessageId) {
// // //         await ref.doc(editingMessageId).update({
// // //           text: messageText,
// // //           edited: true,
// // //           editedTimestamp: serverTimestamp(),
// // //         });
// // //         setEditingMessageId(null);
// // //       } else {
// // //         await ref.add({
// // //           text: messageText,
// // //           senderUid: currentUid,
// // //           timestamp: serverTimestamp(),
// // //           read: false,
// // //           deletedGlobally: false,
// // //           deletedFor: {},
// // //           edited: false,
// // //           reactions: {},
// // //         });
// // //         await incrementUnreadCount(
// // //           chatId,
// // //           currentUid,
// // //           isGroup,
// // //           allParticipants,
// // //         );
// // //       }
// // //       flatListRef.current?.scrollToEnd({ animated: true });
// // //     } catch (error) {
// // //       console.error('Send message error:', error);
// // //     }
// // //   };

// // //   const deleteForMe = async (messageId: string) => {
// // //     try {
// // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // //       await ref.doc(messageId).update({
// // //         [`deletedFor.${currentUid}`]: true,
// // //       });
// // //       setMessages(prev => prev.filter((m: any) => m.id !== messageId));
// // //     } catch (error) {
// // //       console.error('Delete for me error:', error);
// // //       Alert.alert('Error', 'Failed to delete message for you.');
// // //     }
// // //   };

// // //   const deleteForEveryone = async (messageId: string) => {
// // //     try {
// // //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// // //       await ref.doc(messageId).update({
// // //         deletedGlobally: true,
// // //       });
// // //       setMessages((prev: any) =>
// // //         prev.map((m: any) =>
// // //           m.id === messageId ? { ...m, deletedGlobally: true } : m,
// // //         ),
// // //       );
// // //     } catch (error) {
// // //       console.error('Delete for everyone error:', error);
// // //       Alert.alert('Error', 'Failed to delete message for everyone.');
// // //     }
// // //   };

// // //   const typingText = isOtherTyping
// // //     ? isGroup
// // //       ? 'Someone is typing...'
// // //       : `${otherUser.name} is typing...`
// // //     : null;

// // //   useEffect(() => {
// // //     Animated.timing(fadeAnim, {
// // //       toValue: 1,
// // //       duration: 600,
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, []);

// // //   if (loading) {
// // //     return (
// // //       <View
// // //         style={[globalStyles.center, { backgroundColor: colors.background }]}
// // //       >
// // //         <ActivityIndicator size="large" color={colors.primary} />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <Layout
// // //       statusBarColor={selectedMessageForMenu ? '#333' : colors.primary}
// // //       paddingBottom={1}
// // //     >
// // //       <KeyboardAvoidingView
// // //         style={{ flex: 1 }}
// // //         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// // //         keyboardVerticalOffset={80}
// // //       >
// // //         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// // //           {selectedMessageForMenu ? (
// // //             <View style={styles.selectionHeader}>
// // //               <TouchableOpacity
// // //                 onPress={closeMessageMenu}
// // //                 style={styles.closeButton}
// // //               >
// // //                 <Icon name="close" size={24} color="#fff" />
// // //               </TouchableOpacity>
// // //               <Text style={styles.selectionHeaderText}>Message Selected</Text>
// // //               <View style={styles.selectionActions}>
// // //                 <TouchableOpacity
// // //                   onPress={() => setShowReactionPicker(!showReactionPicker)}
// // //                   style={styles.headerAction}
// // //                 >
// // //                   <Icon name="happy-outline" size={24} color="#fff" />
// // //                 </TouchableOpacity>
// // //                 {selectedMessageForMenu.senderUid === currentUid && (
// // //                   <>
// // //                     <TouchableOpacity
// // //                       onPress={() => handleEdit(selectedMessageForMenu)}
// // //                       style={styles.headerAction}
// // //                     >
// // //                       <Icon name="create-outline" size={24} color="#fff" />
// // //                     </TouchableOpacity>
// // //                     <TouchableOpacity
// // //                       onPress={() =>
// // //                         handleDelete(
// // //                           selectedMessageForMenu.id,
// // //                           selectedMessageForMenu.senderUid,
// // //                         )
// // //                       }
// // //                       style={styles.headerAction}
// // //                     >
// // //                       <Icon name="trash-outline" size={24} color="#fff" />
// // //                     </TouchableOpacity>
// // //                   </>
// // //                 )}
// // //               </View>
// // //             </View>
// // //           ) : (
// // //             <ChatHeader
// // //               name={isGroup ? group.name : otherUser.name}
// // //               lastSeen={
// // //                 isGroup
// // //                   ? group.isOnline
// // //                     ? ''
// // //                     : group.lastSeen
// // //                   : otherUser.isOnline
// // //                   ? ''
// // //                   : formatLastSeen(otherUser.lastSeen)
// // //               }
// // //               isOnline={isGroup ? group.isOnline : otherUser.isOnline}
// // //               onBack={() => navigation.goBack()}
// // //               typing={isOtherTyping}
// // //             />
// // //           )}

// // //           <FlatList
// // //             ref={flatListRef}
// // //             data={messages}
// // //             keyExtractor={(item: any) => item.id}
// // //             renderItem={({ item }: any) => {
// // //               if (item.deletedGlobally) {
// // //                 return (
// // //                   <View
// // //                     style={{
// // //                       alignSelf:
// // //                         item.senderUid === currentUid
// // //                           ? 'flex-end'
// // //                           : 'flex-start',
// // //                       marginVertical: 5,
// // //                       paddingHorizontal: 10,
// // //                       flexDirection: 'row',
// // //                       alignItems: 'center',
// // //                       backgroundColor: '#8d8888ff',
// // //                       padding: 8,
// // //                       borderRadius: 12,
// // //                       gap: 5,
// // //                     }}
// // //                   >
// // //                     <MessageDeleteIcon name="block" color={'white'} />
// // //                     <Text
// // //                       style={{
// // //                         color: '#ffffffff',
// // //                         fontStyle: 'italic',
// // //                         fontSize: 14,
// // //                       }}
// // //                     >
// // //                       This message was deleted
// // //                     </Text>
// // //                   </View>
// // //                 );
// // //               }
// // //               return (
// // //                 <TouchableWithoutFeedback
// // //                   onLongPress={() => handleLongPress(item)}
// // //                 >
// // //                   <View>
// // //                     <MessageBubble
// // //                       text={item.text}
// // //                       isMe={item.senderUid === currentUid}
// // //                       timestamp={item.timestamp}
// // //                       senderName={
// // //                         isGroup && item.senderUid !== currentUid
// // //                           ? senderNames[item.senderUid] || 'Unknown'
// // //                           : undefined
// // //                       }
// // //                       edited={item.edited}
// // //                       reactions={item.reactions || {}}
// // //                       isSelected={selectedMessageForMenu?.id === item.id}
// // //                       senderNames={senderNames}
// // //                       currentUid={currentUid}
// // //                     />
// // //                   </View>
// // //                 </TouchableWithoutFeedback>
// // //               );
// // //             }}
// // //             style={{ flex: 1, paddingHorizontal: 10 }}
// // //             contentContainerStyle={{
// // //               paddingBottom: 10,
// // //             }}
// // //             onContentSizeChange={() =>
// // //               flatListRef.current?.scrollToEnd({ animated: true })
// // //             }
// // //           />

// // //           {showReactionPicker && selectedMessageForMenu && (
// // //             <View style={styles.reactionPicker}>
// // //               {REACTIONS.map(emoji => (
// // //                 <TouchableOpacity
// // //                   key={emoji}
// // //                   onPress={() => handleReaction(emoji)}
// // //                   style={styles.reactionButton}
// // //                 >
// // //                   <Text style={styles.reactionEmoji}>{emoji}</Text>
// // //                 </TouchableOpacity>
// // //               ))}
// // //             </View>
// // //           )}

// // //           {typingText ? (
// // //             <View style={styles.typingIndicator}>
// // //               <Text style={styles.typingText}>{typingText}</Text>
// // //             </View>
// // //           ) : null}

// // //           <View style={styles.inputWrapper}>
// // //             <View style={styles.inputContainer}>
// // //               {editingMessageId && (
// // //                 <TouchableOpacity
// // //                   onPress={() => {
// // //                     setEditingMessageId(null);
// // //                     setText('');
// // //                   }}
// // //                   style={[styles.cancelButton]}
// // //                 >
// // //                   <CancelIcon name="cancel" size={32} color={colors.primary} />
// // //                 </TouchableOpacity>
// // //               )}
// // //               <TextInput
// // //                 style={styles.textInput}
// // //                 value={text}
// // //                 onChangeText={handleInputChange}
// // //                 placeholder={
// // //                   editingMessageId ? 'Edit message...' : 'Type a message...'
// // //                 }
// // //               />

// // //               <TouchableOpacity
// // //                 onPress={sendMessage}
// // //                 style={[
// // //                   styles.sendButton,
// // //                   !text.trim() && { backgroundColor: '#ddd' },
// // //                 ]}
// // //                 disabled={!text.trim()}
// // //               >
// // //                 <Icon
// // //                   name="send"
// // //                   size={22}
// // //                   color={text.trim() ? '#fff' : '#999'}
// // //                 />
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Animated.View>

// // //         <Modal
// // //           visible={showDeleteModal}
// // //           transparent
// // //           animationType="fade"
// // //           onRequestClose={() => setShowDeleteModal(false)}
// // //           statusBarTranslucent={true}
// // //         >
// // //           <View
// // //             style={{
// // //               flex: 1,
// // //               justifyContent: 'center',
// // //               alignItems: 'center',
// // //               backgroundColor: 'rgba(0,0,0,0.5)',
// // //             }}
// // //           >
// // //             <View
// // //               style={{
// // //                 backgroundColor: colors.background,
// // //                 padding: 20,
// // //                 borderRadius: 10,
// // //                 width: '80%',
// // //               }}
// // //             >
// // //               <Text
// // //                 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}
// // //               >
// // //                 Delete Message
// // //               </Text>
// // //               <Text
// // //                 style={{
// // //                   marginBottom: 22,
// // //                   fontSize: 16,
// // //                   fontStyle: 'italic',
// // //                 }}
// // //               >
// // //                 Are you sure you want to delete this message?
// // //               </Text>
// // //               <TouchableOpacity
// // //                 style={{
// // //                   paddingHorizontal: 10,
// // //                   marginBottom: 16,
// // //                   borderRadius: 5,
// // //                 }}
// // //                 onPress={() => {
// // //                   setShowDeleteModal(false);
// // //                   deleteForMe(selectedMessageId);
// // //                 }}
// // //               >
// // //                 <Text style={{ textAlign: 'right', fontSize: 16 }}>
// // //                   Delete for me
// // //                 </Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity
// // //                 style={{
// // //                   paddingHorizontal: 10,
// // //                   marginBottom: 16,
// // //                   borderRadius: 5,
// // //                 }}
// // //                 onPress={async () => {
// // //                   setShowDeleteModal(false);
// // //                   await deleteForEveryone(selectedMessageId);
// // //                 }}
// // //               >
// // //                 <Text
// // //                   style={{ color: 'red', textAlign: 'right', fontSize: 16 }}
// // //                 >
// // //                   Delete for everyone
// // //                 </Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity
// // //                 onPress={() => setShowDeleteModal(false)}
// // //                 style={{ paddingHorizontal: 10 }}
// // //               >
// // //                 <Text
// // //                   style={{ color: 'blue', textAlign: 'right', fontSize: 16 }}
// // //                 >
// // //                   Cancel
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //       </KeyboardAvoidingView>
// // //     </Layout>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   inputWrapper: {
// // //     width: '100%',
// // //     backgroundColor: 'transparent',
// // //   },
// // //   inputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginHorizontal: 10,
// // //     marginBottom: 10,
// // //     borderRadius: 30,
// // //     paddingHorizontal: 15,
// // //     paddingVertical: 8,
// // //     backgroundColor: '#fff',
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.1,
// // //     shadowOffset: { width: 0, height: 3 },
// // //     shadowRadius: 5,
// // //     elevation: 4,
// // //   },
// // //   textInput: {
// // //     flex: 1,
// // //     paddingHorizontal: 12,
// // //     fontSize: 16,
// // //     color: '#333',
// // //   },
// // //   sendButton: {
// // //     backgroundColor: colors.primary,
// // //     padding: 10,
// // //     borderRadius: 20,
// // //     marginLeft: 8,
// // //   },
// // //   cancelButton: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   cancelText: {
// // //     color: colors.primary,
// // //     fontSize: 16,
// // //   },
// // //   typingIndicator: {
// // //     alignSelf: 'flex-start',
// // //     backgroundColor: '#eee',
// // //     borderRadius: 20,
// // //     paddingHorizontal: 15,
// // //     paddingVertical: 8,
// // //     marginLeft: 15,
// // //     marginBottom: 10,
// // //   },
// // //   typingText: {
// // //     fontStyle: 'italic',
// // //     color: '#666',
// // //   },
// // //   selectionHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#333',
// // //     paddingHorizontal: 15,
// // //     paddingVertical: 12,
// // //     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
// // //   },
// // //   closeButton: {
// // //     marginRight: 15,
// // //   },
// // //   selectionHeaderText: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //   },
// // //   selectionActions: {
// // //     flexDirection: 'row',
// // //     gap: 20,
// // //   },
// // //   headerAction: {
// // //     padding: 4,
// // //   },
// // //   reactionPicker: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#fff',
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 15,
// // //     marginHorizontal: 10,
// // //     marginBottom: 10,
// // //     borderRadius: 30,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.15,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowRadius: 8,
// // //     elevation: 5,
// // //     justifyContent: 'space-around',
// // //   },
// // //   reactionButton: {
// // //     padding: 8,
// // //   },
// // //   reactionEmoji: {
// // //     fontSize: 28,
// // //   },
// // // });

// // // export default ChatScreen;

// // // formated time and date

// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import {
// //   View,
// //   FlatList,
// //   TextInput,
// //   ActivityIndicator,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Text,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Animated,
// //   Alert,
// //   TouchableWithoutFeedback,
// //   Modal,
// //   StatusBar,
// // } from 'react-native';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import CancelIcon from 'react-native-vector-icons/MaterialIcons';
// // import MessageDeleteIcon from 'react-native-vector-icons/Entypo';
// // import { globalStyles, colors } from '../utils/styles';
// // import Layout from './Layout';
// // import ChatHeader from '../components/ChatHeader';
// // import MessageBubble from '../components/MessageBubble';
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
// // import { formatLastSeen } from '../utils/time';

// // const REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍'];

// // // Helper function to format date labels
// // const getDateLabel = (timestamp: any) => {
// //   if (!timestamp) return '';

// //   const messageDate = timestamp.toDate();
// //   const today = new Date();
// //   const yesterday = new Date(today);
// //   yesterday.setDate(yesterday.getDate() - 1);

// //   // Reset time to compare only dates
// //   today.setHours(0, 0, 0, 0);
// //   yesterday.setHours(0, 0, 0, 0);
// //   const msgDate = new Date(messageDate);
// //   msgDate.setHours(0, 0, 0, 0);

// //   if (msgDate.getTime() === today.getTime()) {
// //     return 'Today';
// //   } else if (msgDate.getTime() === yesterday.getTime()) {
// //     return 'Yesterday';
// //   } else {
// //     return messageDate.toLocaleDateString('en-US', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric',
// //     });
// //   }
// // };

// // // Helper function to check if two messages are on different days
// // const isDifferentDay = (timestamp1: any, timestamp2: any) => {
// //   if (!timestamp1 || !timestamp2) return true;

// //   const date1 = timestamp1.toDate();
// //   const date2 = timestamp2.toDate();

// //   return (
// //     date1.getDate() !== date2.getDate() ||
// //     date1.getMonth() !== date2.getMonth() ||
// //     date1.getFullYear() !== date2.getFullYear()
// //   );
// // };

// // const ChatScreen = () => {
// //   const route = useRoute();
// //   const { chatId, otherUser, group }: any = route.params;
// //   const isGroup = !!group;
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const navigation = useNavigation();
// //   const currentUid: any = currentUser()?.uid;
// //   const [isTyping, setIsTyping] = useState(false);
// //   const [isOtherTyping, setIsOtherTyping] = useState(false);
// //   const [senderNames, setSenderNames] = useState<any>({});
// //   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
// //   const [showActionModal, setShowActionModal] = useState(false);
// //   const [selectedMessage, setSelectedMessage] = useState<any>(null);
// //   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
// //   const flatListRef = useRef<FlatList>(null);
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [showConfirmModal, setShowConfirmModal] = useState(false);
// //   const [selectedMessageId, setSelectedMessageId] = useState(null);
// //   const [selectedMessageForMenu, setSelectedMessageForMenu] =
// //     useState<any>(null);
// //   const [showReactionPicker, setShowReactionPicker] = useState(false);

// //   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

// //   useEffect(() => {
// //     if (!isGroup || !messages.length) return;
// //     const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
// //     uniqueUids.forEach(uid => {
// //       if (!senderNames[uid]) {
// //         usersRef()
// //           .doc(uid)
// //           .get()
// //           .then((doc: any) => {
// //             if (doc.exists) {
// //               setSenderNames((prev: any) => ({
// //                 ...prev,
// //                 [uid]: doc.data().name,
// //               }));
// //             }
// //           })
// //           .catch(console.error);
// //       }
// //     });
// //   }, [messages, isGroup, senderNames]);

// //   useEffect(() => {
// //     if (!chatId || !currentUid) return;

// //     let unsubscribe: any;

// //     const setupChat = async () => {
// //       try {
// //         await initializeChatDoc(chatId, allParticipants, isGroup);

// //         const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// //         unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
// //           async querySnapshot => {
// //             const msgList: any = [];
// //             querySnapshot.forEach(doc => {
// //               const data = doc.data();
// //               if (
// //                 data.deletedFor &&
// //                 data.deletedFor[currentUid] &&
// //                 !data.deletedGlobally
// //               ) {
// //                 return;
// //               }
// //               msgList.push({ id: doc.id, ...data });
// //             });
// //             setMessages(msgList);
// //             setLoading(false);
// //             setTimeout(
// //               () => flatListRef.current?.scrollToEnd({ animated: true }),
// //               300,
// //             );

// //             await markAsRead(chatId, currentUid, isGroup).catch(console.error);
// //           },
// //           error => {
// //             console.error('Chat listen error:', error);
// //             setLoading(false);
// //           },
// //         );
// //       } catch (error) {
// //         console.error('Setup chat error:', error);
// //         setLoading(false);
// //       }
// //     };

// //     setupChat();

// //     return () => {
// //       if (unsubscribe) {
// //         unsubscribe();
// //       }
// //     };
// //   }, [chatId, currentUid, isGroup]);

// //   useEffect(() => {
// //     if (!chatId || !currentUid) return;

// //     const typingUnsub = chatDocRef(chatId).onSnapshot((doc: any) => {
// //       if (doc.exists) {
// //         const typingBy = doc.data()?.typingBy || [];
// //         const otherTyping = typingBy.some(
// //           (uid: any) =>
// //             (isGroup ? group.members.includes(uid) : uid === otherUser.uid) &&
// //             uid !== currentUid,
// //         );
// //         setIsOtherTyping(otherTyping);
// //       }
// //     });

// //     return () => {
// //       typingUnsub();
// //       if (typingTimeout.current) clearTimeout(typingTimeout.current);
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
// //       setIsTyping(false);
// //       updateTypingStatus(chatId, currentUid, false);
// //     }, 1500);
// //   };

// //   const handleLongPress = useCallback((item: any) => {
// //     setSelectedMessageForMenu(item);
// //   }, []);

// //   const closeMessageMenu = () => {
// //     setSelectedMessageForMenu(null);
// //     setShowReactionPicker(false);
// //   };

// //   const handleEdit = useCallback(
// //     (item: any) => {
// //       if (item.senderUid !== currentUid) {
// //         Alert.alert('Error', 'You can only edit your own messages.');
// //         return;
// //       }
// //       setEditingMessageId(item.id);
// //       setText(item.text);
// //       closeMessageMenu();
// //     },
// //     [currentUid],
// //   );

// //   const handleDelete = useCallback(
// //     (messageId: any, senderUid: string) => {
// //       if (senderUid !== currentUid) {
// //         Alert.alert('Error', 'You can only delete your own messages.');
// //         return;
// //       }
// //       setSelectedMessageId(messageId);
// //       closeMessageMenu();
// //       setShowDeleteModal(true);
// //     },
// //     [currentUid],
// //   );

// //   const handleReaction = async (emoji: string) => {
// //     if (!selectedMessageForMenu) return;

// //     try {
// //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// //       const messageRef = ref.doc(selectedMessageForMenu.id);

// //       const currentReactions = selectedMessageForMenu.reactions || {};

// //       // Check if user already reacted with this emoji
// //       if (currentReactions[currentUid] === emoji) {
// //         // Remove reaction
// //         await messageRef.update({
// //           [`reactions.${currentUid}`]: null,
// //         });
// //       } else {
// //         // Add or update reaction (one reaction per user)
// //         await messageRef.update({
// //           [`reactions.${currentUid}`]: emoji,
// //         });
// //       }

// //       closeMessageMenu();
// //     } catch (error) {
// //       console.error('Reaction error:', error);
// //       Alert.alert('Error', 'Failed to add reaction.');
// //     }
// //   };

// //   const sendMessage = async () => {
// //     if (!text.trim()) return;
// //     const messageText = text.trim();
// //     setText('');
// //     setIsTyping(false);
// //     if (typingTimeout.current) clearTimeout(typingTimeout.current);
// //     updateTypingStatus(chatId, currentUid, false);

// //     try {
// //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// //       if (editingMessageId) {
// //         await ref.doc(editingMessageId).update({
// //           text: messageText,
// //           edited: true,
// //           editedTimestamp: serverTimestamp(),
// //         });
// //         setEditingMessageId(null);
// //       } else {
// //         await ref.add({
// //           text: messageText,
// //           senderUid: currentUid,
// //           timestamp: serverTimestamp(),
// //           read: false,
// //           deletedGlobally: false,
// //           deletedFor: {},
// //           edited: false,
// //           reactions: {},
// //         });
// //         await incrementUnreadCount(
// //           chatId,
// //           currentUid,
// //           isGroup,
// //           allParticipants,
// //         );
// //       }
// //       flatListRef.current?.scrollToEnd({ animated: true });
// //     } catch (error) {
// //       console.error('Send message error:', error);
// //     }
// //   };

// //   const deleteForMe = async (messageId: string) => {
// //     try {
// //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// //       await ref.doc(messageId).update({
// //         [`deletedFor.${currentUid}`]: true,
// //       });
// //       setMessages(prev => prev.filter((m: any) => m.id !== messageId));
// //     } catch (error) {
// //       console.error('Delete for me error:', error);
// //       Alert.alert('Error', 'Failed to delete message for you.');
// //     }
// //   };

// //   const deleteForEveryone = async (messageId: string) => {
// //     try {
// //       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
// //       await ref.doc(messageId).update({
// //         deletedGlobally: true,
// //       });
// //       setMessages((prev: any) =>
// //         prev.map((m: any) =>
// //           m.id === messageId ? { ...m, deletedGlobally: true } : m,
// //         ),
// //       );
// //     } catch (error) {
// //       console.error('Delete for everyone error:', error);
// //       Alert.alert('Error', 'Failed to delete message for everyone.');
// //     }
// //   };

// //   const typingText = isOtherTyping
// //     ? isGroup
// //       ? 'Someone is typing...'
// //       : `${otherUser.name} is typing...`
// //     : null;

// //   useEffect(() => {
// //     Animated.timing(fadeAnim, {
// //       toValue: 1,
// //       duration: 600,
// //       useNativeDriver: true,
// //     }).start();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <View
// //         style={[globalStyles.center, { backgroundColor: colors.background }]}
// //       >
// //         <ActivityIndicator size="large" color={colors.primary} />
// //       </View>
// //     );
// //   }

// //   return (
// //     <Layout
// //       statusBarColor={selectedMessageForMenu ? '#333' : colors.primary}
// //       paddingBottom={1}
// //     >
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //         keyboardVerticalOffset={80}
// //       >
// //         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
// //           {selectedMessageForMenu ? (
// //             <View style={styles.selectionHeader}>
// //               <TouchableOpacity
// //                 onPress={closeMessageMenu}
// //                 style={styles.closeButton}
// //               >
// //                 <Icon name="close" size={24} color="#fff" />
// //               </TouchableOpacity>
// //               <Text style={styles.selectionHeaderText}>Message Selected</Text>
// //               <View style={styles.selectionActions}>
// //                 <TouchableOpacity
// //                   onPress={() => setShowReactionPicker(!showReactionPicker)}
// //                   style={styles.headerAction}
// //                 >
// //                   <Icon name="happy-outline" size={24} color="#fff" />
// //                 </TouchableOpacity>
// //                 {selectedMessageForMenu.senderUid === currentUid && (
// //                   <>
// //                     <TouchableOpacity
// //                       onPress={() => handleEdit(selectedMessageForMenu)}
// //                       style={styles.headerAction}
// //                     >
// //                       <Icon name="create-outline" size={24} color="#fff" />
// //                     </TouchableOpacity>
// //                     <TouchableOpacity
// //                       onPress={() =>
// //                         handleDelete(
// //                           selectedMessageForMenu.id,
// //                           selectedMessageForMenu.senderUid,
// //                         )
// //                       }
// //                       style={styles.headerAction}
// //                     >
// //                       <Icon name="trash-outline" size={24} color="#fff" />
// //                     </TouchableOpacity>
// //                   </>
// //                 )}
// //               </View>
// //             </View>
// //           ) : (
// //             <ChatHeader
// //               name={isGroup ? group.name : otherUser.name}
// //               lastSeen={
// //                 isGroup
// //                   ? group.isOnline
// //                     ? ''
// //                     : group.lastSeen
// //                   : otherUser.isOnline
// //                   ? ''
// //                   : formatLastSeen(otherUser.lastSeen)
// //               }
// //               isOnline={isGroup ? group.isOnline : otherUser.isOnline}
// //               onBack={() => navigation.goBack()}
// //               typing={isOtherTyping}
// //             />
// //           )}

// //           <FlatList
// //             ref={flatListRef}
// //             data={messages}
// //             keyExtractor={(item: any) => item.id}
// //             renderItem={({ item, index }: any) => {
// //               const showDateSeparator =
// //                 index === 0 ||
// //                 isDifferentDay(messages[index - 1].timestamp, item.timestamp);

// //               if (item.deletedGlobally) {
// //                 return (
// //                   <>
// //                     {showDateSeparator && (
// //                       <View style={styles.dateSeparatorContainer}>
// //                         <View style={styles.dateSeparatorLine} />
// //                         <Text style={styles.dateSeparatorText}>
// //                           {getDateLabel(item.timestamp)}
// //                         </Text>
// //                         <View style={styles.dateSeparatorLine} />
// //                       </View>
// //                     )}
// //                     <View
// //                       style={{
// //                         alignSelf:
// //                           item.senderUid === currentUid
// //                             ? 'flex-end'
// //                             : 'flex-start',
// //                         marginVertical: 5,
// //                         paddingHorizontal: 10,
// //                         flexDirection: 'row',
// //                         alignItems: 'center',
// //                         backgroundColor: '#8d8888ff',
// //                         padding: 8,
// //                         borderRadius: 12,
// //                         gap: 5,
// //                       }}
// //                     >
// //                       <MessageDeleteIcon name="block" color={'white'} />
// //                       <Text
// //                         style={{
// //                           color: '#ffffffff',
// //                           fontStyle: 'italic',
// //                           fontSize: 14,
// //                         }}
// //                       >
// //                         This message was deleted
// //                       </Text>
// //                     </View>
// //                   </>
// //                 );
// //               }
// //               return (
// //                 <>
// //                   {showDateSeparator && (
// //                     <View style={styles.dateSeparatorContainer}>
// //                       <View style={styles.dateSeparatorLine} />
// //                       <Text style={styles.dateSeparatorText}>
// //                         {getDateLabel(item.timestamp)}
// //                       </Text>
// //                       <View style={styles.dateSeparatorLine} />
// //                     </View>
// //                   )}
// //                   <TouchableWithoutFeedback
// //                     onLongPress={() => handleLongPress(item)}
// //                   >
// //                     <View>
// //                       <MessageBubble
// //                         text={item.text}
// //                         isMe={item.senderUid === currentUid}
// //                         timestamp={item.timestamp}
// //                         senderName={
// //                           isGroup && item.senderUid !== currentUid
// //                             ? senderNames[item.senderUid] || 'Unknown'
// //                             : undefined
// //                         }
// //                         edited={item.edited}
// //                         reactions={item.reactions || {}}
// //                         isSelected={selectedMessageForMenu?.id === item.id}
// //                         senderNames={senderNames}
// //                         currentUid={currentUid}
// //                       />
// //                     </View>
// //                   </TouchableWithoutFeedback>
// //                 </>
// //               );
// //             }}
// //             style={{ flex: 1, paddingHorizontal: 10 }}
// //             contentContainerStyle={{
// //               paddingBottom: 10,
// //             }}
// //             onContentSizeChange={() =>
// //               flatListRef.current?.scrollToEnd({ animated: true })
// //             }
// //           />

// //           {showReactionPicker && selectedMessageForMenu && (
// //             <View style={styles.reactionPicker}>
// //               {REACTIONS.map(emoji => (
// //                 <TouchableOpacity
// //                   key={emoji}
// //                   onPress={() => handleReaction(emoji)}
// //                   style={styles.reactionButton}
// //                 >
// //                   <Text style={styles.reactionEmoji}>{emoji}</Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           )}

// //           {typingText ? (
// //             <View style={styles.typingIndicator}>
// //               <Text style={styles.typingText}>{typingText}</Text>
// //             </View>
// //           ) : null}

// //           <View style={styles.inputWrapper}>
// //             <View style={styles.inputContainer}>
// //               {editingMessageId && (
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     setEditingMessageId(null);
// //                     setText('');
// //                   }}
// //                   style={[styles.cancelButton]}
// //                 >
// //                   <CancelIcon name="cancel" size={32} color={colors.primary} />
// //                 </TouchableOpacity>
// //               )}
// //               <TextInput
// //                 style={styles.textInput}
// //                 value={text}
// //                 onChangeText={handleInputChange}
// //                 placeholder={
// //                   editingMessageId ? 'Edit message...' : 'Type a message...'
// //                 }
// //               />

// //               <TouchableOpacity
// //                 onPress={sendMessage}
// //                 style={[
// //                   styles.sendButton,
// //                   !text.trim() && { backgroundColor: '#ddd' },
// //                 ]}
// //                 disabled={!text.trim()}
// //               >
// //                 <Icon
// //                   name="send"
// //                   size={22}
// //                   color={text.trim() ? '#fff' : '#999'}
// //                 />
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Animated.View>

// //         <Modal
// //           visible={showDeleteModal}
// //           transparent
// //           animationType="fade"
// //           onRequestClose={() => setShowDeleteModal(false)}
// //           statusBarTranslucent={true}
// //         >
// //           <View
// //             style={{
// //               flex: 1,
// //               justifyContent: 'center',
// //               alignItems: 'center',
// //               backgroundColor: 'rgba(0,0,0,0.5)',
// //             }}
// //           >
// //             <View
// //               style={{
// //                 backgroundColor: colors.background,
// //                 padding: 20,
// //                 borderRadius: 10,
// //                 width: '80%',
// //               }}
// //             >
// //               <Text
// //                 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}
// //               >
// //                 Delete Message
// //               </Text>
// //               <Text
// //                 style={{
// //                   marginBottom: 22,
// //                   fontSize: 16,
// //                   fontStyle: 'italic',
// //                 }}
// //               >
// //                 Are you sure you want to delete this message?
// //               </Text>
// //               <TouchableOpacity
// //                 style={{
// //                   paddingHorizontal: 10,
// //                   marginBottom: 16,
// //                   borderRadius: 5,
// //                 }}
// //                 onPress={() => {
// //                   setShowDeleteModal(false);
// //                   deleteForMe(selectedMessageId);
// //                 }}
// //               >
// //                 <Text style={{ textAlign: 'right', fontSize: 16 }}>
// //                   Delete for me
// //                 </Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={{
// //                   paddingHorizontal: 10,
// //                   marginBottom: 16,
// //                   borderRadius: 5,
// //                 }}
// //                 onPress={async () => {
// //                   setShowDeleteModal(false);
// //                   await deleteForEveryone(selectedMessageId);
// //                 }}
// //               >
// //                 <Text
// //                   style={{ color: 'red', textAlign: 'right', fontSize: 16 }}
// //                 >
// //                   Delete for everyone
// //                 </Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 onPress={() => setShowDeleteModal(false)}
// //                 style={{ paddingHorizontal: 10 }}
// //               >
// //                 <Text
// //                   style={{ color: 'blue', textAlign: 'right', fontSize: 16 }}
// //                 >
// //                   Cancel
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Modal>
// //       </KeyboardAvoidingView>
// //     </Layout>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   inputWrapper: {
// //     width: '100%',
// //     backgroundColor: 'transparent',
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginHorizontal: 10,
// //     marginBottom: 10,
// //     borderRadius: 30,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     backgroundColor: '#fff',
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowRadius: 5,
// //     elevation: 4,
// //   },
// //   textInput: {
// //     flex: 1,
// //     paddingHorizontal: 12,
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   sendButton: {
// //     backgroundColor: colors.primary,
// //     padding: 10,
// //     borderRadius: 20,
// //     marginLeft: 8,
// //   },
// //   cancelButton: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   cancelText: {
// //     color: colors.primary,
// //     fontSize: 16,
// //   },
// //   typingIndicator: {
// //     alignSelf: 'flex-start',
// //     backgroundColor: '#eee',
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     marginLeft: 15,
// //     marginBottom: 10,
// //   },
// //   typingText: {
// //     fontStyle: 'italic',
// //     color: '#666',
// //   },
// //   selectionHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#333',
// //     paddingHorizontal: 15,
// //     paddingVertical: 12,
// //     // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
// //     borderBottomRightRadius: 28,
// //     borderBottomLeftRadius: 28,
// //   },
// //   closeButton: {
// //     marginRight: 15,
// //   },
// //   selectionHeaderText: {
// //     flex: 1,
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: '600',
// //   },
// //   selectionActions: {
// //     flexDirection: 'row',
// //     gap: 20,
// //   },
// //   headerAction: {
// //     padding: 4,
// //   },
// //   reactionPicker: {
// //     flexDirection: 'row',
// //     backgroundColor: '#fff',
// //     paddingVertical: 10,
// //     paddingHorizontal: 15,
// //     marginHorizontal: 10,
// //     marginBottom: 10,
// //     borderRadius: 30,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.15,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowRadius: 8,
// //     elevation: 5,
// //     justifyContent: 'space-around',
// //   },
// //   reactionButton: {
// //     padding: 8,
// //   },
// //   reactionEmoji: {
// //     fontSize: 28,
// //   },
// //   dateSeparatorContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginVertical: 15,
// //     paddingHorizontal: 10,
// //   },
// //   dateSeparatorLine: {
// //     flex: 1,
// //     height: 1,
// //     backgroundColor: '#ddd',
// //   },
// //   dateSeparatorText: {
// //     marginHorizontal: 10,
// //     fontSize: 12,
// //     color: '#888',
// //     fontWeight: '600',
// //     backgroundColor: colors.background,
// //     paddingHorizontal: 10,
// //     paddingVertical: 3,
// //     borderRadius: 12,
// //   },
// // });

// // export default ChatScreen;

// //Working and Fully Tested Code Fine:
// import React, { useState, useEffect, useRef, useCallback } from 'react';
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
//   Alert,
//   TouchableWithoutFeedback,
//   Modal,
//   StatusBar,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import CancelIcon from 'react-native-vector-icons/MaterialIcons';
// import MessageDeleteIcon from 'react-native-vector-icons/Entypo';
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

// const REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍'];

// // Helper function to format date labels
// const getDateLabel = (timestamp: any) => {
//   if (!timestamp) return '';

//   const messageDate = timestamp.toDate();
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   // Reset time to compare only dates
//   today.setHours(0, 0, 0, 0);
//   yesterday.setHours(0, 0, 0, 0);
//   const msgDate = new Date(messageDate);
//   msgDate.setHours(0, 0, 0, 0);

//   if (msgDate.getTime() === today.getTime()) {
//     return 'Today';
//   } else if (msgDate.getTime() === yesterday.getTime()) {
//     return 'Yesterday';
//   } else {
//     return messageDate.toLocaleDateString('en-US', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   }
// };

// // Helper function to check if two messages are on different days
// const isDifferentDay = (timestamp1: any, timestamp2: any) => {
//   if (!timestamp1 || !timestamp2) return true;

//   const date1 = timestamp1.toDate();
//   const date2 = timestamp2.toDate();

//   return (
//     date1.getDate() !== date2.getDate() ||
//     date1.getMonth() !== date2.getMonth() ||
//     date1.getFullYear() !== date2.getFullYear()
//   );
// };

// const ChatScreen = () => {
//   const route = useRoute();
//   const { chatId, otherUser, group }: any = route.params;
//   const isGroup = !!group;
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();
//   const currentUid: any = currentUser()?.uid;
//   const [isTyping, setIsTyping] = useState(false);
//   const [isOtherTyping, setIsOtherTyping] = useState(false);
//   const [senderNames, setSenderNames] = useState<any>({});
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState<any>(null);
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const flatListRef = useRef<FlatList>(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedMessageId, setSelectedMessageId] = useState(null);
//   const [selectedMessageForMenu, setSelectedMessageForMenu] =
//     useState<any>(null);
//   const [showReactionPicker, setShowReactionPicker] = useState(false);
//   const [messagePosition, setMessagePosition] = useState({
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//   });
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const messageRefs = useRef<{ [key: string]: any }>({});

//   const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

//   useEffect(() => {
//     if (!isGroup || !messages.length) return;
//     const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
//     uniqueUids.forEach(uid => {
//       if (!senderNames[uid]) {
//         usersRef()
//           .doc(uid)
//           .get()
//           .then((doc: any) => {
//             if (doc.exists) {
//               setSenderNames((prev: any) => ({
//                 ...prev,
//                 [uid]: doc.data().name,
//               }));
//             }
//           })
//           .catch(console.error);
//       }
//     });
//   }, [messages, isGroup, senderNames]);

//   useEffect(() => {
//     if (!chatId || !currentUid) return;

//     let unsubscribe: any;

//     const setupChat = async () => {
//       try {
//         await initializeChatDoc(chatId, allParticipants, isGroup);

//         const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//         unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
//           async querySnapshot => {
//             const msgList: any = [];
//             querySnapshot.forEach(doc => {
//               const data = doc.data();
//               if (
//                 data.deletedFor &&
//                 data.deletedFor[currentUid] &&
//                 !data.deletedGlobally
//               ) {
//                 return;
//               }
//               msgList.push({ id: doc.id, ...data });
//             });
//             setMessages(msgList);
//             setLoading(false);
//             setTimeout(
//               () => flatListRef.current?.scrollToEnd({ animated: true }),
//               300,
//             );

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

//     const typingUnsub = chatDocRef(chatId).onSnapshot((doc: any) => {
//       if (doc.exists) {
//         const typingBy = doc.data()?.typingBy || [];
//         const otherTyping = typingBy.some(
//           (uid: any) =>
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

//   const handleLongPress = useCallback((item: any) => {
//     setSelectedMessageForMenu(item);
//     const ref = messageRefs.current[item.id];
//     if (ref) {
//       ref.measureInWindow((x, y, width, height) => {
//         setMessagePosition({ x, y, width, height });
//         setShowReactionPicker(true);
//       });
//     } else {
//       setShowReactionPicker(true);
//     }
//   }, []);

//   const closeMessageMenu = () => {
//     setSelectedMessageForMenu(null);
//     setShowReactionPicker(false);
//   };

//   const handleEdit = useCallback(
//     (item: any) => {
//       if (item.senderUid !== currentUid) {
//         Alert.alert('Error', 'You can only edit your own messages.');
//         return;
//       }
//       setEditingMessageId(item.id);
//       setText(item.text);
//       closeMessageMenu();
//     },
//     [currentUid],
//   );

//   const handleDelete = useCallback(
//     (messageId: any, senderUid: string) => {
//       if (senderUid !== currentUid) {
//         Alert.alert('Error', 'You can only delete your own messages.');
//         return;
//       }
//       setSelectedMessageId(messageId);
//       closeMessageMenu();
//       setShowDeleteModal(true);
//     },
//     [currentUid],
//   );

//   const handleReaction = async (emoji: string) => {
//     if (!selectedMessageForMenu) return;

//     try {
//       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//       const messageRef = ref.doc(selectedMessageForMenu.id);

//       const currentReactions = selectedMessageForMenu.reactions || {};

//       // Check if user already reacted with this emoji
//       if (currentReactions[currentUid] === emoji) {
//         // Remove reaction
//         await messageRef.update({
//           [`reactions.${currentUid}`]: null,
//         });
//       } else {
//         // Add or update reaction (one reaction per user)
//         await messageRef.update({
//           [`reactions.${currentUid}`]: emoji,
//         });
//       }

//       closeMessageMenu();
//     } catch (error) {
//       console.error('Reaction error:', error);
//       Alert.alert('Error', 'Failed to add reaction.');
//     }
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
//       if (editingMessageId) {
//         await ref.doc(editingMessageId).update({
//           text: messageText,
//           edited: true,
//           editedTimestamp: serverTimestamp(),
//         });
//         setEditingMessageId(null);
//       } else {
//         await ref.add({
//           text: messageText,
//           senderUid: currentUid,
//           timestamp: serverTimestamp(),
//           read: false,
//           deletedGlobally: false,
//           deletedFor: {},
//           edited: false,
//           reactions: {},
//         });
//         await incrementUnreadCount(
//           chatId,
//           currentUid,
//           isGroup,
//           allParticipants,
//         );
//       }
//       flatListRef.current?.scrollToEnd({ animated: true });
//     } catch (error) {
//       console.error('Send message error:', error);
//     }
//   };

//   const deleteForMe = async (messageId: string) => {
//     try {
//       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//       await ref.doc(messageId).update({
//         [`deletedFor.${currentUid}`]: true,
//       });
//       setMessages(prev => prev.filter((m: any) => m.id !== messageId));
//     } catch (error) {
//       console.error('Delete for me error:', error);
//       Alert.alert('Error', 'Failed to delete message for you.');
//     }
//   };

//   const deleteForEveryone = async (messageId: string) => {
//     try {
//       const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//       await ref.doc(messageId).update({
//         deletedGlobally: true,
//       });
//       setMessages((prev: any) =>
//         prev.map((m: any) =>
//           m.id === messageId ? { ...m, deletedGlobally: true } : m,
//         ),
//       );
//     } catch (error) {
//       console.error('Delete for everyone error:', error);
//       Alert.alert('Error', 'Failed to delete message for everyone.');
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
//     <Layout
//       statusBarColor={selectedMessageForMenu ? '#333' : colors.primary}
//       paddingBottom={1}
//     >
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={80}
//       >
//         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
//           {selectedMessageForMenu ? (
//             <View
//               style={styles.selectionHeader}
//               onLayout={event => {
//                 const { height } = event.nativeEvent.layout;
//                 const statusBarHeight =
//                   Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
//                 setHeaderHeight(height + statusBarHeight);
//               }}
//             >
//               <TouchableOpacity
//                 onPress={closeMessageMenu}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#fff" />
//               </TouchableOpacity>
//               <Text style={styles.selectionHeaderText}>Message Selected</Text>
//               <View style={styles.selectionActions}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     if (!showReactionPicker && selectedMessageForMenu) {
//                       const ref =
//                         messageRefs.current[selectedMessageForMenu.id];
//                       if (ref) {
//                         ref.measureInWindow((x, y, width, height) => {
//                           setMessagePosition({ x, y, width, height });
//                         });
//                       }
//                     }
//                     setShowReactionPicker(prev => !prev);
//                   }}
//                   style={styles.headerAction}
//                 >
//                   <Icon name="happy-outline" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 {selectedMessageForMenu.senderUid === currentUid && (
//                   <>
//                     <TouchableOpacity
//                       onPress={() => handleEdit(selectedMessageForMenu)}
//                       style={styles.headerAction}
//                     >
//                       <Icon name="create-outline" size={24} color="#fff" />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={() =>
//                         handleDelete(
//                           selectedMessageForMenu.id,
//                           selectedMessageForMenu.senderUid,
//                         )
//                       }
//                       style={styles.headerAction}
//                     >
//                       <Icon name="trash-outline" size={24} color="#fff" />
//                     </TouchableOpacity>
//                   </>
//                 )}
//               </View>
//             </View>
//           ) : (
//             <ChatHeader
//               name={isGroup ? group.name : otherUser.name}
//               lastSeen={
//                 isGroup
//                   ? group.isOnline
//                     ? ''
//                     : group.lastSeen
//                   : otherUser.isOnline
//                   ? ''
//                   : formatLastSeen(otherUser.lastSeen)
//               }
//               isOnline={isGroup ? group.isOnline : otherUser.isOnline}
//               onBack={() => navigation.goBack()}
//               typing={isOtherTyping}
//             />
//           )}

//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(item: any) => item.id}
//             renderItem={({ item, index }: any) => {
//               const showDateSeparator =
//                 index === 0 ||
//                 isDifferentDay(messages[index - 1].timestamp, item.timestamp);

//               if (item.deletedGlobally) {
//                 return (
//                   <>
//                     {showDateSeparator && (
//                       <View style={styles.dateSeparatorContainer}>
//                         <View style={styles.dateSeparatorLine} />
//                         <Text style={styles.dateSeparatorText}>
//                           {getDateLabel(item.timestamp)}
//                         </Text>
//                         <View style={styles.dateSeparatorLine} />
//                       </View>
//                     )}
//                     <View
//                       style={{
//                         alignSelf:
//                           item.senderUid === currentUid
//                             ? 'flex-end'
//                             : 'flex-start',
//                         marginVertical: 5,
//                         paddingHorizontal: 10,
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         backgroundColor: '#8d8888ff',
//                         padding: 8,
//                         borderRadius: 12,
//                         gap: 5,
//                       }}
//                     >
//                       <MessageDeleteIcon name="block" color={'white'} />
//                       <Text
//                         style={{
//                           color: '#ffffffff',
//                           fontStyle: 'italic',
//                           fontSize: 14,
//                         }}
//                       >
//                         This message was deleted
//                       </Text>
//                     </View>
//                   </>
//                 );
//               }
//               return (
//                 <>
//                   {showDateSeparator && (
//                     <View style={styles.dateSeparatorContainer}>
//                       <View style={styles.dateSeparatorLine} />
//                       <Text style={styles.dateSeparatorText}>
//                         {getDateLabel(item.timestamp)}
//                       </Text>
//                       <View style={styles.dateSeparatorLine} />
//                     </View>
//                   )}
//                   <TouchableWithoutFeedback
//                     onLongPress={() => handleLongPress(item)}
//                   >
//                     <View
//                       ref={ref => {
//                         if (ref) {
//                           messageRefs.current[item.id] = ref;
//                         } else {
//                           delete messageRefs.current[item.id];
//                         }
//                       }}
//                     >
//                       <MessageBubble
//                         text={item.text}
//                         isMe={item.senderUid === currentUid}
//                         timestamp={item.timestamp}
//                         senderName={
//                           isGroup && item.senderUid !== currentUid
//                             ? senderNames[item.senderUid] || 'Unknown'
//                             : undefined
//                         }
//                         edited={item.edited}
//                         reactions={item.reactions || {}}
//                         isSelected={selectedMessageForMenu?.id === item.id}
//                         senderNames={senderNames}
//                         currentUid={currentUid}
//                       />
//                     </View>
//                   </TouchableWithoutFeedback>
//                 </>
//               );
//             }}
//             style={{ flex: 1, paddingHorizontal: 10 }}
//             contentContainerStyle={{
//               paddingBottom: 10,
//             }}
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
//               {editingMessageId && (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setEditingMessageId(null);
//                     setText('');
//                   }}
//                   style={[styles.cancelButton]}
//                 >
//                   <CancelIcon name="cancel" size={32} color={colors.primary} />
//                 </TouchableOpacity>
//               )}
//               <TextInput
//                 style={styles.textInput}
//                 value={text}
//                 onChangeText={handleInputChange}
//                 placeholder={
//                   editingMessageId ? 'Edit message...' : 'Type a message...'
//                 }
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

//           {showReactionPicker && selectedMessageForMenu && (
//             <View style={styles.pickerContainer} pointerEvents="box-none">
//               <TouchableWithoutFeedback
//                 onPress={() => {
//                   setShowReactionPicker(false);
//                   closeMessageMenu();
//                 }}
//               >
//                 <View style={[styles.pickerOverlay, { top: headerHeight }]} />
//               </TouchableWithoutFeedback>
//               <View
//                 style={[
//                   styles.reactionPicker,
//                   {
//                     position: 'absolute',
//                     top: messagePosition.y + messagePosition.height,
//                     left: messagePosition.x,
//                   },
//                 ]}
//               >
//                 {REACTIONS.map(emoji => (
//                   <TouchableOpacity
//                     key={emoji}
//                     onPress={() => handleReaction(emoji)}
//                     style={styles.reactionButton}
//                   >
//                     <Text style={styles.reactionEmoji}>{emoji}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}
//         </Animated.View>

//         <Modal
//           visible={showDeleteModal}
//           transparent
//           animationType="fade"
//           onRequestClose={() => setShowDeleteModal(false)}
//           statusBarTranslucent={true}
//         >
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: 'rgba(0,0,0,0.5)',
//             }}
//           >
//             <View
//               style={{
//                 backgroundColor: colors.background,
//                 padding: 20,
//                 borderRadius: 10,
//                 width: '80%',
//               }}
//             >
//               <Text
//                 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}
//               >
//                 Delete Message
//               </Text>
//               <Text
//                 style={{
//                   marginBottom: 22,
//                   fontSize: 16,
//                   fontStyle: 'italic',
//                 }}
//               >
//                 Are you sure you want to delete this message?
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   paddingHorizontal: 10,
//                   marginBottom: 16,
//                   borderRadius: 5,
//                 }}
//                 onPress={() => {
//                   setShowDeleteModal(false);
//                   deleteForMe(selectedMessageId);
//                 }}
//               >
//                 <Text style={{ textAlign: 'right', fontSize: 16 }}>
//                   Delete for me
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{
//                   paddingHorizontal: 10,
//                   marginBottom: 16,
//                   borderRadius: 5,
//                 }}
//                 onPress={async () => {
//                   setShowDeleteModal(false);
//                   await deleteForEveryone(selectedMessageId);
//                 }}
//               >
//                 <Text
//                   style={{ color: 'red', textAlign: 'right', fontSize: 16 }}
//                 >
//                   Delete for everyone
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setShowDeleteModal(false)}
//                 style={{ paddingHorizontal: 10 }}
//               >
//                 <Text
//                   style={{ color: 'blue', textAlign: 'right', fontSize: 16 }}
//                 >
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </KeyboardAvoidingView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   inputWrapper: {
//     width: '100%',
//     backgroundColor: 'transparent',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
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
//     fontSize: 16,
//     color: '#333',
//   },
//   sendButton: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 20,
//     marginLeft: 8,
//   },
//   cancelButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelText: {
//     color: colors.primary,
//     fontSize: 16,
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
//   selectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderBottomRightRadius: 28,
//     borderBottomLeftRadius: 28,
//   },
//   closeButton: {
//     marginRight: 15,
//   },
//   selectionHeaderText: {
//     flex: 1,
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   selectionActions: {
//     flexDirection: 'row',
//     gap: 20,
//   },
//   headerAction: {
//     padding: 4,
//   },
//   reactionButton: {
//     padding: 8,
//   },
//   reactionEmoji: {
//     fontSize: 28,
//   },
//   pickerContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1000,
//     pointerEvents: 'box-none',
//   },
//   pickerOverlay: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'transparent',
//   },
//   reactionPicker: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 5,
//     justifyContent: 'space-around',
//   },
//   dateSeparatorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 15,
//     paddingHorizontal: 10,
//   },
//   dateSeparatorLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   dateSeparatorText: {
//     marginHorizontal: 10,
//     fontSize: 12,
//     color: '#888',
//     fontWeight: '600',
//     backgroundColor: colors.background,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//   },
// });

// export default ChatScreen;

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
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
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CancelIcon from 'react-native-vector-icons/MaterialIcons';
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
  blockUser,
  unblockUser,
} from '../services/firebase';
import { usersRef } from '../services/firebase';
import { formatLastSeen } from '../utils/time';

const REACTIONS = ['❤️', '😂', '😮', '😢', '🙏', '👍'];

// Helper function to format date labels
const getDateLabel = (timestamp: any) => {
  if (!timestamp) return '';

  const messageDate = timestamp.toDate();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const msgDate = new Date(messageDate);
  msgDate.setHours(0, 0, 0, 0);

  if (msgDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (msgDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return messageDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

// Helper function to check if two messages are on different days
const isDifferentDay = (timestamp1: any, timestamp2: any) => {
  if (!timestamp1 || !timestamp2) return true;

  const date1 = timestamp1.toDate();
  const date2 = timestamp2.toDate();

  return (
    date1.getDate() !== date2.getDate() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getFullYear() !== date2.getFullYear()
  );
};

const ChatScreen = () => {
  const route = useRoute();
  const { chatId, otherUser, group }: any = route.params;
  const isGroup = !!group;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentUid: any = currentUser()?.uid;
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [senderNames, setSenderNames] = useState<any>({});
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMessageForMenu, setSelectedMessageForMenu] =
    useState<any>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [messagePosition, setMessagePosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [headerHeight, setHeaderHeight] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [otherBlockedUsers, setOtherBlockedUsers] = useState<string[]>([]);
  const messageRefs = useRef<{ [key: string]: any }>({});

  const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

  const isBlocked = useMemo(
    () => blockedUsers.includes(otherUser?.uid || ''),
    [blockedUsers, otherUser?.uid],
  );

  const canSend = useMemo(
    () => isGroup || !otherBlockedUsers.includes(currentUid),
    [otherBlockedUsers, currentUid, isGroup],
  );

  const handleOptions = useCallback(() => {
    if (isGroup) return;

    Alert.alert(
      isBlocked ? 'Unblock User' : 'Block User',
      isBlocked
        ? 'Are you sure you want to unblock this user?'
        : 'Blocking this user will prevent them from sending you messages. You will also not see their messages.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isBlocked ? 'Unblock' : 'Block',
          style: isBlocked ? 'default' : 'destructive',
          onPress: async () => {
            try {
              if (isBlocked) {
                await unblockUser(currentUid, otherUser.uid);
              } else {
                await blockUser(currentUid, otherUser.uid);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to update block status.');
            }
          },
        },
      ],
    );
  }, [isBlocked, currentUid, otherUser?.uid, isGroup]);

  useEffect(() => {
    if (!currentUid) return;

    const unsubMyBlocks = usersRef()
      .doc(currentUid)
      .onSnapshot(doc => {
        setBlockedUsers(doc.data()?.blockedUsers || []);
      }, console.error);

    return () => unsubMyBlocks();
  }, [currentUid]);

  useEffect(() => {
    if (isGroup || !otherUser?.uid || !currentUid) return;

    const unsubOtherBlocks = usersRef()
      .doc(otherUser.uid)
      .onSnapshot(doc => {
        setOtherBlockedUsers(doc.data()?.blockedUsers || []);
      }, console.error);

    return () => unsubOtherBlocks();
  }, [otherUser?.uid, isGroup, currentUid]);

  useEffect(() => {
    if (!isGroup || !messages.length) return;
    const uniqueUids = [...new Set(messages.map((m: any) => m.senderUid))];
    uniqueUids.forEach(uid => {
      if (!senderNames[uid]) {
        usersRef()
          .doc(uid)
          .get()
          .then((doc: any) => {
            if (doc.exists) {
              setSenderNames((prev: any) => ({
                ...prev,
                [uid]: doc.data().name,
              }));
            }
          })
          .catch(console.error);
      }
    });
  }, [messages, isGroup, senderNames]);

  useEffect(() => {
    if (!chatId || !currentUid) return;

    let unsubscribe: any;

    const setupChat = async () => {
      try {
        await initializeChatDoc(chatId, allParticipants, isGroup);

        const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
        unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
          async querySnapshot => {
            const msgList: any = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
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
  }, [chatId, currentUid, isGroup, blockedUsers]);

  useEffect(() => {
    if (!chatId || !currentUid) return;

    const typingUnsub = chatDocRef(chatId).onSnapshot((doc: any) => {
      if (doc.exists) {
        const typingBy = doc.data()?.typingBy || [];
        const otherTyping = typingBy.some(
          (uid: any) =>
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

  const handleLongPress = useCallback((item: any) => {
    setSelectedMessageForMenu(item);
    const ref = messageRefs.current[item.id];
    if (ref) {
      ref.measureInWindow((x, y, width, height) => {
        setMessagePosition({ x, y, width, height });
        setShowReactionPicker(true);
      });
    } else {
      setShowReactionPicker(true);
    }
  }, []);

  const closeMessageMenu = () => {
    setSelectedMessageForMenu(null);
    setShowReactionPicker(false);
  };

  const handleEdit = useCallback(
    (item: any) => {
      if (item.senderUid !== currentUid) {
        Alert.alert('Error', 'You can only edit your own messages.');
        return;
      }
      setEditingMessageId(item.id);
      setText(item.text);
      closeMessageMenu();
    },
    [currentUid],
  );

  const handleDelete = useCallback(
    (messageId: any, senderUid: string) => {
      if (senderUid !== currentUid) {
        Alert.alert('Error', 'You can only delete your own messages.');
        return;
      }
      setSelectedMessageId(messageId);
      closeMessageMenu();
      setShowDeleteModal(true);
    },
    [currentUid],
  );

  const handleReaction = async (emoji: string) => {
    if (!selectedMessageForMenu) return;

    try {
      const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
      const messageRef = ref.doc(selectedMessageForMenu.id);

      const currentReactions = selectedMessageForMenu.reactions || {};

      // Check if user already reacted with this emoji
      if (currentReactions[currentUid] === emoji) {
        // Remove reaction
        await messageRef.update({
          [`reactions.${currentUid}`]: null,
        });
      } else {
        // Add or update reaction (one reaction per user)
        await messageRef.update({
          [`reactions.${currentUid}`]: emoji,
        });
      }

      closeMessageMenu();
    } catch (error) {
      console.error('Reaction error:', error);
      Alert.alert('Error', 'Failed to add reaction.');
    }
  };

  const sendMessage = async () => {
    if (!isGroup && !canSend) {
      Alert.alert(
        'Blocked',
        'This user has blocked you. You cannot send messages.',
      );
      return;
    }
    if (!text.trim()) return;
    const messageText = text.trim();
    setText('');
    setIsTyping(false);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    updateTypingStatus(chatId, currentUid, false);

    try {
      const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
      if (editingMessageId) {
        await ref.doc(editingMessageId).update({
          text: messageText,
          edited: true,
          editedTimestamp: serverTimestamp(),
        });
        setEditingMessageId(null);
      } else {
        await ref.add({
          text: messageText,
          senderUid: currentUid,
          timestamp: serverTimestamp(),
          read: false,
          deletedGlobally: false,
          deletedFor: {},
          edited: false,
          reactions: {},
        });
        await incrementUnreadCount(
          chatId,
          currentUid,
          isGroup,
          allParticipants,
        );
      }
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
      setMessages((prev: any) =>
        prev.map((m: any) =>
          m.id === messageId ? { ...m, deletedGlobally: true } : m,
        ),
      );
    } catch (error) {
      console.error('Delete for everyone error:', error);
      Alert.alert('Error', 'Failed to delete message for everyone.');
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
    <Layout
      statusBarColor={selectedMessageForMenu ? '#333' : colors.primary}
      paddingBottom={1}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {selectedMessageForMenu ? (
            <View
              style={styles.selectionHeader}
              onLayout={event => {
                const { height } = event.nativeEvent.layout;
                const statusBarHeight =
                  Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
                setHeaderHeight(height + statusBarHeight);
              }}
            >
              <TouchableOpacity
                onPress={closeMessageMenu}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.selectionHeaderText}>Message Selected</Text>
              <View style={styles.selectionActions}>
                <TouchableOpacity
                  onPress={() => {
                    if (!showReactionPicker && selectedMessageForMenu) {
                      const ref =
                        messageRefs.current[selectedMessageForMenu.id];
                      if (ref) {
                        ref.measureInWindow((x, y, width, height) => {
                          setMessagePosition({ x, y, width, height });
                        });
                      }
                    }
                    setShowReactionPicker(prev => !prev);
                  }}
                  style={styles.headerAction}
                >
                  <Icon name="happy-outline" size={24} color="#fff" />
                </TouchableOpacity>
                {selectedMessageForMenu.senderUid === currentUid && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleEdit(selectedMessageForMenu)}
                      style={styles.headerAction}
                    >
                      <Icon name="create-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleDelete(
                          selectedMessageForMenu.id,
                          selectedMessageForMenu.senderUid,
                        )
                      }
                      style={styles.headerAction}
                    >
                      <Icon name="trash-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ) : (
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
              onOptionsPress={!isGroup ? handleOptions : undefined}
            />
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item, index }: any) => {
              const showDateSeparator =
                index === 0 ||
                isDifferentDay(messages[index - 1].timestamp, item.timestamp);

              if (item.deletedGlobally) {
                return (
                  <>
                    {showDateSeparator && (
                      <View style={styles.dateSeparatorContainer}>
                        <View style={styles.dateSeparatorLine} />
                        <Text style={styles.dateSeparatorText}>
                          {getDateLabel(item.timestamp)}
                        </Text>
                        <View style={styles.dateSeparatorLine} />
                      </View>
                    )}
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
                  </>
                );
              }
              return (
                <>
                  {showDateSeparator && (
                    <View style={styles.dateSeparatorContainer}>
                      <View style={styles.dateSeparatorLine} />
                      <Text style={styles.dateSeparatorText}>
                        {getDateLabel(item.timestamp)}
                      </Text>
                      <View style={styles.dateSeparatorLine} />
                    </View>
                  )}
                  <TouchableWithoutFeedback
                    onLongPress={() => handleLongPress(item)}
                  >
                    <View
                      ref={ref => {
                        if (ref) {
                          messageRefs.current[item.id] = ref;
                        } else {
                          delete messageRefs.current[item.id];
                        }
                      }}
                    >
                      <MessageBubble
                        text={item.text}
                        isMe={item.senderUid === currentUid}
                        timestamp={item.timestamp}
                        senderName={
                          isGroup && item.senderUid !== currentUid
                            ? senderNames[item.senderUid] || 'Unknown'
                            : undefined
                        }
                        edited={item.edited}
                        reactions={item.reactions || {}}
                        isSelected={selectedMessageForMenu?.id === item.id}
                        senderNames={senderNames}
                        currentUid={currentUid}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </>
              );
            }}
            style={{ flex: 1, paddingHorizontal: 10 }}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {!isBlocked && typingText ? (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>{typingText}</Text>
            </View>
          ) : null}

          {isBlocked || !canSend ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                flexDirection: 'row',
                gap: 2,
              }}
            >
              <CancelIcon name="block" size={14} color="red" />
              <Text style={{ color: 'red', fontSize: 14, fontStyle: 'italic' }}>
                {isBlocked
                  ? 'You have blocked this user'
                  : 'You are no logner friend with this user'}
              </Text>
            </View>
          ) : (
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                {editingMessageId && (
                  <TouchableOpacity
                    onPress={() => {
                      setEditingMessageId(null);
                      setText('');
                    }}
                    style={[styles.cancelButton]}
                  >
                    <CancelIcon
                      name="cancel"
                      size={32}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={handleInputChange}
                  placeholder={
                    editingMessageId ? 'Edit message...' : 'Type a message...'
                  }
                />

                <TouchableOpacity
                  onPress={sendMessage}
                  style={[
                    styles.sendButton,
                    (!text.trim() || !canSend) && { backgroundColor: '#ddd' },
                  ]}
                  disabled={!text.trim() || !canSend}
                >
                  <Icon
                    name="send"
                    size={22}
                    color={text.trim() && canSend ? '#fff' : '#999'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showReactionPicker && selectedMessageForMenu && (
            <View style={styles.pickerContainer} pointerEvents="box-none">
              <TouchableWithoutFeedback
                onPress={() => {
                  setShowReactionPicker(false);
                  closeMessageMenu();
                }}
              >
                <View style={[styles.pickerOverlay, { top: headerHeight }]} />
              </TouchableWithoutFeedback>
              <View
                style={[
                  styles.reactionPicker,
                  {
                    position: 'absolute',
                    top: messagePosition.y + messagePosition.height,
                    left: messagePosition.x,
                  },
                ]}
              >
                {REACTIONS.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => handleReaction(emoji)}
                    style={styles.reactionButton}
                  >
                    <Text style={styles.reactionEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
                style={{
                  marginBottom: 22,
                  fontSize: 16,
                  fontStyle: 'italic',
                }}
              >
                Are you sure you want to delete this message?
              </Text>
              <TouchableOpacity
                style={{
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
                  paddingHorizontal: 10,
                  marginBottom: 16,
                  borderRadius: 5,
                }}
                onPress={async () => {
                  setShowDeleteModal(false);
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
    width: '100%',
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.primary,
    fontSize: 16,
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
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  closeButton: {
    marginRight: 15,
  },
  selectionHeaderText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 20,
  },
  headerAction: {
    padding: 4,
  },
  reactionButton: {
    padding: 8,
  },
  reactionEmoji: {
    fontSize: 28,
  },
  pickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  pickerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  reactionPicker: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-around',
  },
  dateSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dateSeparatorText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
});

export default ChatScreen;
