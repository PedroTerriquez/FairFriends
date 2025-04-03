import axios from "axios";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { useSession } from "@/services/authContext";
import NotificationCard from "@/presentational/NotificationCard";

export default function Notification() {
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

    const renderNotifications = () => {
        if (notifications.length == 0) return

        return notifications.map(notificaiton => (
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
            />
        ))
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderNotifications()}
    </View>
    );
}