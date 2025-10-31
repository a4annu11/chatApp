import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createGroup, currentUser } from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import Header from '../../components/Header';
import Layout from '../Layout';

const CreateGroupScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation();
  const user: any = currentUser();

  // if (!user?.isAdmin) {
  //   return (
  //     <Layout statusBarColor={colors.primary}>
  //       <View style={[globalStyles.center, { flex: 1 }]}>
  //         <Text style={{ color: colors.text, fontSize: 16 }}>
  //           🚫 Only admins can create groups.
  //         </Text>
  //       </View>
  //     </Layout>
  //   );
  // }

  const handleCreate = async () => {
    if (!name.trim() || name.length < 3) {
      Alert.alert('Error', 'Group name must be at least 3 characters.');
      return;
    }
    setLoading(true);
    try {
      await createGroup(name.trim(), description.trim(), user.uid);
      Alert.alert('Success', `Group "${name}" created!`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <Layout statusBarColor={colors.primary}>
      <View style={globalStyles.container}>
        <Header title="Create Group" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.label}>Group Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Write something about this group..."
              placeholderTextColor={colors.textSecondary}
              multiline
              value={description}
              onChangeText={setDescription}
            />
            <Pressable
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating...' : 'Create Group'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default CreateGroupScreen;
