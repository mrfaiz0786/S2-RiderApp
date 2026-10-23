import { sampleNotifications } from "@/features/notifications/data/fixtures";
import { useNotifications } from "@/features/notifications/model";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { Text, TouchableOpacity, View } from "react-native";

export function NotificationsScreen() {
  const { notificationRead, setNotificationRead } = useNotifications();

  return (
    <>
      <ScreenHero
        eyebrow={"RIDER UPDATES"}
        title={"Notifications"}
        subtitle={"See delivery, account and payment updates."}
        icon="bell-outline"
      />
      <View style={styles.rowBetween}>
        <Text style={styles.bodyMuted}>
          {sampleNotifications.filter((n) => n.unread && !notificationRead.includes(n.id)).length}{" "}
          unread
        </Text>
        <Button
          title="Mark all as read"
          secondary
          onPress={() => setNotificationRead(sampleNotifications.map((n) => n.id))}
          disabled={sampleNotifications.every((n) => !n.unread || notificationRead.includes(n.id))}
        />
      </View>
      {sampleNotifications.map((n) => {
        const read = notificationRead.includes(n.id) || !n.unread;
        return (
          <TouchableOpacity
            key={n.id}
            accessibilityRole="button"
            accessibilityLabel={n.title + (read ? ", read" : ", unread")}
            onPress={() => {
              setNotificationRead((prev) => (prev.includes(n.id) ? prev : [...prev, n.id]));
              Alert.alert(n.title, n.body);
            }}
          >
            <Card tone={!read ? "blue" : undefined}>
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.eyebrow}>{read ? "NOTIFICATION" : "NEW UPDATE"}</Text>
                  <Text style={styles.bodyStrong}>{n.title}</Text>
                </View>
                {!read ? <View style={styles.unreadDot} /> : <Tag label="Read" tone="grey" />}
              </View>
              <Text style={styles.bodyMuted}>{n.body}</Text>
              <View style={styles.divider} />
              <View style={styles.rowBetween}>
                <Text style={styles.helper}>{n.time}</Text>
                <Text style={styles.smallBlue}>{read ? "View details" : "Read update ›"}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
      <Card>
        <Text style={styles.cardTitle}>Stay informed</Text>
        <Text style={styles.bodyMuted}>
          These are static sample notifications. Push delivery, notification preferences and live
          account events are not connected.
        </Text>
      </Card>
      <Text style={styles.helper}>
        Notifications in this prototype do not include OTPs or sensitive verification secrets.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 6,
  },
  bodyMuted: {
    fontFamily: theme.typography.family.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  flexOne: { flex: 1 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: C.blue,
    marginBottom: 7,
    marginTop: 2,
  },
  bodyStrong: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
  },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  smallBlue: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 13,
    fontWeight: "700",
    color: C.blue,
  },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
});
