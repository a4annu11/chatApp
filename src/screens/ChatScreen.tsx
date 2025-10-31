import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { globalStyles, colors } from '../utils/styles';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import Icon from 'react-native-vector-icons/Ionicons';
import Layout from './Layout';
import ChatHeader from '../components/ChatHeader';
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

  // Get all participants
  const allParticipants = isGroup ? group.members : [currentUid, otherUser.uid];

  // Fetch sender names for groups
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
          .catch(error => console.error('Fetch sender name error:', error));
      }
    });
  }, [messages, isGroup, senderNames]);

  useEffect(() => {
    if (!chatId || !currentUid) return;

    // Initialize chat document with all participants
    initializeChatDoc(chatId, allParticipants, isGroup);

    // Use groupMessagesRef if group, else chatsRef
    const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
    const unsubscribe = ref.orderBy('timestamp', 'asc').onSnapshot(
      querySnapshot => {
        const msgList: any = [];
        querySnapshot.forEach(doc => {
          msgList.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgList);
        setLoading(false);
      },
      error => {
        console.error('Chat listen error:', error);
        setLoading(false);
      },
    );

    // Mark as read when entering chat
    markAsRead(chatId, currentUid, isGroup)
      .then(() => console.log('Marked read successfully for', chatId))
      .catch(error => {
        console.error('Mark read error:', error.message);
      });

    return unsubscribe;
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
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
      }
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
      if (isTyping) {
        setIsTyping(false);
        updateTypingStatus(chatId, currentUid, false);
      }
    }, 1500);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageText = text.trim();
    setText(''); // Clear input immediately
    setIsTyping(false);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
    updateTypingStatus(chatId, currentUid, false);

    try {
      const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);

      // Send message
      await ref.add({
        text: messageText,
        senderUid: currentUid,
        timestamp: serverTimestamp(),
        read: false,
      });

      // Increment unread count for other participants
      await incrementUnreadCount(chatId, currentUid, isGroup, allParticipants);

      console.log('Message sent and unread count updated');
    } catch (error) {
      console.error('Send message error:', error);
      // Optionally show error to user
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

  const typingText = isOtherTyping
    ? isGroup
      ? 'Someone is typing...'
      : `${otherUser.name} is typing...`
    : null;

  return (
    <Layout statusBarColor={colors.primary}>
      <View style={globalStyles.container}>
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
        />

        <FlatList
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
          style={{ flex: 1, padding: 10 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={
            typingText ? (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>{typingText}</Text>
              </View>
            ) : null
          }
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={handleInputChange}
            placeholder="Type a message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.sendButton}
            disabled={!text.trim()}
          >
            <Icon
              name="send"
              size={24}
              color={text.trim() ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    padding: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    padding: 10,
    justifyContent: 'center',
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 15,
    margin: 10,
    maxWidth: '80%',
  },
  typingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default ChatScreen;
