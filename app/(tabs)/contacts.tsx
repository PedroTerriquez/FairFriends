import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, RefreshControl, Pressable, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '../../presentational/Person';
import baseStyles from '../../presentational/BaseStyles'
import EmptyList from "@/presentational/EmptyList";
import SearchBarInput from "@/presentational/SearchBarInput";
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";
import { findFriends, createBalance } from "@/services/api";
import ButtonWithIcon from "@/presentational/ButtonWithIcon";

export default function Contacts() {
    const [friends, setFriends] = useState([]);
    const [text, setText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchFriends = async () => {
        setLoading(true);
        setRefreshing(true);
        findFriends(text)
            .then((response) => {
                setFriends(response.data);
            })
            .catch((error) => {
            })
            .finally(() => {
                setRefreshing(false);
                setLoading(false);
            });
    };

    const navigateProfile = (id) => {
        router.push({
            pathname: '/profile',
            params: { id }
        });
    }

    const emptyFriend = <EmptyList text={"No friends"}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <Text style={baseStyles.label17}>Try adding some </Text>
            <Pressable onPress={() => { router.push("/addContact") }}>
                <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]}>friends</Text>
            </Pressable>
        </View>
    </EmptyList>

    const noPeopleFound = <EmptyList text={"No people found"}>
        <Text style={baseStyles.label17}>Try searching for a different {''}
            <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]} onPress={() => { setText("") }}>name</Text>
        </Text>
    </EmptyList>;


    const renderContacts = (friends) => {
        if (friends.length == 0 && text === "") return emptyFriend;
        if (friends.length == 0 && text !== "") return noPeopleFound;

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
                                text='Promise'
                                onPress={() => startPromise(friend.id, friend.first_name)}
                                icon={<MaterialIcons name="attach-money" size={18} color="white" />}
                            />
                            <ButtonWithIcon
                                style={[baseStyles.blueBG]}
                                textStyle={{ fontSize: 10, color: 'white' }}
                                text='Split'
                                onPress={() => startBalance(friend.id)}
                                icon={<FontAwesome name="balance-scale" size={18} color="white" />}
                            />
                        </View>
                    )}
                </Person>
            );
        });
        return fullList;
    }

    const startPromise = (id, name) => {
        router.push({
            pathname: '/formPromise',
            params: { administrator_id: id, administrator_name: name }
        })
    }

    const startBalance = (id) => {
        createBalance([id], undefined)
            .then((response) => {
                router.push({
                    pathname: '/balance',
                    params: { id: response.data.id }
                })
            })
            .catch((error) => {
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchFriends();
        }, [router, text])
    );

    if (loading) return <Spinner />;

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
                    {renderContacts(friends)}
                </ScrollView>
                <FloatingButton icon="add" action={() => { router.push({ pathname: "/addContact", }) }} />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}