import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database'; // For connection ref (Realtime DB for .info/connected; hybrid with Firestore ok, free)

// Auth
export const onAuthStateChanged = callback =>
  auth().onAuthStateChanged(callback);
export const createUserWithEmailAndPassword = (email, password) =>
  auth().createUserWithEmailAndPassword(email, password);
export const signInWithEmailAndPassword = (email, password) =>
  auth().signInWithEmailAndPassword(email, password);
export const signOut = () => auth().signOut();
export const currentUser = () => auth().currentUser;

// Firestore
export const usersRef = () => firestore().collection('users');
export const chatsRef = chatId =>
  firestore().collection('chats').doc(chatId).collection('messages');
export const serverTimestamp = () => firestore.FieldValue.serverTimestamp();
export const chatDocRef = chatId => firestore().collection('chats').doc(chatId);

// Setup online/offline listener (call once in App.js)
export const setupConnectionListener = uid => {
  const connectedRef = database().ref('.info/connected');
  const userStatusRef = database().ref(`/status/${uid}`);

  connectedRef.on('value', snap => {
    if (snap.val() === true) {
      userStatusRef.set(true).then(() => {
        // Update Firestore isOnline
        usersRef().doc(uid).update({ isOnline: true });
      });
    } else {
      // Offline: Set lastSeen
      usersRef().doc(uid).update({
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    }
  });

  // Cleanup on unmount
  return () => connectedRef.off();
};

// For typing: Update chat doc
export const updateTypingStatus = (chatId, uid, isTyping) => {
  const chatDoc = firestore().collection('chats').doc(chatId);
  if (isTyping) {
    chatDoc.update({
      typingBy: firestore.FieldValue.arrayUnion(uid),
    });
  } else {
    chatDoc.update({
      typingBy: firestore.FieldValue.arrayRemove(uid),
    });
  }
};

// groups

export const groupsRef = () => firestore().collection('groups');
export const groupMessagesRef = groupId =>
  firestore().collection('groups').doc(groupId).collection('messages');
export const joinGroup = (groupId, uid) =>
  groupsRef()
    .doc(groupId)
    .update({
      members: firestore.FieldValue.arrayUnion(uid),
    });
export const leaveGroup = (groupId, uid) =>
  groupsRef()
    .doc(groupId)
    .update({
      members: firestore.FieldValue.arrayRemove(uid),
    });

export const createGroup = async (name, description = '', adminUid) => {
  const groupId = groupsRef().doc().id; // Auto-generate ID
  await groupsRef()
    .doc(groupId)
    .set({
      name,
      description,
      members: [adminUid],
      admin: adminUid,
      createdAt: serverTimestamp(),
    });
  return groupId;
};

// messagesScreen

export const fetchUserChats = uid => {
  // 1:1 chats
  return firestore()
    .collection('chats')
    .where('participants', 'array-contains', uid)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'chat' })),
    );
};

export const fetchUserGroups = uid => {
  return groupsRef()
    .where('members', 'array-contains', uid)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'group' })),
    );
};

export const getLastMessage = (chatId, isGroup = false) => {
  const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
  return ref
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get()
    .then(snapshot => snapshot.docs[0]?.data());
};

export const getUnreadCount = (chatId, uid, isGroup = false) => {
  const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
  return ref
    .where('read', '==', false)
    .where('senderUid', '!=', uid)
    .get()
    .then(snapshot => snapshot.size);
};

// Mark as read (call on open chat)
// export const markAsRead = (chatId, uid, isGroup = false) => {
//   const ref = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
//   return ref
//     .where('read', '==', false)
//     .where('senderUid', '!=', uid)
//     .get()
//     .then(snapshot => {
//       const batch = firestore().batch();
//       snapshot.docs.forEach(doc => {
//         batch.update(doc.ref, { read: true });
//       });
//       return batch.commit();
//     });
// };

// Increment unread count for all participants except sender
export const incrementUnreadCount = async (
  chatId,
  senderUid,
  isGroup,
  participants = [],
) => {
  try {
    const chatDoc = chatDocRef(chatId);
    const snapshot = await chatDoc.get();
    const data = snapshot.data();
    const currentUnread = data?.unreadCount || {};

    // Increment for all participants except sender
    const updates = {};
    participants.forEach(uid => {
      if (uid !== senderUid) {
        updates[`unreadCount.${uid}`] =
          firebase.firestore.FieldValue.increment(1);
      }
    });

    await chatDoc.update(updates);
    console.log('Unread count incremented for', chatId);
  } catch (error) {
    console.error('Increment unread error:', error);
  }
};

// Mark all messages as read for current user
export const markAsRead = async (chatId, userId, isGroup = false) => {
  try {
    const chatDoc = chatDocRef(chatId);

    // Reset unread count to 0
    await chatDoc.update({
      [`unreadCount.${userId}`]: 0,
    });

    // Also mark individual messages as read (optional, for double-check icon)
    const messagesRef = isGroup ? groupMessagesRef(chatId) : chatsRef(chatId);
    const unreadMessages = await messagesRef
      .where('read', '==', false)
      .where('senderUid', '!=', userId)
      .get();

    const batch = firebase.firestore().batch();
    unreadMessages.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    if (!unreadMessages.empty) {
      await batch.commit();
    }

    console.log('Marked as read for', chatId);
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

// Get unread count from chat document (faster than counting messages)
export const getUnreadCountFast = async (chatId, userId) => {
  try {
    const chatDoc = await chatDocRef(chatId).get();
    if (chatDoc.exists) {
      const data = chatDoc.data();
      const unreadMap = data?.unreadCount || {};
      return unreadMap[userId] || 0;
    }
    return 0;
  } catch (error) {
    console.error('Get unread count error:', error);
    return 0;
  }
};

// Initialize chat document with participants
export const initializeChatDoc = async (chatId, participants, isGroup) => {
  try {
    const chatDoc = chatDocRef(chatId);
    const snapshot = await chatDoc.get();

    if (!snapshot.exists) {
      // Initialize with 0 unread for all participants
      const unreadCount = {};
      participants.forEach(uid => {
        unreadCount[uid] = 0;
      });

      await chatDoc.set({
        ...(isGroup ? { members: participants } : { participants }),
        createdAt: serverTimestamp(),
        typingBy: [],
        unreadCount,
      });
    }
  } catch (error) {
    console.error('Initialize chat doc error:', error);
  }
};
