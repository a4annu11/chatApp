import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { globalStyles, colors } from '../../utils/styles';
import {
  createUserWithEmailAndPassword,
  usersRef,
  serverTimestamp,
  currentUser,
} from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';
import Layout from '../Layout';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(email, password);
      // Save user profile to Firestore
      await usersRef().doc(user.uid).set({
        name,
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        isOnline: true,
      });
      Alert.alert('Success', 'Account created! Logging in...');
      // Navigation handled by auth listener in App.js
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <View style={[globalStyles.container, { paddingHorizontal: 20 }]}>
        <Text style={globalStyles.title}>Register</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title={loading ? 'Creating...' : 'Register'}
          onPress={handleRegister}
          disabled={loading}
          color={colors.primary}
        />
        <Text
          style={globalStyles.link}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account? Login
        </Text>
      </View>
    </Layout>
  );
};

export default RegisterScreen;
