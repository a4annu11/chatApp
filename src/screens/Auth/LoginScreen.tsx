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
  signInWithEmailAndPassword,
  usersRef,
  serverTimestamp,
  currentUser,
} from '../../services/firebase';
import { useNavigation } from '@react-navigation/native';
import Layout from '../Layout';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // For link

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(email, password);
      const { uid }: any = currentUser();
      await usersRef().doc(uid).update({
        isOnline: true,
        lastSeen: serverTimestamp(),
      });
      Alert.alert('Success', 'Logged in!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <View
        style={[
          globalStyles.container,
          {
            paddingHorizontal: 20,
          },
        ]}
      >
        <Text style={globalStyles.title}>Login</Text>
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
          title={loading ? 'Signing in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
          color={colors.primary}
        />
        <Text
          style={globalStyles.link}
          onPress={() => navigation.navigate('Register')}
        >
          Don't have an account? Register
        </Text>
      </View>
    </Layout>
  );
};

export default LoginScreen;
