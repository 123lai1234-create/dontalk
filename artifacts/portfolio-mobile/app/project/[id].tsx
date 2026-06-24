import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const project = PROJECTS.find((p) => p.id === id);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!project) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Project not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[project.category];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={18} color={colors.primary} />
          <Text style={[styles.backBtnText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>Back</Text>
        </Pressable>
      </View>

      {/* Hero section */}
      <View style={[styles.hero, { borderBottomColor: colors.border }]}>
        <View style={[styles.catBadge, { backgroundColor: catColor + "20" }]}>
          <Text style={[styles.catText, { color: catColor, fontFamily: "Inter_600SemiBold" }]}>
            {project.category}
          </Text>
        </View>

        <Text style={[styles.titleZh, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          {project.titleZh}
        </Text>
        <Text style={[styles.titleEn, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {project.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.primary, fontFamily: "Inter_400Regular" }]}>
          {project.subtitle}
        </Text>

        {project.highlight && (
          <View style={[styles.highlightBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="award" size={12} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>
              {project.highlight}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
          OVERVIEW
        </Text>
        <Text style={[styles.description, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}>
          {project.description}
        </Text>
      </View>

      {/* Tags */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
          TECH STACK
        </Text>
        <View style={styles.tagGrid}>
          {project.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius - 4 }]}
            >
              <Text style={[styles.tagText, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={[styles.ctaSection, { borderTopColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => Linking.openURL(`https://donttalk.replit.app${project.webPath}`)}
        >
          <Feather name="external-link" size={16} color={colors.primaryForeground} />
          <Text style={[styles.ctaBtnText, { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }]}>
            View Full Project
          </Text>
        </Pressable>
      </View>

      <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: { fontSize: 16 },
  backLink: { fontSize: 14 },

  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  backBtnText: { fontSize: 14 },

  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    gap: 8,
  },
  catBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  catText: { fontSize: 11, letterSpacing: 0.5 },
  titleZh: { fontSize: 28, lineHeight: 34 },
  titleEn: { fontSize: 14 },
  subtitle: { fontSize: 13, lineHeight: 18 },
  highlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  highlightText: { fontSize: 12 },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  tagText: { fontSize: 13 },

  ctaSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  ctaBtnText: { fontSize: 15 },
});
