import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ImageBackground,

} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/common/Button";
import { SafeAreaView } from "react-native-safe-area-context";
const HelpAndSupport: React.FC = () => {
  const navigation = useNavigation();

  const handleEmail = () => {
    Linking.openURL(
      "mailto:snatchalert.support@example.com?subject=Support Request"
    );
  };

  const handlePhone = () => {
    Linking.openURL("tel:+923481311332");
  };
  return (
    <SafeAreaView style={styles.container}>

    
      {/* Scrollable content */}
      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }} >
              <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>How can we help you?</Text>
        <Text style={styles.sectionTitle}>Need Assistance?</Text>
        <Text style={styles.text}>
          If you face any issues or have questions, you can contact our support
          team.
        </Text>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity onPress={handleEmail}>
          <Text style={styles.link}>
            📧 Email: snatchalert.support@example.com
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePhone}>
          <Text style={styles.link}>📞 Phone: +92 348 1311332</Text>
        </TouchableOpacity>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>FAQs</Text>

        <Text style={styles.question}>Q: How does Snatch Alert work?</Text>
        <Text style={styles.answer}>
          A: It uses your location to mark alert spots on the map and notify
          nearby users.
        </Text>

        <Text style={styles.question}>Q: Do I need an internet connection?</Text>
        <Text style={styles.answer}>
          A: Yes, an internet connection is required to report and receive
          alerts.
        </Text>

        <Text style={styles.question}>Q: Is my data secure?</Text>
        <Text style={styles.answer}>
          A: Yes, we take privacy seriously. Your personal data is never shared
          without permission.
        </Text>

        <Text style={styles.question}>
          Q: Can I use the app without enabling location?
        </Text>
        <Text style={styles.answer}>
          A: No, location access is required to report alerts and help keep your
          area safe.
        </Text>

        <Text style={styles.question}>
          Q: Will I receive alerts from other cities?
        </Text>
        <Text style={styles.answer}>
          A: No, alerts are location-based and you’ll only receive them in your
          nearby area.
        </Text>

        <Text style={styles.question}>Q: Is the app free to use?</Text>
        <Text style={styles.answer}>
          A: Yes, Snatch Alert is completely free to use.
        </Text>

        <Text style={styles.question}>Q: How can I report false alerts?</Text>
        <Text style={styles.answer}>
          A: You can long-press an alert marker and select "Report Issue" to
          flag false or outdated alerts.
        </Text>

        <Text style={styles.question}>
          Q: Can I use Snatch Alert offline?
        </Text>
        <Text style={styles.answer}>
          A: You can view saved alerts offline, but new reports and updates need
          an internet connection.
        </Text>
      </ScrollView>
      
          <View style={styles.headerContent}>
          <Button
           onPress={() => navigation.goBack()}
            title="← Back"
         
            />

        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },

  headerContent: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 2,
    
  },

  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#0a0a0aff" },
  headerSubtitle: { fontSize: 14, color: "#bbb", marginTop: 4 },
  content: { padding: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#000000ff",
  },
  text: { fontSize: 14, lineHeight: 20, color: "#000000ff" },
  link: { fontSize: 14, color: "#4ade80", marginBottom: 10 },
  question: { fontSize: 14, fontWeight: "600", marginTop: 10, color: "#000000ff" },
  answer: { fontSize: 14, marginBottom: 10, color: "#000000ff" },
});

export default HelpAndSupport;
