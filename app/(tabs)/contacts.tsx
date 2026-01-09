import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, RefreshControl, Pressable, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

import Person from '../../presentational/Person';
import baseStyles from '../../presentational/BaseStyles';
import EmptyList from "@/presentational/EmptyList";
import SearchBarInput from "@/presentational/SearchBarInput";
import FloatingButton from "@/presentational/FloatingButton";
import { findFriends, createBalance } from "@/services/api";
import ButtonWithIcon from "@/presentational/ButtonWithIcon";
import SkeletonWrapper from "@/presentational/SkeletonWrapper";
import { useServer } from "@/services/serverContext";

export default function Contacts() {
    // Hooks
    const { t } = useTranslation();
    const [friends, setFriends] = useState([]);
    const [text, setText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { serverReady } = useServer();

    // Fetch functions
    const fetchFriends = async () => {
        setLoading(true);
        setRefreshing(true);
        findFriends(text)
            .then((response) => {
                setFriends(response.data);
                setLoading(false);
            })
            .catch((error) => {
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    // Navigation functions
    const navigateProfile = (id) => {
        router.push({
            pathname: '/profile',
            params: { id }
        });
    };

    const startPromise = (id, name) => {
        router.push({
            pathname: '/formPromise',
            params: { administrator_id: id, administrator_name: name }
        });
    };

    const startBalance = (id) => {
        createBalance([id], undefined)
            .then((response) => {
                router.push({
                    pathname: '/balance',
                    params: { id: response.data.id }
                });
            })
            .catch((error) => {
            });
    };

    // Render functions
    const renderEmptyFriend = () => (
        <EmptyList text={t('contactsIndex.no_friends')}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                <Text style={baseStyles.label17}>{t('contactsIndex.try_adding_some')} </Text>
                <Pressable onPress={() => { router.push("/addContact") }}>
                    <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]}>{t('contactsIndex.contacts')}</Text>
                </Pressable>
            </View>
        </EmptyList>
    );

    const renderNoPeopleFound = () => (
        <EmptyList text={t('contactsIndex.no_people_found')}>
            <Text style={baseStyles.label17}>{t('contactsIndex.try_searching_for')} {''}
                <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]} onPress={() => { setText('') }}>{t('contactsIndex.hello')}</Text>
            </Text>
        </EmptyList>
    );

    const renderContacts = (friends) => {
        if (friends.length == 0 && text === "") return renderEmptyFriend();
        if (friends.length == 0 && text !== "") return renderNoPeopleFound();

        let fullList = [];

        Object.keys(friends).map((key) => {
            const friend = friends[key];
            fullList.push(
                <Person
                    key={friend.id}
                    person={friend}
                    onClick={navigateProfile}
                >
                    {friend.id && (
                        <View style={[baseStyles.rowCenter, { gap: 5 }]}>                            
                            <ButtonWithIcon
                                style={[baseStyles.successBG]}
                                textStyle={{ fontSize: 10, color: 'white' }}
                                text={t('contactsIndex.promise')}
                                onPress={() => startPromise(friend.id, friend.first_name)}
                                icon={<MaterialIcons name="attach-money" size={18} color="white" />}
                            />
                        </View>
                    )}
                </Person>
            );
        });
        return fullList;
    };

    const renderSkeletons = () => {
        let skeletons = [];
        for (let i = 0; i < 10; i++) {
            skeletons.push(
                <SkeletonWrapper key={i}>
                    <View style={[baseStyles.card, { height: 60 }]} />
                </SkeletonWrapper>
            );
        }
        return <View style={{ gap: 5 }}>{skeletons}</View>;
    };

    // Hooks for lifecycle
    useFocusEffect(
        useCallback(() => {
            fetchFriends();
        }, [router, text])
    ); 

    useEffect(() => {
        if (serverReady) {
            fetchFriends();
        }
    }, [serverReady]);

    // Main return
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView
                    contentContainerStyle={baseStyles.viewContainerFull}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchFriends} />
                    }
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ flex: 1 }}>
                            <SearchBarInput text={text} setText={setText} />
                        </View>
                        <TouchableOpacity
                            onPressIn={() => router.push('/contactRequests')}
                            style={{ padding: 15 }}
                        >
                            <Ionicons name="person-add-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                        { loading ? renderSkeletons() : renderContacts(friends)}
                </ScrollView>
                <FloatingButton icon="add" action={() => { router.push({ pathname: "/addContact", }) }} />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
