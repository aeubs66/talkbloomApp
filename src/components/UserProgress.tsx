import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/userStore';
import { colors } from '../constants/colors';

interface UserProgressProps {
  activeCourse?: {
    id: number;
    title: string;
    imageSrc: string;
  };
  hearts?: number;
  points?: number;
  hasActiveSubscription?: boolean;
}

export const UserProgress: React.FC<UserProgressProps> = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}) => {
  const { userProgress } = useUserStore();
  
  const displayHearts = hearts ?? userProgress?.hearts ?? 0;
  const displayPoints = points ?? userProgress?.points ?? 0;
  const displayCourse = activeCourse ?? userProgress?.activeCourse;
  const displaySubscription = hasActiveSubscription ?? userProgress?.hasActiveSubscription ?? false;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Course Info */}
        {displayCourse && (
          <View style={styles.courseSection}>
            <View style={styles.courseIcon}>
              <Text style={styles.courseEmoji}>🇺🇸</Text>
            </View>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {displayCourse.title}
            </Text>
          </View>
        )}
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          {/* Hearts */}
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons 
                name="heart" 
                size={20} 
                color={displayHearts > 0 ? colors.error.main : colors.text.secondary} 
              />
            </View>
            <Text style={styles.statValue}>{displayHearts}</Text>
          </View>
          
          {/* Points */}
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons 
                name="diamond" 
                size={20} 
                color={colors.warning.main} 
              />
            </View>
            <Text style={styles.statValue}>{displayPoints}</Text>
          </View>
          
          {/* Subscription Status */}
          {displaySubscription && (
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons 
                  name="star" 
                  size={20} 
                  color={colors.warning.main} 
                />
              </View>
              <Text style={styles.statLabel}>PRO</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.shadow.default,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 16,
  },
  courseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseEmoji: {
    fontSize: 18,
  },
  courseTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    justifyContent: 'center',
  },
  statIconContainer: {
    marginRight: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary.main,
  },
});