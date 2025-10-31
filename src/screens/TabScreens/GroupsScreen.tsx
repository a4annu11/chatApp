import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  groupsRef,
  joinGroup,
  leaveGroup,
  deleteGroup,
  currentUser,
  usersRef,
} from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import Header from '../../components/Header';
import Layout from '../Layout';

const GroupsScreen = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const user: any = currentUser();
  const currentUid = user?.uid;
  const uid = currentUser()?.uid;
  const [checkAdmin, setCheckAdmin] = useState<any>({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (uid) {
      const unsubscribe = usersRef()
        .doc(uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setIsAdmin(userData?.isAdmin || false);
            setLoading(false);
          }
        });
      return unsubscribe;
    }
  }, [uid]);

  console.log('USER', user);

  useEffect(() => {
    const unsubscribe = groupsRef().onSnapshot(snapshot => {
      const groupList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupList);
      setFiltered(groupList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const f = groups.filter(g =>
      g.name?.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(f);
  }, [search, groups]);

  const handleJoinAndOpen = async (groupId: string, group: any) => {
    try {
      await joinGroup(groupId, currentUid);
      Alert.alert('Joined!', `Welcome to ${group.name}!`);
      openGroupChat(group);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLeave = async (groupId: string) => {
    Alert.alert('Leave Group', 'Are you sure you want to leave?', [
      { text: 'Cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          try {
            await leaveGroup(groupId, currentUid);
            Alert.alert('Left Group', 'You have left the group.');
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const handleDelete = async (
    groupId: string,
    name: string,
    createdBy: string,
  ) => {
    if (createdBy !== currentUid && !isAdmin) {
      Alert.alert(
        'Unauthorized',
        'Only the group creator or an admin can delete this group.',
      );
      return;
    }

    Alert.alert('Delete Group', `Delete "${name}" permanently?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGroup(groupId, currentUid);
            Alert.alert('Deleted', `${name} has been deleted.`);
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const openGroupChat = (group: any) => {
    navigation.navigate('Chat', { chatId: group.id, group });
  };

  const handleGroupPress = (group: any) => {
    const isMember = group.members?.includes(currentUid);
    if (isMember) {
      openGroupChat(group);
    } else {
      Alert.alert('Join Group?', `Join "${group.name}" to start chatting?`, [
        { text: 'Cancel' },
        {
          text: 'Join',
          onPress: () => handleJoinAndOpen(group.id, group),
        },
      ]);
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
    <Layout statusBarColor={colors.primary}>
      <View style={globalStyles.container}>
        {/* Header */}
        <Header
          title="Groups"
          // rightIcon={isAdmin ? 'plus' : undefined}
          onRightPress={
            isAdmin ? () => navigation.navigate('CreateGroup') : undefined
          }
        />

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search groups..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Group List */}
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => {
            const isMember = item.members?.includes(currentUid);
            const canDelete = item.createdBy === currentUid || isAdmin;

            return (
              <TouchableOpacity
                onPress={() => handleGroupPress(item)}
                onLongPress={() =>
                  canDelete && handleDelete(item.id, item.name, item.createdBy)
                }
                style={styles.groupCard}
                activeOpacity={0.8}
              >
                <View style={styles.iconWrapper}>
                  <Icon name="account-group" size={28} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.groupDesc} numberOfLines={1}>
                    {item.description || 'No description'}
                  </Text>
                  <Text style={styles.groupMembers}>
                    👥 {item.members?.length || 0} members
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation();
                    isMember
                      ? handleLeave(item.id)
                      : handleJoinAndOpen(item.id, item);
                  }}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isMember ? colors.error : colors.success,
                    },
                  ]}
                >
                  <Text style={styles.actionText}>
                    {isMember ? 'Leave' : 'Join'}
                  </Text>
                </TouchableOpacity>

                {canDelete && (
                  <TouchableOpacity
                    onPress={e => {
                      e.stopPropagation();
                      handleDelete(item.id, item.name, item.createdBy);
                    }}
                    style={styles.deleteBtn}
                  >
                    <Icon name="delete" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              💬 No groups found. {isAdmin ? 'Create one!' : ''}
            </Text>
          }
        />

        {/* Floating Create FAB */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Icon name="plus" size={26} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 8, color: colors.text },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  groupName: { fontSize: 16, fontWeight: '600', color: colors.text },
  groupDesc: { fontSize: 13, color: colors.textSecondary },
  groupMembers: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  deleteBtn: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 6,
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
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
    elevation: 5,
  },
});

export default GroupsScreen;
