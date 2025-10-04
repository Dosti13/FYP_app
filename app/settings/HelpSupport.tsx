import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/common/Button";

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
  console.log("help");
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with image background */}
      <ImageBackground
        source={{ uri: "https://i.ibb.co/6b4v3N9/header-bg.png" }} // replace with your asset
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <Button
           onPress={() => navigation.goBack()}
            title="← Back"
            style={styles.backButton} 
            />

          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>How can we help you?</Text>
        </View>
      </ImageBackground>

      {/* Scrollable content */}
      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }} >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  headerImage: {
    width: "100%",
    height: 160,
    justifyContent: "flex-end",
  },
  headerContent: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
  },
  backButton: { fontSize: 16, color: "#4ade80", marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#bbb", marginTop: 4 },
  content: { padding: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#fff",
  },
  text: { fontSize: 14, lineHeight: 20, color: "#bbb" },
  link: { fontSize: 14, color: "#4ade80", marginBottom: 10 },
  question: { fontSize: 14, fontWeight: "600", marginTop: 10, color: "#fff" },
  answer: { fontSize: 14, marginBottom: 10, color: "#bbb" },
});

export default HelpAndSupport;
