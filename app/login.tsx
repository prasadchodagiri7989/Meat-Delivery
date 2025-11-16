import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert('Login Failed', error || 'Invalid credentials. Please try again.');
      }
      // If success, auth state will change and root layout will navigate to dashboard
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[
            styles.content,
            { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              🚚
            </ThemedText>
            <ThemedText type="title" style={styles.appName}>
              Meat Delivery
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Delivery Boy Login
            </ThemedText>
          </View>

          {/* Error Message */}
          {error && (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: isDark ? '#3a1a1a' : '#ffebee' },
              ]}
            >
              <ThemedText style={[styles.errorText, { color: '#d32f2f' }]}>
                {error}
              </ThemedText>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email Address</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                  color: isDark ? '#fff' : '#000',
                  borderColor: formErrors.email ? '#d32f2f' : '#ddd',
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {formErrors.email && (
              <ThemedText style={styles.errorText}>{formErrors.email}</ThemedText>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                    color: isDark ? '#fff' : '#000',
                    borderColor: formErrors.password ? '#d32f2f' : '#ddd',
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <ThemedText style={styles.eyeIcon}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {formErrors.password && (
              <ThemedText style={styles.errorText}>{formErrors.password}</ThemedText>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { opacity: isLoading ? 0.6 : 1 },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Login</ThemedText>
            )}
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <ThemedText style={styles.infoTitle}>Test Credentials</ThemedText>
            <ThemedText style={styles.infoText}>Email: deliveryboy@example.com</ThemedText>
            <ThemedText style={styles.infoText}>Password: password123</ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 30,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  infoText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
});
