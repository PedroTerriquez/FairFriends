import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Person from '../../presentational/Person';
import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";

export default function addContact() {
    const [people, setPeople] = useState([])
    const [text, setText] = useState("");
    const { session } = useSession();

    const fetchPeople = async () => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/user/find`, { search: text }, session)
            .then((response) => {
                console.log(response)
                setPeople(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    const onAdd = (id) => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/friendships`, { user2_id: id }, session)
            .then((response) => {
                removeCard(id)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const removeCard =(id) => {
        const newPeople = people.filter((person) => person.id !== id)
        setPeople(newPeople)
    }

    const renderPeople = () => {
        if (people.length == 0) return

        return people.map(friend => (
            <Person person={friend}>
                { friend.id && (
                    <TouchableOpacity style={baseStyles.circleButton} onPress={() => onAdd(friend.id)}>
                        <MaterialIcons name="person-add" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </Person>
        ))
    }
    useEffect(() => {
        fetchPeople();
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
            <ScrollView>{renderPeople()}</ScrollView>
        </View>
    );
}