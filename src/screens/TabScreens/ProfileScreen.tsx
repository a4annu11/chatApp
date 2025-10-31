import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import {
  usersRef,
  currentUser,
  serverTimestamp,
} from '../../services/firebase';
import { globalStyles, colors } from '../../utils/styles';
import { signOut } from '../../services/firebase'; // Assume added to firebase.js
import Layout from '../Layout';

const ProfileScreen = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const uid: any = currentUser()?.uid;

  useEffect(() => {
    if (uid) {
      const unsubscribe = usersRef()
        .doc(uid)
        .onSnapshot(doc => {
          if (doc.exists) setUser(doc.data());
        });
      return unsubscribe;
    }
  }, [uid]);

  const saveProfile = async () => {
    if (!user.name) return Alert.alert('Error', 'Name required');
    await usersRef().doc(uid).update({
      name: user.name,
      lastSeen: serverTimestamp(),
    });
    setEditing(false);
    Alert.alert('Success', 'Profile updated!');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Layout>
      <View style={[globalStyles.container, { paddingHorizontal: 20 }]}>
        <Text style={globalStyles.title}>Profile</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Name"
          value={user.name}
          onChangeText={text => setUser({ ...user, name: text })}
          editable={editing}
        />
        <TextInput
          style={[
            globalStyles.input,
            { backgroundColor: colors.textSecondary },
          ]}
          value={user.email}
          editable={false}
        />
        {editing ? (
          <Button title="Save" onPress={saveProfile} color={colors.primary} />
        ) : (
          <Button
            title="Edit"
            onPress={() => setEditing(true)}
            color={colors.secondary}
          />
        )}
        <Button title="Logout" onPress={handleLogout} color={colors.error} />
      </View>
    </Layout>
  );
};

export default ProfileScreen;
