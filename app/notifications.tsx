import { getNotifications, patchNotification } from "@/services/api";
import { useCallback, useState } from "react";
import { Text, View, ScrollView, RefreshControl, Pressable } from "react-native";
import NotificationCard from "@/presentational/NotificationCard";
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import Spinner from "@/presentational/Spinner";
import SegmentedControl from "@/presentational/SegmentedControl";
import { spacing } from '@/theme';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('payment');

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

    const renderNotifications = (type) => {
        const filteredNotifications = notifications
            .filter(notification => notification.notifiable_type === type);

        if (filteredNotifications.length === 0) return emptyList;

        return filteredNotifications.map(notification => (
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
                message={notification.message}
            />
        ))
    }

    const countNotificationsByType = (type) => {
        return notifications.filter(notification => notification.notifiable_type === type).length;
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

    const paymentCount = countNotificationsByType('payment');
    const balanceCount = countNotificationsByType('balance');
    const promiseCount = countNotificationsByType('promise');

    return (
        <View style={[baseStyles.viewContainerFull]} >
            <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                <View style={{ paddingVertical: spacing.md }}>
                    <SegmentedControl
                        segments={[
                            { key: 'payment', label: 'Payments', count: paymentCount },
                            { key: 'balance', label: 'Balances', count: balanceCount },
                            { key: 'promise', label: 'Promises', count: promiseCount },
                        ]}
                        selectedKey={activeTab}
                        onSelect={setActiveTab}
                    />
                </View>
                {renderNotifications(activeTab)}
            </ScrollView>
        </View>
    );
}