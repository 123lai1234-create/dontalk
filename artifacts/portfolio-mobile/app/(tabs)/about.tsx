import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const EDUCATION = [
  {
    degree: "M.S. Electrical Engineering",
    school: "National Defense Medical Center",
    year: "2024",
    note: "Genetic Algorithm Trading Optimization",
  },
  {
    degree: "B.S. Biomedical Engineering",
    school: "National Defense Medical Center",
    year: "2022",
    note: "Stem Cell Research · 2018 National Innovation Award",
  },
];

const EXPERIENCE = [
  { role: "AI/ML Research Engineer", org: "Macromolecular AI Lab", period: "2024–Present" },
  { role: "Firmware Engineer", org: "MCU Development", period: "2023" },
  { role: "Bioinformatics Intern", org: "Stem Cell Lab, NDMC", period: "2020–2022" },
];

const DOMAINS = [
  { icon: "cpu" as const, label: "Embedded Systems", desc: "Cortex-M0, MCU firmware, RTOS" },
  { icon: "activity" as const, label: "Bioinformatics", desc: "NGS pipelines, protein design" },
  { icon: "code" as const, label: "AI / Machine Learning", desc: "LLM, RAG, ProteinMPNN" },
  { icon: "monitor" as const, label: "Frontend Engineering", desc: "React, Three.js, WebGL" },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <View style={[styles.profileSection, { paddingTop: topPad + 24 }]}>
        <View style={[styles.avatar, { backgroundColor: colors.card, borderColor: colors.primary + "50" }]}>
          <Text style={[styles.avatarText, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>JT</Text>
        </View>
        <Text style={[styles.name, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>JT Lai</Text>
        <Text style={[styles.title, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
          Biomedical AI Engineer
        </Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          工程 × 生醫研究者 × 跨域平台整合者
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.webBtn,
            { borderColor: colors.border, opacity: pressed ? 0.7 : 1, borderRadius: colors.radius },
          ]}
          onPress={() => Linking.openURL("https://donttalk.replit.app/about")}
        >
          <Feather name="external-link" size={14} color={colors.mutedForeground} />
          <Text style={[styles.webBtnText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Full Profile
          </Text>
        </Pressable>
      </View>

      {/* Domains */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Expertise
        </Text>
        <View style={styles.domainGrid}>
          {DOMAINS.map((d) => (
            <View
              key={d.label}
              style={[styles.domainCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <View style={[styles.domainIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={d.icon} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.domainLabel, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
                {d.label}
              </Text>
              <Text style={[styles.domainDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {d.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Education */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Education
        </Text>
        {EDUCATION.map((e) => (
          <View key={e.degree} style={[styles.timelineItem, { borderLeftColor: colors.border }]}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
            <View style={styles.timelineContent}>
              <View style={styles.timelineRow}>
                <Text style={[styles.timelineDegree, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  {e.degree}
                </Text>
                <Text style={[styles.timelineYear, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {e.year}
                </Text>
              </View>
              <Text style={[styles.timelineSchool, { color: colors.primary, fontFamily: "Inter_400Regular" }]}>
                {e.school}
              </Text>
              <Text style={[styles.timelineNote, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {e.note}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Experience */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Experience
        </Text>
        {EXPERIENCE.map((e) => (
          <View
            key={e.role}
            style={[styles.expCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
          >
            <Text style={[styles.expRole, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{e.role}</Text>
            <Text style={[styles.expOrg, { color: colors.primary, fontFamily: "Inter_400Regular" }]}>{e.org}</Text>
            <Text style={[styles.expPeriod, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{e.period}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 28 },
  name: { fontSize: 28, marginBottom: 4 },
  title: { fontSize: 15, marginBottom: 6 },
  tagline: { fontSize: 13, marginBottom: 20, textAlign: "center" },
  webBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
  },
  webBtnText: { fontSize: 13 },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  domainGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  domainCard: {
    width: "47%",
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  domainIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  domainLabel: { fontSize: 13, lineHeight: 17 },
  domainDesc: { fontSize: 11, lineHeight: 15 },
  timelineItem: {
    flexDirection: "row",
    gap: 12,
    paddingLeft: 12,
    marginBottom: 18,
    borderLeftWidth: 1,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: -16,
  },
  timelineContent: { flex: 1 },
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 2,
  },
  timelineDegree: { fontSize: 14, flex: 1 },
  timelineYear: { fontSize: 12 },
  timelineSchool: { fontSize: 12, marginBottom: 2 },
  timelineNote: { fontSize: 11, lineHeight: 15 },
  expCard: {
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 3,
  },
  expRole: { fontSize: 14 },
  expOrg: { fontSize: 12 },
  expPeriod: { fontSize: 11 },
});
