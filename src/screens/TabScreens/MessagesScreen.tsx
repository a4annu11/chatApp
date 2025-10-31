// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   TextInput,
//   RefreshControl,
// } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import {
//   fetchUserChats,
//   fetchUserGroups,
//   getLastMessage,
//   getUnreadCount,
//   markAsRead,
//   currentUser,
//   usersRef,
//   chatsRef,
//   groupMessagesRef,
//   chatDocRef,
// } from '../../services/firebase';
// import { globalStyles, colors } from '../../utils/styles';
// import { formatLastSeen } from '../../utils/time';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Layout from '../Layout';

// const MessagesScreen = () => {
//   const [conversations, setConversations] = useState<any[]>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [search, setSearch] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigation: any = useNavigation();
//   const currentUid = currentUser()?.uid;

//   const updateConversationLocally = useCallback(
//     (convId: string, updates: any) => {
//       setConversations(prev => {
//         const updated = prev.map(conv =>
//           conv.id === convId ? { ...conv, ...updates } : conv,
//         );
//         return updated.sort((a, b) => {
//           const aTime = a.timestamp ? a.timestamp.toMillis() : -Infinity;
//           const bTime = b.timestamp ? b.timestamp.toMillis() : -Infinity;
//           return bTime - aTime;
//         });
//       });
//     },
//     [],
//   );

//   const loadConversations = async () => {
//     if (!currentUid) return;
//     setLoading(true);
//     try {
//       const [chats, groups] = await Promise.all([
//         fetchUserChats(currentUid),
//         fetchUserGroups(currentUid),
//       ]);
//       const allConv = [...chats, ...groups];

//       const enriched = await Promise.all(
//         allConv.map(async conv => {
//           let lastMsg = null;
//           let unread = 0;
//           let title = conv.name || 'Unknown';

//           try {
//             lastMsg = await getLastMessage(conv.id, conv.type === 'group');
//             unread = await getUnreadCount(
//               conv.id,
//               currentUid,
//               conv.type === 'group',
//             );
//             if (conv.type === 'chat') {
//               const otherUid = conv.participants.find(
//                 (p: string) => p !== currentUid,
//               );
//               const otherDoc = await usersRef().doc(otherUid).get();
//               const otherUser = otherDoc.exists ? otherDoc.data() : null;
//               title = otherUser?.name || 'Unknown';
//             }
//           } catch {}

//           return {
//             ...conv,
//             title,
//             preview: lastMsg?.text
//               ? `${lastMsg.text.substring(0, 30)}${
//                   lastMsg.text.length > 30 ? '...' : ''
//                 }`
//               : 'No messages yet',
//             timestamp: lastMsg?.timestamp || null,
//             unreadCount: unread,
//           };
//         }),
//       );

//       enriched.sort((a, b) => {
//         const aTime = a.timestamp ? a.timestamp.toMillis() : -Infinity;
//         const bTime = b.timestamp ? b.timestamp.toMillis() : -Infinity;
//         return bTime - aTime;
//       });

//       setConversations(enriched);
//       setFiltered(enriched);
//     } catch (error) {
//       console.error('Load conv error:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadConversations();
//   }, [currentUid]);

//   useEffect(() => {
//     const f = conversations.filter(conv =>
//       conv.title.toLowerCase().includes(search.toLowerCase()),
//     );
//     setFiltered(f);
//   }, [search, conversations]);

//   const openConversation = async (conv: any) => {
//     try {
//       updateConversationLocally(conv.id, { unreadCount: 0 });
//       markAsRead(conv.id, currentUid, conv.type === 'group').catch(
//         console.error,
//       );
//       if (conv.type === 'chat') {
//         const otherUid = conv.participants.find(
//           (p: string) => p !== currentUid,
//         );
//         const otherDoc = await usersRef().doc(otherUid).get();
//         const otherUser = otherDoc.exists
//           ? otherDoc.data()
//           : { name: 'Unknown', uid: otherUid };
//         navigation.navigate('Chat', { chatId: conv.id, otherUser });
//       } else {
//         navigation.navigate('Chat', { chatId: conv.id, group: conv });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to open conversation');
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadConversations();
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

