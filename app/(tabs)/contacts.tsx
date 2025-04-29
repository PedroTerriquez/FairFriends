import axios from "axios";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from "react-native";
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
        if (friends.length == 0 && text == null) return EmptyList("No friends")
        if (friends.length == 0 && text != null) return EmptyList("No contacts found")

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
        axios.post(`${process.env.EXPO_PUBLIC_API}/balances/`, { members: [id] }, session)
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={baseStyles.viewContainerFull}>
                <View>
                    <View style={[baseStyles.searchBarInput, baseStyles.viewRowWithSpace]}>
                        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 5 }} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="Search"
                            placeholderTextColor="#666"
                            value={text}
                            onChangeText={(newText) => { setText(newText); }}
                            autoFocus={true}
                        />
                    </View>
                </View>
                {renderContacts(friends)}
                <TouchableOpacity style={baseStyles.floatingButton}
                    onPress={() => { router.push({ pathname: "/addContact", }) }}>
                            <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}