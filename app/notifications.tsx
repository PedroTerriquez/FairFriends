import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { useSession } from "@/services/authContext";
import NotificationCard from "@/presentational/NotificationCard";
import baseStyles from "@/presentational/BaseStyles";

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const { session } = useSession();

    const fetchNotifications = async () => {
        axios.get(`${process.env.EXPO_PUBLIC_API}/notifications`, session)
            .then((response) => {
                console.log(response)
                setNotifications(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    const acceptNotification = (id) => {
        axios.patch(`${process.env.EXPO_PUBLIC_API}/notifications/${id}`, { status: 'accepted' }, session)
            .then((response) => {
                console.log(response)
            })
    }

    const rejectNotification = (id) => {
        axios.patch(`${process.env.EXPO_PUBLIC_API}/notifications/${id}`, { status: 'rejected' }, session)
            .then((response) => {
                console.log(response)
            })
    }

    const renderNotifications = () => {
        if (notifications.length == 0) return

        return notifications.map(notification => (
            <NotificationCard
                id={notification.id}
                key={notification.id}
                creator={notification.sender_id}
                nId={notification.notifiable_id}
                nType={notification.notifiable_type}
                eId={notification.element_id}
                eType={notification.element_type}
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

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <View style={baseStyles.viewContainer}>
            <ScrollView contentContainerStyle={[baseStyles.viewContainer]} >
                {notifications.length > 0 ? renderNotifications() : <Text>No notifications</Text>}
            </ScrollView>
        </View>
    );
}