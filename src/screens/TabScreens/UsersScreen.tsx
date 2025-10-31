import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usersRef, currentUser } from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import Header from '../../components/Header'; // If using
import { formatLastSeen } from '../../utils/time';
import Layout from '../Layout';

const UsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const currentUid = currentUser()?.uid;

  useEffect(() => {
    const unsubscribe = usersRef()
      .where('uid', '!=', currentUid)
      .onSnapshot(snapshot => {
        const userList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
        setFilteredUsers(userList);
        setLoading(false);
      });
    return unsubscribe;
  }, [currentUid]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const startChat = (otherUser: any) => {
    const chatId = [currentUid, otherUser.uid].sort().join('_');
    navigation.navigate('Chat', { chatId, otherUser });
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
    <Layout statusBarColor={colors.primary}>
      <View style={globalStyles.container}>
        <Header title="Users" />
        <TextInput
          style={[globalStyles.input, { margin: 15 }]}
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filteredUsers}
          keyExtractor={(item: any) => item.uid}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              onPress={() => startChat(item)}
              style={styles.userItem}
            >
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>

              <Text style={styles.status}>
                {item.isOnline
                  ? 'Online'
                  : `Last seen ${formatLastSeen(item.lastSeen)}`}
              </Text>
            </TouchableOpacity>
          )}
        />
        {filteredUsers.length === 0 && (
          <Text style={styles.emptyText}>
            No users found. Try a different search.
          </Text>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  status: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 50,
  },
});

export default UsersScreen;
