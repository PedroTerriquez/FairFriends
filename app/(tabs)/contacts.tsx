import axios from "axios";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '../../presentational/Person';
import { useSession } from "@/services/authContext";
import baseStyles from '../../presentational/BaseStyles'

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
        if (friends.length == 0) return

        return friends.map(friend => (
            <Person person={friend} onClick={navigateProfile} >
                {friend.id && (
                    <View style={baseStyles.rowCenter}>
                        <TouchableOpacity style={[baseStyles.circleButton]} onPress={() => startPromise(friend.id)}>
                            <MaterialIcons name="attach-money" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[baseStyles.circleButton, baseStyles.marginLeft]} onPress={() => startBalance(friend.id)}>
                            <FontAwesome name="balance-scale" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </Person>
        ))
    }

    const startPromise = (id) => {
        navigation.navigate('formPromise', { administrator: id })
    }

    const startBalance = (id) => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/balances/`, { user2_id: id }, session)
            .then((response) => {
                navigation.navigate('balance', { paymentable_id: response.data.id })
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
            <TouchableOpacity style={baseStyles.floatingButton} >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}