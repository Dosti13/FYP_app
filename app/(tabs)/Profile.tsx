// app/(tabs)/account.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, textStyles } from "../../constants/theme"; // adjust path

export default function Account() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile & settings</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color={colors.mutedText} />
        </View>
        <Text style={styles.name}>(Name)</Text>
        <Text style={styles.email}>(Email address)</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addProfileBtn}>
          <Text style={styles.addProfileText}>add profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout?</Text>
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={22} color={colors.text} />
          <Text style={styles.menuText}>Help & support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={22} color={colors.text} />
          <Text style={styles.menuText}>Terms & conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  header: {
    ...textStyles.subHeading,
    textAlign: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
  },
  email: {
    ...textStyles.muted,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    gap: 15,
  },
  addProfileBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  addProfileText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  logoutText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  menu: {
    marginTop: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: colors.text,
  },
});