//   return (
//     <Layout>
//       <View
//         style={[globalStyles.container, { backgroundColor: colors.background }]}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Messages</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('Users')}>
//             <Icon name="account-plus" size={24} color={colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Search */}
//         <View style={styles.searchBox}>
//           <Icon name="magnify" size={20} color={colors.textSecondary} />
//           <TextInput
//             placeholder="Search conversations..."
//             placeholderTextColor={colors.textSecondary}
//             value={search}
//             onChangeText={setSearch}
//             style={styles.searchInput}
//           />
//         </View>

//         {/* Chat List */}
//         <FlatList
//           data={filtered}
//           keyExtractor={(item: any) => item.id}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           renderItem={({ item }: any) => (
//             <TouchableOpacity
//               style={styles.chatItem}
//               onPress={() => openConversation(item)}
//             >
//               <View style={styles.avatarPlaceholder}>
//                 <Icon
//                   name={item.type === 'group' ? 'account-group' : 'account'}
//                   size={28}
//                   color="#fff"
//                 />
//               </View>
//               <View style={styles.chatDetails}>
//                 <View style={styles.chatHeader}>
//                   <Text style={styles.chatName}>{item.title}</Text>
//                   <Text style={styles.chatTime}>
//                     {item.timestamp ? formatLastSeen(item.timestamp) : ''}
//                   </Text>
//                 </View>
//                 <View style={styles.chatRow}>
//                   <Text
//                     numberOfLines={1}
//                     style={[
//                       styles.chatPreview,
//                       item.unreadCount > 0 && { color: colors.text },
//                     ]}
//                   >
//                     {item.preview}
//                   </Text>
//                   {item.unreadCount > 0 && (
//                     <View style={styles.unreadBadge}>
//                       <Text style={styles.unreadText}>
//                         {item.unreadCount > 99 ? '99+' : item.unreadCount}
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             </TouchableOpacity>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               💬 No conversations yet. Start chatting!
//             </Text>
//           }
//         />

//         {/* Floating Action Button */}
//         <TouchableOpacity
//           style={styles.fab}
//           onPress={() => navigation.navigate('Users')}
//           activeOpacity={0.8}
//         >
//           <Icon name="message-plus" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginBottom: 10,
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     height: 40,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     color: colors.text,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomColor: '#e5e5e5',
//     borderBottomWidth: 1,
//     alignItems: 'center',
//   },
//   avatarPlaceholder: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   chatDetails: { flex: 1 },
//   chatHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 3,
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   chatTime: {
//     fontSize: 12,
//     color: colors.textSecondary,
//   },
//   chatRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   chatPreview: { flex: 1, color: colors.textSecondary, fontSize: 14 },
//   unreadBadge: {
//     backgroundColor: colors.primary,
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 6,
//   },
//   unreadText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 80,
//     fontSize: 16,
//     color: colors.textSecondary,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 25,
//     right: 25,
//     backgroundColor: colors.primary,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
// });

// export default MessagesScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  fetchUserChats,
  fetchUserGroups,
  getLastMessage,
  getUnreadCount,
  markAsRead,
  currentUser,
  usersRef,
  chatsRef,
  groupMessagesRef,
  chatDocRef,
} from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import { formatLastSeen } from '../../utils/time';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Layout from '../Layout';

