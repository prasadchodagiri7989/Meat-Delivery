

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    clearError();
    const success = await login(email, password);

    if (success) {
      Alert.alert('Success', 'Logged in successfully');
      onLoginSuccess?.();
    } else {
      // Error message will be shown from context
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Delivery Boy Login
          </ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to your account</ThemedText>
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: isDark ? '#3A1E1E' : '#FFEBEE' }]}>
            <ThemedText style={{ color: '#D32F2F', fontSize: 14 }}>
              {error}
            </ThemedText>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Email Address</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5',
                  borderColor: isDark ? '#333' : '#DDD',
                },
              ]}
              placeholder="john@example.com"
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    color: isDark ? '#fff' : '#000',
                    backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5',
                    borderColor: isDark ? '#333' : '#DDD',
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                secureTextEntry={!showPassword}
              />
              <ThemedText
                style={styles.togglePassword}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.loginButton, isLoading && styles.buttonDisabled]}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText
                style={styles.buttonText}
                onPress={handleLogin}
              >
                Login
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Don't have an account? Contact admin
          </ThemedText>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  form: {
    marginVertical: 20,
  },
  formGroup: {
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordInputWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  togglePassword: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
