import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  fetchUserChats,
  fetchUserGroups,
  getLastMessage,
  getUnreadCount,
  getUnreadCountFast,
  markAsRead,
  currentUser,
  usersRef,
  chatsRef,
  groupMessagesRef,
  chatDocRef,
} from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import { formatLastSeen } from '../../utils/time';

const MessagesScreen = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const currentUid = currentUser()?.uid;

  // Optimistically update conversation locally
  const updateConversationLocally = useCallback(
    (convId: string, updates: any) => {
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === convId ? { ...conv, ...updates } : conv,
        );
        // Re-sort after update
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
        console.log('Setting up real-time listeners for UID:', currentUid);

        // Fetch initial conversations
        const [chats, groups] = await Promise.all([
          fetchUserChats(currentUid),
          fetchUserGroups(currentUid),
        ]);

        const allConv = [...chats, ...groups];

        // Enrich initial data
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
              if (otherUid) {
                const otherDoc = await usersRef().doc(otherUid).get();
                const otherUser = otherDoc.exists ? otherDoc.data() : null;
                title = otherUser?.name || 'Unknown User';
              }
            } else {
              title = conv.name || 'Unknown Group';
            }
          } catch (error) {
            console.error(
              `Enrich error for ${conv.type} ${conv.id}:`,
              error.message,
            );
          }

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
        setLoading(false);

        // Set up real-time listeners for each conversation
        enriched.forEach(conv => {
          const messagesRef =
            conv.type === 'group'
              ? groupMessagesRef(conv.id)
              : chatsRef(conv.id);

          // Listen to last message changes
          const unsubscribe = messagesRef
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot(
              snapshot => {
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
              },
              error => console.error(`Listener error for ${conv.id}:`, error),
            );

          unsubscribers.push(unsubscribe);

          // Listen to unread count changes via chat doc
          const chatDocUnsubscribe = chatDocRef(conv.id).onSnapshot(
            doc => {
              if (doc.exists) {
                const data = doc.data();
                const unreadMap = data?.unreadCount || {};
                const unread = unreadMap[currentUid] || 0;

                updateConversationLocally(conv.id, {
                  unreadCount: unread,
                });
              }
            },
            error =>
              console.error(`Chat doc listener error for ${conv.id}:`, error),
          );

          unsubscribers.push(chatDocUnsubscribe);
        });
      } catch (error) {
        console.error('Setup listeners error:', error);
        setLoading(false);
      }
    };

    setupRealtimeListeners();

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [currentUid, updateConversationLocally]);

  // Refresh on screen focus (for new conversations)
  useFocusEffect(
    useCallback(() => {
      // Don't reload everything, just refresh if needed
      console.log('Screen focused - listeners already active');
    }, []),
  );

  const openConversation = async (conv: any) => {
    try {
      // Optimistically update UI immediately
      updateConversationLocally(conv.id, { unreadCount: 0 });

      // Then mark as read in background
      markAsRead(conv.id, currentUid, conv.type === 'group').catch(error => {
        console.error('Mark as read error:', error);
        // Revert on failure
        const originalUnread = conv.unreadCount;
        updateConversationLocally(conv.id, { unreadCount: originalUnread });
      });

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
    } catch (error) {
      console.error('Open conv error:', error);
      Alert.alert('Error', 'Failed to open conversation');
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
    <View style={globalStyles.container}>
      <Text style={[globalStyles.title, { marginTop: 50 }]}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() => openConversation(item)}
            style={styles.msgItem}
          >
            <View style={styles.msgContent}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgTitle}>{item.title}</Text>
                <Text style={styles.msgTime}>
                  {item.timestamp
                    ? formatLastSeen(item.timestamp)
                    : 'No messages'}
                </Text>
              </View>
              <Text style={styles.msgPreview}>{item.preview}</Text>
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
            No conversations yet. Start chatting!
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  msgItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  msgContent: {
    flex: 1,
  },
  msgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  msgTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  msgTime: {
    fontSize: 12,
    color: '#666',
  },
  msgPreview: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
});

export default MessagesScreen;