const MessagesScreen = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const currentUid = currentUser()?.uid;

  const updateConversationLocally = useCallback(
    (convId: string, updates: any) => {
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === convId ? { ...conv, ...updates } : conv,
        );
        return updated.sort((a, b) => {
          const aTime = a.timestamp ? a.timestamp.toMillis() : -Infinity;
          const bTime = b.timestamp ? b.timestamp.toMillis() : -Infinity;
          return bTime - aTime;
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!currentUid) return;
    const unsubscribers: (() => void)[] = [];

    const setupRealtimeListeners = async () => {
      try {
        const [chats, groups] = await Promise.all([
          fetchUserChats(currentUid),
          fetchUserGroups(currentUid),
        ]);

        const allConv = [...chats, ...groups];

        const enrichedPromises = allConv.map(async conv => {
          let lastMsg = null;
          let unread = 0;
          let title = conv.name || 'Unknown';
          try {
            lastMsg = await getLastMessage(conv.id, conv.type === 'group');
            unread = await getUnreadCount(
              conv.id,
              currentUid,
              conv.type === 'group',
            );
            if (conv.type === 'chat') {
              const otherUid = conv.participants.find(
                (p: string) => p !== currentUid,
              );
              const otherDoc = await usersRef().doc(otherUid).get();
              const otherUser = otherDoc.exists ? otherDoc.data() : null;
              title = otherUser?.name || 'Unknown User';
            }
          } catch {}
          return {
            ...conv,
            title,
            preview: lastMsg?.text
              ? `${lastMsg.text.substring(0, 30)}${
                  lastMsg.text.length > 30 ? '...' : ''
                }`
              : 'No messages yet',
            timestamp: lastMsg?.timestamp || null,
            unreadCount: unread,
          };
        });

        const enriched = await Promise.all(enrichedPromises);
        enriched.sort((a, b) => {
          const aTime = a.timestamp ? a.timestamp.toMillis() : -Infinity;
          const bTime = b.timestamp ? b.timestamp.toMillis() : -Infinity;
          return bTime - aTime;
        });

        setConversations(enriched);
        setFiltered(enriched);
        setLoading(false);

        // setup live listeners
        enriched.forEach(conv => {
          const messagesRef =
            conv.type === 'group'
              ? groupMessagesRef(conv.id)
              : chatsRef(conv.id);

          const unsubMsg = messagesRef
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot(snapshot => {
              if (!snapshot.empty) {
                const lastMsg = snapshot.docs[0].data();
                const preview = lastMsg?.text
                  ? `${lastMsg.text.substring(0, 30)}${
                      lastMsg.text.length > 30 ? '...' : ''
                    }`
                  : 'No messages yet';
                updateConversationLocally(conv.id, {
                  preview,
                  timestamp: lastMsg?.timestamp || null,
                });
              }
            });

          const unsubChat = chatDocRef(conv.id).onSnapshot(doc => {
            if (doc.exists) {
              const data = doc.data();
              const unread = data?.unreadCount?.[currentUid] || 0;
              updateConversationLocally(conv.id, { unreadCount: unread });
            }
          });

          unsubscribers.push(unsubMsg, unsubChat);
        });
      } catch (e) {
        setLoading(false);
      }
    };

    setupRealtimeListeners();
    return () => unsubscribers.forEach(unsub => unsub());
  }, [currentUid, updateConversationLocally]);

  useEffect(() => {
    const f = conversations.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
  }, [search, conversations]);

  const openConversation = async (conv: any) => {
    try {
      updateConversationLocally(conv.id, { unreadCount: 0 });
      markAsRead(conv.id, currentUid, conv.type === 'group').catch(() => {});
      if (conv.type === 'chat') {
        const otherUid = conv.participants.find(
          (p: string) => p !== currentUid,
        );
        const otherDoc = await usersRef().doc(otherUid).get();
        const otherUser = otherDoc.exists
          ? otherDoc.data()
          : { name: 'Unknown', uid: otherUid };
        navigation.navigate('Chat', { chatId: conv.id, otherUser });
      } else {
        navigation.navigate('Chat', { chatId: conv.id, group: conv });
      }
    } catch {
      // ignore
    }
  };

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
    <Layout>
      <View
        style={[globalStyles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Users')}>
            <Icon name="account-plus" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Conversations */}
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              onPress={() => openConversation(item)}
              style={styles.chatCard}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrap}>
                <Icon
                  name={item.type === 'group' ? 'account-group' : 'account'}
                  size={26}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.chatTop}>
                  <Text style={styles.chatName}>{item.title}</Text>
                  <Text style={styles.chatTime}>
                    {item.timestamp ? formatLastSeen(item.timestamp) : ''}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.chatPreview,
                    {
                      color:
                        item.unreadCount > 0 ? 'black' : colors.textSecondary,
                      fontWeight: item.unreadCount > 0 ? 'bold' : 'normal',
                      fontStyle: item.unreadCount > 0 ? 'italic' : 'normal',
                    },
                  ]}
                >
                  {item.preview}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              💬 No conversations yet. Start chatting!
            </Text>
          }
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Users')}
        >
          <Icon name="message-plus" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 8, color: colors.text },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrap: {
    backgroundColor: colors.primary,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatName: { fontSize: 16, fontWeight: '600', color: colors.text },
  chatTime: { fontSize: 12, color: colors.textSecondary },
  chatPreview: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});

export default MessagesScreen;
