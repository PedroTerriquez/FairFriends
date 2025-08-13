import axios from "axios";
import { useCallback, useState } from "react";
import { Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { useSession } from "@/services/authContext";
import NotificationCard from "@/presentational/NotificationCard";
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";

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

    const showEmptyState = () => {
        return (<EmptyList text={"No notifications yet"}>
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
        </EmptyList>)
    }

    const renderNotifications = () => {
        if (notifications.length === 0) return showEmptyState();

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
            {renderNotifications()}
        </ScrollView>
    );
}