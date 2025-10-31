import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  groupsRef,
  joinGroup,
  leaveGroup,
  currentUser,
} from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import Header from '../../components/Header';
import Layout from '../Layout';

const GroupsScreen = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const currentUid = currentUser()?.uid;

  useEffect(() => {
    const unsubscribe = groupsRef().onSnapshot(snapshot => {
      const groupList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleJoinAndOpen = async (groupId: string, group: any) => {
    try {
      await joinGroup(groupId, currentUid);
      Alert.alert('Joined!', `Welcome to ${group.name}! Opening chat...`);
      openGroupChat(group); // Now navigate after join
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleJoin = async (groupId: string) => {
    try {
      await joinGroup(groupId, currentUid);
      Alert.alert('Success', 'Joined group!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLeave = async (groupId: string) => {
    Alert.alert('Leave Group', "Are you sure? You won't be able to chat.", [
      { text: 'Cancel' },
      {
        text: 'Leave',
        onPress: async () => {
          try {
            await leaveGroup(groupId, currentUid);
            Alert.alert('Success', 'Left group!');
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
          text: 'Join & Open',
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
        <Header
          title="Groups"
          rightIcon="add"
          onRightPress={() => navigation.navigate('CreateGroup')}
        />
        <FlatList
          data={groups}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => {
            const isMember = item.members?.includes(currentUid);
            return (
              <TouchableOpacity
                onPress={() => handleGroupPress(item)}
                style={styles.groupItem}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.groupMembers}>
                    {item.members?.length || 0} members
                  </Text>
                  {item.description && (
                    <Text style={styles.groupDesc}>{item.description}</Text>
                  )}
                </View>
                <View style={styles.actionContainer}>
                  {isMember ? (
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        handleLeave(item.id);
                      }}
                      style={styles.leaveButton}
                    >
                      <Text style={styles.buttonText}>Leave</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        handleJoin(item.id);
                      }}
                      style={styles.joinButton}
                    >
                      <Text style={styles.buttonText}>Join</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
        {groups.length === 0 && (
          <Text style={styles.emptyText}>No groups yet. Create one!</Text>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  groupItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupMembers: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  groupDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionContainer: {
    marginLeft: 10,
  },
  joinButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  leaveButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default GroupsScreen;
