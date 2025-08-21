import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, RefreshControl, Pressable } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import Person from '../../presentational/Person';
import baseStyles from '../../presentational/BaseStyles'
import EmptyList from "@/presentational/EmptyList";
import SearchBarInput from "@/presentational/SearchBarInput";
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";
import { findFriends, createBalance } from "@/services/api";

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

    const renderContacts = (friends) => {
        if (friends.length == 0 && text === "") return (<EmptyList text={"No friends"}>
            <Text style={baseStyles.label17}>Try adding some {''}
                <Pressable onPress={() => { router.push("/addContact") }}>
                    <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]}>friends</Text>
                </Pressable>
            </Text>
            </EmptyList>
        );
        if (friends.length == 0 && text !== "") return (<EmptyList text={"No people found"}>
            <Text style={baseStyles.label17}>Try searching for a different {''}
                <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]} onPress={() => { setText("") }}>name</Text>
            </Text>
        </EmptyList>)

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
                        <View style={baseStyles.rowCenter}>
                            <TouchableOpacity
                                style={[baseStyles.circleButton, baseStyles.greenBG, baseStyles.marginLeft]}
                                onPress={() => startPromise(friend.id, friend.first_name)}
                            >
                                <MaterialIcons name="attach-money" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[baseStyles.circleButton, baseStyles.blueBG, baseStyles.marginLeft]}
                                onPress={() => startBalance(friend.id)}
                            >
                                <FontAwesome name="balance-scale" size={20} color="white" />
                            </TouchableOpacity>
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
                    <SearchBarInput text={text} setText={setText} />
                    {renderContacts(friends)}
                </ScrollView>
                <FloatingButton icon="add" action={() => { router.push({ pathname: "/addContact", }) }} />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}