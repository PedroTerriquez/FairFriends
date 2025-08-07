import axios from "axios";
import { useCallback, useState } from "react";
import { Text, ScrollView, RefreshControl } from "react-native";
import { useSession } from "@/services/authContext";
import NotificationCard from "@/presentational/NotificationCard";
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { useFocusEffect } from "expo-router";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { session } = useSession();

    const fetchNotifications = async () => {
        axios.get(`${process.env.EXPO_PUBLIC_API}/notifications`, session)
            .then((response) => {
                setNotifications(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    const acceptNotification = (id) => {
        axios.patch(`${process.env.EXPO_PUBLIC_API}/notifications/${id}`, { status: 'accepted' }, session)
            .then((response) => {
                if (response.status === 200) { updateNotificationStatus(id, 'accepted') }
            })
    }

    const rejectNotification = (id) => {
        axios.patch(`${process.env.EXPO_PUBLIC_API}/notifications/${id}`, { status: 'rejected' }, session)
            .then((response) => { if (response.status === 200) { updateNotificationStatus(id, 'rejected') } })
    }

    const updateNotificationStatus = (id, status) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, status }
                    : notification
            )
        );
    }

    const renderNotifications = () => {
        if (notifications.length == 0) return EmptyList("No notifications")

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
                message={notification.message}
                creatorName={notification.sender_name}
                acceptNotification={acceptNotification}
                rejectNotification={rejectNotification}
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

    return (
        <ScrollView
            contentContainerStyle={[baseStyles.viewContainerFull]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={[baseStyles.title24, baseStyles.textCenter, { marginTop: 10 }]}>Notifications</Text>
            {renderNotifications()}
        </ScrollView>
    );
}