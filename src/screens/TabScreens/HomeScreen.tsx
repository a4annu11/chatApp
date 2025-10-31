import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usersRef, currentUser, signOut } from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import Header from '../../components/Header'; // If using
import { formatLastSeen } from '../../utils/time';
import Layout from '../Layout';

const HomeScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation: any = useNavigation();
  const currentUid = currentUser()?.uid;

  useEffect(() => {
    if (currentUid) {
      const unsubscribe = usersRef()
        .doc(currentUid)
        .onSnapshot(doc => {
          if (doc.exists) {
            setUser({ id: doc.id, ...doc.data() });
          }
          setLoading(false);
        });
      return unsubscribe;
    }
    setLoading(false);
  }, [currentUid]);

  const handleLogout = async () => {
    await signOut();
  };

  const goToUsers = () => {
    navigation.navigate('Users');
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
          title="ChatApp"
          rightIcon="log-out"
          onRightPress={handleLogout}
        />
        <View style={styles.infoContainer}>
          <Text style={globalStyles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Stay connected with friends and groups.
          </Text>

          <View style={styles.userStatus}>
            <Text style={styles.statusText}>👤 {user?.name || 'User'}</Text>
            <Text
              style={[
                styles.statusLabel,
                {
                  color: user?.isOnline ? colors.success : colors.textSecondary,
                },
              ]}
            >
              {user?.isOnline
                ? 'Online'
                : `Last seen ${formatLastSeen(user.lastSeen)}`}
            </Text>
          </View>

          {/* Quick Stats Placeholder - Expand with real data later */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Active Chats</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={goToUsers}>
            <Text style={styles.actionText}>Start New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  userStatus: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
