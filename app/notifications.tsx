import { getNotifications, patchNotification } from "@/services/api";
import { useCallback, useState } from "react";
import { Text, ScrollView, RefreshControl, Pressable } from "react-native";
import NotificationCard from "@/presentational/NotificationCard";
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import Spinner from "@/presentational/Spinner";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        getNotifications()
            .then((response) => {
                setNotifications(response.data)
            })
            .catch((error) => {
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const updateStatus = (id, status) => {
        patchNotification(id, status)
            .then((response) => {
                if (response.status === 200) {
                    setNotifications(prev =>
                        prev.map(notification =>
                            notification.id === id ? { ...notification, status } : notification
                        )
                    );
                }
            })
    }

    const emptyList =
        <EmptyList text={"No notifications yet"}>
            <>
                <Text style={baseStyles.label17}>Start by adding your first {''}
                    <Pressable onPress={() => { router.push("/addContact") }}>
                        <Text style={baseStyles.link}>friend</Text>
                    </Pressable>
                </Text>
                <Text style={baseStyles.label17}>or new {''}
                    <Pressable onPress={() => { router.push("/formBalance") }}>
                        <Text style={baseStyles.link}>balance</Text>
                    </Pressable>
                </Text>
            </>
        </EmptyList>

    const renderNotifications = () => {
        if (notifications.length === 0) return emptyList;

        return notifications.map(notification => (
            <NotificationCard
                id={notification.id}
                key={notification.id}
                notifiableId={notification.notifiable_id}
                notifiableType={notification.notifiable_type}
                paymentableId={notification.element_id}
                paymentableType={notification.element_type}
                date={notification.updated_at}
                amount={notification.amount}
                status={notification.status}
                creatorName={notification.sender_name}
                updateStatus={updateStatus}
            />
        ))
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications().finally(() => setRefreshing(false));
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    if (loading) return <Spinner />;

    return (
        <ScrollView
            contentContainerStyle={[baseStyles.viewContainerFull]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {renderNotifications()}
        </ScrollView>
    );
}