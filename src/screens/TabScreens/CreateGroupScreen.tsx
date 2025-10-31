import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
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
  const currentUid = currentUser()?.uid;

  const handleCreate = async () => {
    if (!name.trim() || name.length < 3) {
      Alert.alert('Error', 'Group name must be at least 3 characters');
      return;
    }
    setLoading(true);
    try {
      await createGroup(name.trim(), description.trim(), currentUid);
      Alert.alert('Success', `Group "${name}" created!`, [
        { text: 'OK', onPress: () => navigation.goBack() }, // Back to Groups
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <Layout statusBarColor={colors.primary}>
      <View style={globalStyles.container}>
        <Header title="Create Group" onBack={() => navigation.goBack()} />
        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={{ padding: 20 }}
        >
          <Text style={globalStyles.title}>New Group</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Group Name *"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          <TextInput
            style={[globalStyles.input, { height: 100 }]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Pressable
            style={[
              globalStyles.button,
              { backgroundColor: colors.primary, marginTop: 20 },
            ]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? 'Creating...' : 'Create Group'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
});

export default CreateGroupScreen;
