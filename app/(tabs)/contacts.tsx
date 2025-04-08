import axios from "axios";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '../../presentational/Person';
import { useSession } from "@/services/authContext";
import baseStyles from '../../presentational/BaseStyles'
import EmptyList from "@/presentational/EmptyList";

export default function Contacts() {
    const [friends, setFriends] = useState([])
    const [text, setText] = useState(null)
    const { session } = useSession();
    const navigation = useNavigation();

    const fetchFriends = async () => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/find`, { search: text }, session)
            .then((response) => {
                console.log(response)
                setFriends(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const navigateProfile = (id) => {
        navigation.navigate('profile' , {id})
    }

    const renderContacts = (friends) => {
        if (friends.length == 0) return EmptyList("No friends")

        return friends.map(friend => (
            <Person person={friend} onClick={navigateProfile} >
                {friend.id && (
                    <View style={baseStyles.rowCenter}>
                        <TouchableOpacity
                            style={[
                                baseStyles.circleButton,
                                baseStyles.green,
                                baseStyles.marginLeft
                            ]}
                            onPress={() => startPromise(friend.id, friend.first_name)}
                        >
                            <MaterialIcons name="attach-money" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                baseStyles.circleButton,
                                baseStyles.blue,
                                baseStyles.marginLeft
                            ]}
                            onPress={() => startBalance(friend.id, friend.first_name)}
                        >
                            <FontAwesome name="balance-scale" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </Person>
        ))
    }

    const startPromise = (id, name) => {
        router.push({
            pathname: '/formPromise',
            params: { administrator_id: id, administrator_name: name }
        })
    }

    const startBalance = (id, name) => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/balances/`, { user2_id: id }, session)
            .then((response) => {
                router.push({
                    pathname: '/balance',
                    params: { paymentable_id: response.data.id }
                })
            })
            .catch((error) => {
            })
    }

    useEffect(() => {
        fetchFriends();
    }, [text]);

    return (
        <View style={baseStyles.viewContainer}>
            <View style={baseStyles.searchBar}>
                <TextInput
                    style={baseStyles.searchBarInput}
                    placeholder="Search"
                    value={text}
                    onChangeText={(newText) => { setText(newText); }}
                    autoFocus={true}
                />
                <TouchableOpacity style={[baseStyles.button, baseStyles.searchBarCancelButton]} onPress={() => setText('')}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={baseStyles.viewContainer}>
                {renderContacts(friends)}
            </ScrollView>
            <TouchableOpacity style={baseStyles.floatingButton}
                onPress={() => { router.push({ pathname: "/addContact", }) }}>
                        <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}