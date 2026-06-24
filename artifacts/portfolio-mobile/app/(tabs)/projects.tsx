import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  CATEGORY_COLORS,
  Category,
  PROJECTS,
  Project,
} from "@/constants/projects";

const ALL_CATS: Category[] = ["AI/ML", "Biomed", "Frontend", "Embedded", "Research"];

function ProjectCard({ project, colors }: { project: Project; colors: ReturnType<typeof useColors> }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      onPress={() => router.push(`/project/${project.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.catBadge, { backgroundColor: CATEGORY_COLORS[project.category] + "20" }]}>
          <Text style={[styles.catText, { color: CATEGORY_COLORS[project.category], fontFamily: "Inter_500Medium" }]}>
            {project.category}
          </Text>
        </View>
        {project.highlight && (
          <View style={[styles.highlightBadge, { borderColor: colors.border }]}>
            <Text style={[styles.highlightText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {project.highlight}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.cardTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
        {project.titleZh}
      </Text>
      <Text style={[styles.cardTitle2, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {project.title}
      </Text>
      <Text style={[styles.cardDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
        {project.description}
      </Text>

      <View style={styles.tagRow}>
        {project.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={[styles.tag, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text style={[styles.tagText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{tag}</Text>
          </View>
        ))}
        {project.tags.length > 3 && (
          <Text style={[styles.tagMore, { color: colors.mutedForeground }]}>+{project.tags.length - 3}</Text>
        )}
      </View>

      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.viewDetail, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>View Details</Text>
        <Feather name="chevron-right" size={14} color={colors.primary} />
      </View>
    </Pressable>
  );
}

export default function ProjectsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = PROJECTS.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.titleZh.includes(search) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !activeCategory || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          Projects
        </Text>
        <Text style={[styles.headerCount, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {filtered.length} of {PROJECTS.length}
        </Text>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="Search projects..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Category filter */}
        <FlatList
          horizontal
          data={[null, ...ALL_CATS] as (Category | null)[]}
          keyExtractor={(item) => item ?? "all"}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingBottom: 4 }}
          renderItem={({ item }) => {
            const isActive = activeCategory === item;
            const catColor = item ? CATEGORY_COLORS[item] : colors.primary;
            return (
              <Pressable
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? catColor + "20" : colors.card,
                    borderColor: isActive ? catColor : colors.border,
                    borderRadius: 20,
                  },
                ]}
                onPress={() => setActiveCategory(isActive ? null : item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isActive ? catColor : colors.mutedForeground,
                      fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {item ?? "All"}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Project list */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ProjectCard project={item} colors={colors} />}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              No projects found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
  },
  headerCount: {
    fontSize: 12,
    marginTop: -6,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: {
    fontSize: 10,
    letterSpacing: 0.4,
  },
  highlightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  highlightText: { fontSize: 10 },
  cardTitle: {
    fontSize: 17,
    marginBottom: 2,
  },
  cardTitle2: {
    fontSize: 12,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: { fontSize: 11 },
  tagMore: { fontSize: 11, alignSelf: "center" },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  viewDetail: { fontSize: 13 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 60,
  },
  emptyText: { fontSize: 14 },
});
