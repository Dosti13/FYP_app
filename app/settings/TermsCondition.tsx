import React from "react";
import { View, Text, StyleSheet, ScrollView,  } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/common/Button";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsAndConditions: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView style={styles.content}>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Snatch Alert. By using this application, you agree to these terms and conditions.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of the App</Text>
        <Text style={styles.text}>
          You agree to use Snatch Alert responsibly and not misuse or provide false alerts.
        </Text>

        <Text style={styles.sectionTitle}>3. Location Services</Text>
        <Text style={styles.text}>
          This app uses your device’s location to report alerts. You are responsible for allowing or
          denying location permissions.
        </Text>

        <Text style={styles.sectionTitle}>4. Liability</Text>
        <Text style={styles.text}>
          Snatch Alert is a community-based safety app. We are not responsible for any direct or
          indirect consequences of its use.
        </Text>

        <Text style={styles.sectionTitle}>5. Changes</Text>
        <Text style={styles.text}>
          Terms may be updated anytime. Continued use of the app means you accept the changes.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact</Text>
        <Text style={styles.text}>
          If you have questions about these Terms, please contact us via the Help & Support page.
        </Text>
      </ScrollView>
      <View style={styles.header}>
        <Button onPress={() => navigation.goBack()} 
          title="← Back"
          />
          
      
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,

  },
  backButton: { fontSize: 16, color: "#007AFF", marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  content: { padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 5 },
  text: { fontSize: 14, lineHeight: 20, color: "#333" },
});

export default TermsAndConditions;
