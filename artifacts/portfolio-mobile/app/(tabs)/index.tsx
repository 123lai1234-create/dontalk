import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { CATEGORY_COLORS, PROJECTS } from "@/constants/projects";

const SKILLS = [
  "Python", "PyTorch", "FastAPI", "React",
  "ProteinMPNN", "AlphaFold2", "NGS", "Cortex-M0",
];

const STATS = [
  { label: "Projects", value: "9+" },
  { label: "Domains", value: "4" },
  { label: "Awards", value: "2" },
];

const FEATURED_IDS = ["gene-ai", "protein-mpnn", "firmware", "stem-cell"];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const featured = PROJECTS.filter((p) => FEATURED_IDS.includes(p.id));

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: topPad + 32 }]}>
        <View style={[styles.heroBadge, { borderColor: colors.primary + "40" }]}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.heroBadgeText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
            BIOMEDICAL AI ENGINEER
          </Text>
        </View>

        <Text style={[styles.heroName, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          JT Lai
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          工程 × 生醫 × AI
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.btnPrimary,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1, borderRadius: colors.radius },
            ]}
            onPress={() => router.push("/(tabs)/projects")}
          >
            <Feather name="grid" size={16} color={colors.primaryForeground} />
            <Text style={[styles.btnPrimaryText, { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }]}>
              View Projects
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.btnSecondary,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1, borderRadius: colors.radius },
            ]}
            onPress={() => Linking.openURL("https://donttalk.replit.app")}
          >
            <Feather name="external-link" size={16} color={colors.mutedForeground} />
            <Text style={[styles.btnSecondaryText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Full Site
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Skills */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Core Skills
        </Text>
        <View style={styles.chipRow}>
          {SKILLS.map((s) => (
            <View key={s} style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.chipText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Featured Projects */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Featured
        </Text>
        {featured.map((p) => (
          <Pressable
            key={p.id}
            style={({ pressed }) => [
              styles.featuredCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.push(`/project/${p.id}` as any)}
          >
            <View style={styles.featuredTop}>
              <View style={[styles.catBadge, { backgroundColor: CATEGORY_COLORS[p.category] + "20" }]}>
                <Text style={[styles.catText, { color: CATEGORY_COLORS[p.category], fontFamily: "Inter_500Medium" }]}>
                  {p.category}
                </Text>
              </View>
              {p.highlight && (
                <Text style={[styles.highlight, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {p.highlight}
                </Text>
              )}
            </View>
            <Text style={[styles.featuredTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
              {p.titleZh}
            </Text>
            <Text style={[styles.featuredSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {p.subtitle}
            </Text>
            <View style={styles.arrowRow}>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroBadgeText: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  heroName: {
    fontSize: 52,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 16,
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 22,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
  },
  btnPrimaryText: {
    fontSize: 14,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderRadius: 10,
  },
  btnSecondaryText: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  featuredCard: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  featuredTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  highlight: {
    fontSize: 11,
  },
  featuredTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featuredSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  arrowRow: {
    alignItems: "flex-end",
    marginTop: 10,
  },
});
